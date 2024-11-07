import { findDateAndDivisionwiseRegisteringFacilities } from "@utils/esQueries/patientIndex/aggQueriesForRegistrationStats";
import { LatestGenderWiseStatsInterface } from "@utils/interfaces/Analytics/PublicDashboard/PublicDashboardInterfaces";
import { ValidateDateAndDivisionResponseInterface } from "@utils/interfaces/DataModels/ApiRequestQueryParamInterfaces";
import { validateFormData } from "@utils/models/Validation";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandlers/responseHandler";
import { NextRequest } from "next/server";
import "server-only";

// export const dynamic = "force-dynamic";
// export const revalidate = process.env.REVALIDATE_VAR;
// export const fetchCache = "auto";
// export const dynamicParams = true;

/**
 * Fetch the count of documents matching the given division and district ids
 * For each day in the last 30 days
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: NextRequest) {
  // Send the error response if the validation fails
  const { valid, errors, results }: ValidateDateAndDivisionResponseInterface =
    await validateFormData(req, true, false, "Get Gender Wise Stats");
  console.log("The results are ");
  console.table(results);
  if (!valid || !results) {
    return sendErrorMsg(String(errors));
  }
  //Collect the validation params for pre-processing
  const { dateFrom, dateTo, divisionInfo } = results;
  console.log("The division info is ");
  console.table(divisionInfo);
  const divisionId = divisionInfo ? divisionInfo.id : null;
  // Now comes the actual analytics
  // Collect data from the Elasticsearch index
  const data = await fetchDateAndDivisionwiseAggregatedData(
    dateFrom,
    dateTo,
    divisionId
  );
  return sendSuccess(data);
}

/**
 * Contructs the response Object Structure for the API
 * Fetch the count of documents matching the given division and district ids
 * in accordance to daysFromToday which defaults to last 30 days
 * @param daysFrom
 * @param dateTo
 * @param divisionId
 * @returns
 */
async function fetchDateAndDivisionwiseAggregatedData(
  daysFrom: string,
  dateTo: string,
  divisionId: string | null
) {
  try {

    const response = await findDateAndDivisionwiseRegisteringFacilities(daysFrom, dateTo, divisionId);
    const aggregatorReponse: LatestGenderWiseStatsInterface = {};

    // Construct the response object
    console.log("The response is ", (response.body as any).aggregations);
    Object.entries((response.body as any).aggregations).forEach(([key, value]: any) => {
      if (key == "all") {
        aggregatorReponse[key] = value.buckets;
      } else {
        aggregatorReponse[key] = value.date_items.buckets;
      }
      Object.entries(aggregatorReponse[key]).forEach(([_, element], index) => {
        delete element.from_as_string;
        delete element.to_as_string;
        delete element.from;
        delete element.to;
      });
    });
    return aggregatorReponse;
  } catch (error) {
    console.error("Error fetching Elasticsearch data:", error);
    throw error;
  }
}
