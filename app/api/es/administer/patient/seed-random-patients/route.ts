import {
    cassandraClient,
    removeRowsFromDB
} from "@providers/cassandra/cassandra";
import { CASSANDRA_PAGE_SIZE } from "@providers/cassandra/constants";
import {
    getRandomDistrictFromDivisionCode,
    getRandomlySelectedDivisionCode,
    getRandomUpazilaFromDivisionDistrictCode,
    patientSeederInsertQuery,
    seederParams
} from "@providers/cassandra/PatientSeederQueries";
import divisionList from "@utils/constants/DivisionCodes.json";
import { CDPatientInterface } from "@utils/interfaces/Cassandra/CDPatientInterface";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export const dynamic = "force-dynamic";
export const revalidate = true;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

/**
 * This API is used to seed random patients to the database
 * @param req
 * @param res
 * @returns
 */
export async function POST(req: NextRequest) {
  //Check Authorization & respond error if not verified
  // const isNotVerifiedResponse = await checkIfMCIAdminOrApprover(req);
  // if (isNotVerifiedResponse) {
  //   return isNotVerifiedResponse;
  // }
  const isDisabled = true;
  if(isDisabled){
    return NextResponse.json(
      {
        error: `The Operation is currently disabled`,
      },
      {
        status: 500,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      }
    );
  }
  const searchParams: URLSearchParams = req.nextUrl.searchParams;
  console.log(searchParams);
  console.log(searchParams.get("generate"));
  try {
    const generate = searchParams.get("generate");
    const flushdata = searchParams.get("flushdata");
    console.log(generate);
    console.log(flushdata);
    if (flushdata === "true") {
      //First Fetch All Data
      const allRows: CDPatientInterface[] = [];
      let i: number = 0;
      // Define a function to process each page of results
      const getAllPagingatedData = async (
        pageState: any,
        query: string = "SELECT * FROM patient"
      ) => {
        // console.log("Retrieving page with pageState:", pageState);
        console.log("Retrieving page with pageIndex", i);

        // Set the pageState in the query options
        const queryOptions = {
          prepare: true,
          fetchSize: CASSANDRA_PAGE_SIZE,
          pageState,
        };
        // console.log(queryOptions);
        const result: any = await cassandraClient.execute(
          `${query}`,
          [],
          queryOptions
        );

        // console.log(result);
        console.log("Got page with pageState:", result.pageState);
        const rows: CDPatientInterface[] = result.rows;
        console.log(rows.length);
        if (rows) {
          console.log(rows == null);
          // Process each row here...
          // console.log("Pushing page to allRows");
          // console.log(rows);
          allRows.push(...rows);
        }
        i++;

        // Check if there are more pages
        if (result.pageState) {
          console.log("More pages to come" + result.pageState);
          await getAllPagingatedData(result.pageState);
        }
      };

      // Call the getAllPagingatedData function to start retrieving pages
      await getAllPagingatedData(null);
      await removeRowsFromDB(allRows, cassandraClient);
      console.log("Seeder Data Cleared");
      // return res.status(200).json({ error: "Seeder Data Cleared" });
    }
    console.log("Starting to add new data to Cassandra");
    //convert string to number if possible
    const generateNumber = parseInt(generate as string);

    //create for loop to generate requested amount of data
    for (let i = 0; i < generateNumber; i++) {
      // Get a randomly selected Divison ID
      const getRandomDivisionId = getRandomlySelectedDivisionCode(divisionList);
      console.log("The division ID is" + getRandomDivisionId);

      // Get a randomly selected District ID
      const getRandomDistrictId =
        getRandomDistrictFromDivisionCode(getRandomDivisionId);
      console.log("The district ID is" + getRandomDistrictId);

      // Get a randomly selected Upazila
      console.log(
        "Upazila Match Pattern is - " +
          getRandomDivisionId +
          getRandomDistrictId
      );
      const getRandomUpazilaId = getRandomUpazilaFromDivisionDistrictCode(
        getRandomDivisionId,
        getRandomDistrictId
      );
      console.log("The upazila ID is" + getRandomUpazilaId);

      //Constructing the Insert Query
      const query = patientSeederInsertQuery;
      //Prepare the seeder Items
      const params = await seederParams(
        getRandomDivisionId,
        getRandomDistrictId,
        getRandomUpazilaId
      );
      console.log(params);
      // Now execute the query with the params to insert the data
      await cassandraClient.execute(query, params, { prepare: true });
      console.log("Data inserted successfully");
    }

    return NextResponse.json(
      {
        message: generate + " patients have been inserted",
      },
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: `Query failed. Error: ${err}`,
      },
      {
        status: 500,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      }
    );
  }
}
