
import prismaMySQLClient from "@api/providers/prisma/mysql/prismaMySQLClient";
import { VerificationInfoInterface } from "./interfaces/ESNidProxyInterface";
import { nidProxyIndexName, ELASTIC_BATCH_SIZE, DebugElasticProvider } from '@providers/elasticsearch/constants';
import { esBaseClient } from 'app/api/providers/elasticsearch/ESBase';
import fetchAndCacheClientInfo from "@utils/providers/fetchAndCacheClientInfo";

// Elasticsearch index name
export const indexName = nidProxyIndexName;
let indexCount = 0;
const batchSize = ELASTIC_BATCH_SIZE;
const totalDataToFetchFromMYSQL = 500;
/**
 * Function to index all NID Proxy data in Elasticsearch
 */
export async function indexAllNIDProxyDataInESData(): Promise<boolean> {
  try {
    indexCount = 0;
    let pageIndex = 0;

    console.log("Fetching all data from the database");

    while (true) {
      if (DebugElasticProvider) console.log("Retrieving page with pageIndex", pageIndex);

      // 1. Fetch one page of raw rows
      const rows: any[] = await prismaMySQLClient.verification_info.findMany({
        where: { id: { gt: 0 } },
        take: totalDataToFetchFromMYSQL,
        skip: pageIndex * totalDataToFetchFromMYSQL,
      });

      // 2. If no more rows, we're done
      if (rows.length === 0) {
        console.log("All pages processed.");
        break;
      }

      console.log("number of row of nid proxy data to be indexed");
      console.log(rows.length);

      // 3. Convert BigInt → string
      const serializedRows = rows.map((row) => ({
        ...row,
        id: row.id.toString(),
      }));

      console.log("rows of NID Proxy Index data");
      console.log(serializedRows.length);

      // 4. Index this page in batches of `batchSize`
      for (let offset = 0; offset < serializedRows.length; offset += batchSize) {
        const batch = serializedRows.slice(offset, offset + batchSize);

        // Step 1: Sequentially format the data
        const flattenedDocs: any[] = [];
        for (const proxyData of batch) {
          // await each conversion before proceeding
          const docs = await convertDataToNIDProxyDataESFormat(proxyData);
          if (docs.length > 0) {
            flattenedDocs.push(...docs);
          }
        }

        // Step 2: Bulk-index
        if (flattenedDocs.length > 0) {
          if (DebugElasticProvider) {
            indexCount += flattenedDocs.length;
          }
          await esBaseClient.bulk({ index: indexName, body: flattenedDocs });
          if (DebugElasticProvider) {
            console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
          }
        }
      }

      // 5. Move to next page
      pageIndex++;
      if (DebugElasticProvider) console.log("Moving to next page:", pageIndex);
    }

    return true;
  } catch (error) {
    console.error("Error indexing data in Elasticsearch:", error);
    return false;
  }
}



/**
 * Helper function to fetch the highest indexed MySQL id from ES.
 * Returns 0 if no document is found.
 */
async function getLastIndexedId(): Promise<number> {
  try {
    const { body } = await esBaseClient.search({
      index: indexName,
      size: 1,
      body: {
        sort: [
          { generated_at: { order: "desc" } }
        ],
        // only pull back the fields we need
        _source: ["id", "generated_at"],
      },
    });

    if (body.hits && body.hits.hits && body.hits.hits.length > 0) {
      const hit = body.hits.hits[0];
      const highestId = hit?._source.id ?? 0;
      // Check if any hits are returned
      console.log(`Highest indexed ES id: ${highestId}`);
      if (Number.isNaN(highestId)) {
        console.warn("ES returned a non‑numeric id:", hit._source.id);
        return 0;
      }
      return Number(highestId);
    }
    return 0;
  } catch (error) {
    console.error("Error fetching last indexed id from ES:", error);
    return 0;
  }
}

