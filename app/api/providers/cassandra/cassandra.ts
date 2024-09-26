import { CASSANDRA_CONNECT_TIMEOUT, CASSANDRA_CONSISTENCY, CASSANDRA_DATACENTER, CASSANDRA_DEFAULT_KEYSPACE, CASSANDRA_IP, CASSANDRA_KEEP_ALIVE, CASSANDRA_PAGE_SIZE, CASSANDRA_PAGINATION_SIZE, CASSANDRA_PASSWORD, CASSANDRA_PORT, CASSANDRA_READ_TIMEOUT, CASSANDRA_TCP_NODELAY, CASSANDRA_USER } from "@api/providers/cassandra/constants";
import { commaSeperatedStringToArray } from "@library/utils";
import { CDPatientInterface } from "@utils/interfaces/Cassandra/CDPatientInterface";
import { auth, Client, ClientOptions, policies } from "cassandra-driver";



/**
 * Cassandra connection Properties
 */

const cassandraOptions: ClientOptions = {
  contactPoints: commaSeperatedStringToArray(CASSANDRA_IP),
  protocolOptions: {
    port:CASSANDRA_PORT,
    maxSchemaAgreementWaitSeconds: CASSANDRA_READ_TIMEOUT,
  },
  keyspace: CASSANDRA_DEFAULT_KEYSPACE,
  policies: {
    retry: new policies.retry.RetryPolicy(),
  },
  queryOptions: { consistency: CASSANDRA_CONSISTENCY, fetchSize: CASSANDRA_PAGE_SIZE },
  authProvider: new auth.PlainTextAuthProvider(
    CASSANDRA_USER,
    CASSANDRA_PASSWORD
  ),
  socketOptions: {
    connectTimeout: CASSANDRA_CONNECT_TIMEOUT,
    readTimeout: CASSANDRA_READ_TIMEOUT,
    keepAlive: CASSANDRA_KEEP_ALIVE,
    keepAliveDelay:CASSANDRA_READ_TIMEOUT,
    tcpNoDelay: CASSANDRA_TCP_NODELAY,
  },
  localDataCenter: CASSANDRA_DATACENTER,
};

/**
 * Cassandra connection Properties
 */

// function getCassandraOptions(keyspace: string=CASSANDRA_DEFAULT_KEYSPACE): ClientOptions {
//   const cassandraOptions: ClientOptions = {
//     contactPoints: commaSeperatedStringToArray(CASSANDRA_IP),
//     protocolOptions: {
//       port:CASSANDRA_PORT,
//       maxSchemaAgreementWaitSeconds: CASSANDRA_READ_TIMEOUT,
//     },
//     keyspace: keyspace,
//     policies: {
//       retry: new policies.retry.RetryPolicy(),
//     },
//     queryOptions: { consistency: CASSANDRA_CONSISTENCY, fetchSize: CASSANDRA_PAGE_SIZE },
//     authProvider: new auth.PlainTextAuthProvider(
//       CASSANDRA_USER,
//       CASSANDRA_PASSWORD
//     ),
//     socketOptions: {
//       connectTimeout: CASSANDRA_CONNECT_TIMEOUT,
//       readTimeout: CASSANDRA_READ_TIMEOUT,
//       keepAlive: CASSANDRA_KEEP_ALIVE,
//       keepAliveDelay:CASSANDRA_READ_TIMEOUT,
//       tcpNoDelay: CASSANDRA_TCP_NODELAY,
//     },
//     localDataCenter: CASSANDRA_DATACENTER,
//   };
//   return cassandraOptions;
// }


const cassandraClient = new Client(cassandraOptions);

/**
 * Connect to Cassandra
 */
cassandraClient.connect();

/**
 * Event Tracker to Close connection on server exit
 */
process.on("exit", async (): Promise<void> => {
  await cassandraClient.shutdown();
});

/**
 * Event Tracker to Close connection on request timeout
 */
process.on("SIGTERM", async (): Promise<void> => {
  await cassandraClient.shutdown();
});

/**
 * Event Tracker to Close connection on request cancel
 */
process.on("SIGINT", async (): Promise<void> => {
  await cassandraClient.shutdown();
});

export { cassandraClient };

/**
 * This function can detect rows that have been seeded onto the database
 * and can filter those items & remove them
 */
export const removeRowsFromDB: any = async (
  allRows: Array<any>,
  cdClient: Client
) => {
  //Remove rows which has potential issues
  let rowsToDelete = allRows.filter(
    (item: any) =>
      item.district_id?.length == 1 ||
      item.division_id?.length == 1 ||
      item.upazila_id?.length == 1 ||
      item.district_id === 0 ||
      item.division_id === 0 ||
      item.upazila_id === 0 ||
      item.primary_contact_number_area_code === "02"
  );
  console.log("No ofRows to delete>>");
  console.log(rowsToDelete.length);
  if (rowsToDelete.length === 0) return true;

  for (let row of rowsToDelete) {
    const results = await cdClient.execute(
      `DELETE FROM patient WHERE health_id = ?`,
      [row.health_id],
      { prepare: true }
    );
    // console.log("Delete Response>>");
    // console.log(results);
  }
  console.log("Delete Completed");
  return true;
};

/**
 * Get all patients from Cassandra database via batches
 * @param pageState
 * @param query
 */
export const getCSAllPatients = async (
  pageState: any,
  query: string = "SELECT * FROM patient"
) => {
  const results: CDPatientInterface[] = [];
  let i: number = 0;
  console.log("Retrieving page with pageIndex", i);
  const queryOptions = {
    prepare: true,
    fetchSize: CASSANDRA_PAGINATION_SIZE || 500,
    pageState,
  };

  const result: any = await cassandraClient.execute(
    `${query}`,
    [],
    queryOptions
  );

  const rows: CDPatientInterface[] = result.rows;

  // Process each row here...
  console.log("Pushing page to allRows");
  results.push(...rows);
  i++;

  // Check if there are more pages (Overloaded)
  if (result.pageState) {
    console.log("More pages to come" + result.pageState);
    await getCSAllPatients(result.pageState);
  }
  return results;
};


export const getCSGetPatientByHID = async (hid: string) => {
  console.log("Get Patient HID");
  const query: any = `SELECT * FROM patient where health_id='${hid}' LIMIT 1`;
  const queryOptions = { prepare: true, autoPage: false, readTimeout: 2000 };
  console.log("Retrieving page with pageIndex", 0);
  
  const result: any = await cassandraClient.execute(
    `${query}`,
    [],
    queryOptions
  );
  return result.rows;
}