
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
    */
export async function indexAllNIDProxyDataInESData() {
    try {
        indexCount = 0;
        const results: VerificationInfoInterface[] = [];
        let i: number = 0;
        console.log("Fetching all data from the database");
        // Define a function to process each page of results
        const getNIDVerificationData = async () => {
            if (DebugElasticProvider) console.log("Retrieving page with pageIndex", i);
            const rows: any[] = await prismaMySQLClient.verification_info.findMany({
                where: {
                    id: {
                        gt: 0, // Fetch rows where id > 0 (optional, can be removed if not needed)
                    },
                },
                take: totalDataToFetchFromMYSQL,
                skip: i * totalDataToFetchFromMYSQL,
            });
            // Process each row here...
            if (DebugElasticProvider) console.log("Pushing page to allRows");
            console.log("row of nid proxy data TO be indexed");
            console.log(rows);

            // Convert BigInt values to strings
            const serializedRows = rows.map((row) => ({
                ...row,
                id: row.id.toString(), // Convert BigInt to string
            }));

            console.log("row of NID Proxy Index data");
            console.log(serializedRows);
            results.push(...serializedRows);
            i++;

            // Check if there are more pages
            if (rows.length == totalDataToFetchFromMYSQL) {
                if (DebugElasticProvider) console.log("More pages to come" + i);
                await getNIDVerificationData();
            }
        };

        // Call the getAllPaginatedData function to start retrieving pages
        await getNIDVerificationData();

        // const rows: any[] = await prismaMySQLClient.verification_info.findMany({
        //     take: 30, // Limit to 30 rows
        // });
        // const serializedRows = rows.map((row) => ({
        //     ...row,
        //     id: row.id.toString(), // Convert BigInt to string
        // }));
        // results.push(...serializedRows);

        //   // Index the data in batches
        for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            // Step 1: Format the data
            const formattedDocsPromises = batch.map(proxyData => convertDataToNIDProxyDataESFormat(proxyData));
            let formattedDocs = await Promise.all(formattedDocsPromises);
            // Filter out empty array responses from formattedDocs
            formattedDocs = formattedDocs.filter(doc => doc.length > 0);
            // Step 2: Flatten the array
            const flattenedDocs = formattedDocs.reduce((acc, val) => acc.concat(val), []);
            // Step 3: Send the data to ES Index, ensuring there's something to index
            if (flattenedDocs.length > 0) {
                if (DebugElasticProvider) { indexCount += flattenedDocs.length; }
                await esBaseClient.bulk({ index: indexName, body: flattenedDocs });
                if (DebugElasticProvider) console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
            }
        }

        return true;
    } catch (error) {
        console.error("Error indexing data in Elasticsearch:", error);
        return false;
    }
}



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