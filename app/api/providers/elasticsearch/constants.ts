import process from "process";

// Debug Mode
export const DebugElasticProvider = false;

//Elasticsearch Constants
export const requestTimeoutInMS = 6000000; //10 Minutes
export const maxCompressedResponseSize = 1000000000;
export const ELASTICSEARCH_HOST = String(process.env.ELASTIC_IP) || "http://localhost:9200";
export const ELASTIC_BATCH_SIZE = Number(process.env.ELASTIC_BATCH_SIZE) || 500;
export const ELASTIC_USER = String(process.env.ELASTIC_USER) || "";
export const ELASTIC_PASSWORD = String(process.env.ELASTIC_PASSWORD) || "";
// Elasticsearch Index Names
export const patientESIndexName = "cassandra_patients";
export const healthRecordESIndexName="cassandra_health_record_summary"