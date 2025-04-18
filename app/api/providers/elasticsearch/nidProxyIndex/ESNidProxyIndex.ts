
import prismaMySQLClient from "@api/providers/prisma/mysql/prismaMySQLClient";
import { VerificationInfoInterface } from "./interfaces/ESNidProxyInterface";
import { nidProxyIndexName, ELASTIC_BATCH_SIZE, DebugElasticProvider } from '@providers/elasticsearch/constants';
import { esBaseClient } from 'app/api/providers/elasticsearch/ESBase';

// Elasticsearch index name
export const indexName = nidProxyIndexName;
let indexCount = 0;
const batchSize = ELASTIC_BATCH_SIZE;
const totalDataToFetchFromMYSQL = 100;
/*
    * Function to index all NID Proxy data in Elasticsearch
    * @returns {Promise<boolean>} - Returns true if indexing is successful, false otherwise
«*/
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
  
        // 2. If no more rows, we’re done
        if (rows.length === 0) {
          console.log("All pages processed.");
          break;
        }
        
        console.log("number of row of nid proxy data tO be indexed");
        console.log(rows.length);
        // console.log("row of nid proxy data TO be indexed");
        // console.log(rows);
        
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
  
          // Step 1: Format the data
          const formattedDocsPromises = batch.map(proxyData =>
            convertDataToNIDProxyDataESFormat(proxyData)
          );
          let formattedDocs = await Promise.all(formattedDocsPromises);
  
          // Filter out empty array responses
          formattedDocs = formattedDocs.filter(doc => doc.length > 0);
  
          // Step 2: Flatten the array
          const flattenedDocs = formattedDocs.reduce((acc, val) => acc.concat(val), []);
  
          // Step 3: Bulk‑index
          if (flattenedDocs.length > 0) {
            if (DebugElasticProvider) { indexCount += flattenedDocs.length; }
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

  
/*
    * Function to convert data to NID Proxy ES format
    * @param {VerificationInfoInterface} doc - The document to convert
    * @returns {Promise<any>} - The converted document
    */
export async function convertDataToNIDProxyDataESFormat(doc: VerificationInfoInterface) {
    const esDoc: VerificationInfoInterface = {
        id: doc.id,
        client_id: doc.client_id,
        client_name: doc.client_name,
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