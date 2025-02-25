import { RankListProps } from "@components/globals/RankList/RankListProps";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { Serie } from "@nivo/line";
import { useStore } from "@store/store";
import DateAggregationToLineChartSerieCollection from "@utils/converters/DateAggregationToLineChartSerieCollection";
import { LatestGenderWiseStatsInterface } from "@utils/interfaces/Analytics/PublicDashboard/PublicDashboardInterfaces";
import { AreaWiseRegistrationStatsProps } from "@utils/interfaces/DataModels/LocalityInterfaces";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { signOut } from "next-auth/react";

/**
 * Retrieves division-wise registration statistics within a given date range.
 *
 * @param {Date} minDate - The minimum date for filtering the data.
 * @param {Date} maxDate - The maximum date for filtering the data.
 * @return {Promise<AreaWiseRegistrationStatsProps>} - A promise that resolves to the division-wise registration statistics.
 */
export async function fetchDivisionWiseData(
  minDate: Date,
  maxDate: Date
): Promise<AreaWiseRegistrationStatsProps> {
  console.log("Fetching Division wise Registration Stats");
  //Create Form Data for filtering by date and division
  // const formData = new FormData();
  // formData.append("dateFrom", minDate.toISOString());
  // formData.append("dateTo", maxDate.toISOString());

  // console.log("The form data is ", formData);
  return await getAPIResponse(
    getBaseUrl(),
    getUrlFromName("get-areawise-count-stats")+'?dateFrom='+minDate.toISOString()+"&dateTo="+maxDate.toISOString(),
    "",
    "GET",
    null,
    false,
    getRevalidationTime()
  );
}

interface GetGenderWiseStatsProps {
  sessionFromServer: any;
}

/**
 * Retrieves gender-wise statistics based on the provided session data.
 *
 * @param {GetGenderWiseStatsProps} sessionFromServer - The session data from the server.
 * @returns {Promise<Serie[]>} - A promise that resolves to an array of series representing the gender count statistics.
 */
export default async function getGenderWiseStats({
  sessionFromServer,
}: GetGenderWiseStatsProps) {
  const minDate = useStore.getState().demographyMinDate;
  const maxDate = useStore.getState().demographyMaxDate;
  const lineChartData: Serie[] = await getGenderCountStats(minDate, maxDate);

  async function getGenderCountStats(
    searchMinDate: Date,
    searchMaxDate: Date
  ): Promise<Serie[]> {
    useStore.setState({
      errorInAPI: true,
    });
    const requireAuth = useStore.getState().requireAuth;
    // const formData = new FormData();
    // formData.append("dateFrom", searchMinDate.toISOString());
    // formData.append("dateTo", searchMaxDate.toISOString());
    try {
      const results: LatestGenderWiseStatsInterface =
        await getAPIResponse(
          getBaseUrl(),
          getUrlFromName("get-genderwise-count-stats")+'?dateFrom='+minDate.toISOString()+"&dateTo="+maxDate.toISOString(),
          requireAuth ? sessionFromServer.accessToken || "" : "",
          "GET",
          null,
          false,
          0
        );
      console.log("The Gender results are -");
      console.log(results.length);
      if (results.message == "Unauthorized" && requireAuth) {
        await signOut({
          callbackUrl: "/login",
        });
        return [];
      }
      useStore.setState({
        errorInAPI: false,
      });

      return DateAggregationToLineChartSerieCollection(
        results,
        "hsl(200, 70%, 50%)"
      );
    } catch (error) {
      console.log(error);
      useStore.setState({
        errorInAPI: true,
      });
      return [];
    }
  }

  return lineChartData;
}

/**
 * Fetches the facility service overview data from the server.
 *
 * @param {Date} minDate - The minimum date for filtering the data.
 * @param {Date} maxDate - The maximum date for filtering the data.
 * @return {Promise<RankListProps[]>} A Promise that resolves to an array of RankListProps objects representing the fetched data.
 */
export async function fetchFacilityServiceOverview(
  minDate: Date,
  maxDate: Date
): Promise<RankListProps[]> {
  console.log("Fetching Facility Service Overview");
  //Create Form Data for filtering by date and division
  console.log("The URL is");
  console.log(getUrlFromName("get-facility-service-overview")+'?dateFrom='+minDate.toISOString()+"&dateTo="+maxDate.toISOString());
  const response: RankListProps[] = await getAPIResponse(
    getBaseUrl(),
    getUrlFromName("get-facility-service-overview")+'?dateFrom='+minDate.toISOString()+"&dateTo="+maxDate.toISOString(),
    "",
    "GET",
    null,
    false,
    getRevalidationTime()
  );

  return response;
}
