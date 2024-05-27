import "server-only";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { ageRangeKeys } from "@utils/constants";
import { ValidateDateAndDivisionResponseInterface } from "@utils/interfaces/FormDataInterfaces";
import { validateFormData } from "@utils/models/Validation";
import { sendErrorMsg } from "@utils/responseHandler";
import { formatISO, set, subYears } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Send the error response if the validation fails
  const { valid, errors, results }: ValidateDateAndDivisionResponseInterface =
    await validateFormData(req, true, false, "Get Gender Wise Stats");
  console.log("The results are ");
  console.table(results);
  if (!valid || !results) {
    return sendErrorMsg(String(errors));
  }
  //Collect the validation params for preocessing
  const { dateFrom, dateTo, divisionInfo } = results;
  console.log("The division info is ");
  console.table(divisionInfo);
  const divisionId = divisionInfo ? divisionInfo.id : null;

  const filterClauses: any = [
    {
      range: {
        created_at: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
    },
  ];
  if (divisionId) {
    filterClauses.push({
      term: {
        division_id: divisionId,
      },
    });
  }
  /**
   * Sets the date by subtracting the specified number of years from today's date and returns it in ISO format.
   *
   * @param {number} yearsFromToday - The number of years to subtract from today's date.
   * @return {string} The date in ISO format.
   */
  function setDateByYears(yearsFromToday: number) {
    return formatISO(
      set(subYears(new Date(), yearsFromToday), {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      })
    );
  }

  const body = {
    size: 0,
    query: {
      bool: {
        filter: filterClauses,
      },
    },
    aggs: {
      age_ranges: {
        range: {
          field: "date_of_birth",
          ranges: [
            {
              from: setDateByYears(200),
              to: setDateByYears(80),
            },
            {
              from: setDateByYears(80),
              to: setDateByYears(75),
            },
            {
              from: setDateByYears(75),
              to: setDateByYears(70),
            },
            {
              from: setDateByYears(70),
              to: setDateByYears(65),
            },
            {
              from: setDateByYears(65),
              to: setDateByYears(60),
            },
            {
              from: setDateByYears(60),
              to: setDateByYears(55),
            },
            {
              from: setDateByYears(55),
              to: setDateByYears(50),
            },
            {
              from: setDateByYears(50),
              to: setDateByYears(45),
            },
            {
              from: setDateByYears(45),
              to: setDateByYears(40),
            },
            {
              from: setDateByYears(40),
              to: setDateByYears(35),
            },
            {
              from: setDateByYears(35),
              to: setDateByYears(30),
            },
            {
              from: setDateByYears(30),
              to: setDateByYears(25),
            },
            {
              from: setDateByYears(25),
              to: setDateByYears(20),
            },
            {
              from: setDateByYears(20),
              to: setDateByYears(15),
            },
            {
              from: setDateByYears(15),
              to: setDateByYears(10),
            },
            {
              from: setDateByYears(10),
              to: setDateByYears(5),
            },
            {
              from: setDateByYears(5),
              to: setDateByYears(-1),
            },
          ],
        },
      },
    },
  };

  try {
    const { body: result } = await esBaseClient.search({
      index: patientESIndex,
      body,
    });

    const ageGroupRegistrations = result.aggregations.age_ranges.buckets.map(
      (bucket: any) => ({
        key: bucket.key,
        doc_count: bucket.doc_count,
      })
    );
    console.log(ageGroupRegistrations);

    const updatedResults = ageGroupRegistrations.map(
      (result: any, index: number) => {
        return {
          key: ageRangeKeys[index],
          doc_count: result.doc_count,
        };
      }
    );

    return NextResponse.json(updatedResults, {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
      },
    });
  }
}
