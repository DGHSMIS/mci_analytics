import process from "process";
/**
 * CASANDRA Constants
 */
export const CASSANDRA_PAGE_SIZE = Number(process.env.CASSANDRA_PAGINATION_SIZE) || 500;
export const CASSANDRA_IP = String(process.env.CASSANDRA_IP) || '127.0.0.1';
export const CASSANDRA_PORT = Number(process.env.CASSANDRA_PORT) || 9042;
export const CASSANDRA_CONNECT_TIMEOUT = Number(process.env.CASSANDRA_CONNECT_TIMEOUT) || 10000;
export const CASSANDRA_READ_TIMEOUT = Number(process.env.CASSANDRA_READ_TIMEOUT) || 15000;
export const CASSANDRA_PAGINATION_SIZE = Number(process.env.CASSANDRA_PAGINATION_SIZE) || 100;
export const CASSANDRA_DATACENTER = String(process.env.CASSANDRA_DATACENTER) || 'datacenter1';
export const CASSANDRA_USER = String(process.env.CASSANDRA_USER) || 'cassandra';
export const CASSANDRA_PASSWORD = String(process.env.CASSANDRA_PASSWORD) || 'cassandra';
export const CASSANDRA_DEFAULT_KEYSPACE = String(process.env.CASSANDRA_DEFAULT_KEYSPACE) || 'mci';
export const CASSANDRA_SHR_KEYSPACE = String(process.env.CASSANDRA_SHR_KEYSPACE) || 'freeshr';
export const CASSANDRA_KEEP_ALIVE = Boolean(process.env.CASSANDRA_KEEP_ALIVE) || true;
export const CASSANDRA_TCP_NODELAY = Boolean(process.env.CASSANDRA_TCP_NODELAY) || true;
export const CASSANDRA_CONSISTENCY = Number(process.env.CASSANDRA_CONSISTENCY) || 1;