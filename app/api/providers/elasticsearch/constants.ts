import process from "process";

// Debug Mode
export const DebugElasticProvider = String(process.env.NODE_ENV) == "development" ? true : false;

//Elasticsearch Constants
export const requestTimeoutInMS = 30 * 1000; //30 Seconds
export const maxCompressedResponseSize = 50 * 1024 * 1024;// 50 MB
export const ELASTICSEARCH_HOST = String(process.env.ELASTIC_IP).split(",") || "http://127.0.0.1:9200";
export const ELASTIC_BATCH_SIZE = Number(process.env.ELASTIC_BATCH_SIZE) || 500;
export const ELASTIC_USER = String(process.env.ELASTIC_USER) || "";
export const ELASTIC_PASSWORD = String(process.env.ELASTIC_PASSWORD) || "";
// Elasticsearch Index Names
export const patientESIndexName = "cassandra_patients";
export const healthRecordESIndexName="cassandra_health_record_summary"
export const mciServiceLogIndexName="mci_service_request_log"
export const encounterIndexName="shr_encounters"
export const ncdIndexName="pediatric_ncd_index"