/*
    * Function to index only new NID Proxy data in Elasticsearch
    * Only indexes MySQL rows with an id greater than the highest one already in ES.
    * @returns {Promise<boolean>} - Returns true if indexing is successful, false otherwise
*/
export async function indexNewNIDProxyDataInESData(): Promise<boolean> {
  console.log("Indexing new NID Proxy data in Elasticsearch...");
  console.log("Batch size:", batchSize);
  console.log("Total data to fetch from MySQL:", totalDataToFetchFromMYSQL);
  try {
    indexCount = 0;
    let pageIndex = 0;

    // 1. Get the highest (last) id from ES so we only index new rows from MySQL
    const lastIndexedId: number = await getLastIndexedId();
    console.log("****************************");
    console.log(`Fetching MySQL data with id > ${lastIndexedId}`);
    console.log("****************************");

    while (true) {
      if (DebugElasticProvider) console.log("Retrieving page with pageIndex", pageIndex);

      // 2. Fetch one page of raw rows from MySQL with id greater than lastIndexedId
      const rows: any[] = await prismaMySQLClient.verification_info.findMany({
        where: { id: { gt: lastIndexedId } },
        take: totalDataToFetchFromMYSQL,
        skip: pageIndex * totalDataToFetchFromMYSQL,
      });

      // 3. If no more rows, we’re done
      if (rows.length === 0) {
        console.log("All pages processed.");
        break;
      }

      console.log("Number of rows of new nid proxy data to be indexed:", rows.length);

      // 4. Convert BigInt → string (as before)
      const serializedRows = rows.map((row) => ({
        ...row,
        id: row.id.toString(),
      }));

      console.log("Rows of NID Proxy Index data:", serializedRows.length);

      // 5. Process this page in batches of `batchSize`
      for (let offset = 0; offset < serializedRows.length; offset += batchSize) {
        const batch = serializedRows.slice(offset, offset + batchSize);

        // Step 1: Sequentially format the data
        const flattenedDocs: any[] = [];
        for (const proxyData of batch) {
          // await each conversion before proceeding
          const docs = await convertDataToNIDProxyDataESFormat(proxyData);
          if (docs.length > 0) {
            flattenedDocs.push(...docs);
          }
        }

        // Step 2: Bulk-index (if there's content to send)
        if (flattenedDocs.length > 0) {
          if (DebugElasticProvider) {
            indexCount += flattenedDocs.length;
          }
          await esBaseClient.bulk({ index: indexName, body: flattenedDocs });
          if (DebugElasticProvider) {
            console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
          }
        }
      }

      // 6. Move to next page
      pageIndex++;
      if (DebugElasticProvider) console.log("Moving to next page:", pageIndex);
    }

    return true;
  } catch (error) {
    console.error("Error indexing data in Elasticsearch:", error);
    return false;
  }
}

/*
    * Function to convert data to NID Proxy ES format
    * @param {VerificationInfoInterface} doc - The document to convert
    * @returns {Promise<any>} - The converted document
    */
export async function convertDataToNIDProxyDataESFormat(doc: VerificationInfoInterface) {
  let results = await fetchAndCacheClientInfo(doc.client_id);

  let client_name = "";
  if (results) {
    client_name = results.client_name ?? "";
    console.log("Client Result:", results.client_name ?? "");
  }

  const esDoc: VerificationInfoInterface = {
    id: doc.id,
    client_id: doc.client_id,
    client_name: client_name,
    performer_id: doc.performer_id,
    nid_requested: doc.nid_requested,
    nid_10_digit: doc.nid_10_digit,
    nid_17_digit: doc.nid_17_digit,
    nid_photo: doc.nid_photo,
    brn: doc.brn,
    dob: doc.dob,
    mobile: doc.mobile,
    info_hash: doc.info_hash,
    token: doc.token,
    received_at: doc.received_at,
    generated_at: doc.generated_at,
    time_took_ms: doc.time_took_ms,
    aes_key_salt: doc.aes_key_salt,
    request_doc_type: doc.request_doc_type
  };
  return Promise.resolve([{ index: { _index: indexName, _id: esDoc.id } }, esDoc]);
}