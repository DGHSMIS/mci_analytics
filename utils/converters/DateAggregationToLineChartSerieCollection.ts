import { Serie } from "@nivo/line";
import { monthNames } from "@utils/constants";
import { LatestGenderWiseStatsInterface } from "@utils/interfaces/PublicDashboardInterfaces";

/**
 * Transform the data for the Nivo Line Graph
 * @param data
 * @param color
 * @returns
 */
export default function DateAggregationToLineChartSerieCollection(
  data: LatestGenderWiseStatsInterface,
  color: any
): Serie[] {
  return Object.keys(data).map((key) => {
    return {
      id: key,
      color: color,
      data: Object.entries(data[key]).map((item: any) => {
        const dateParts = item[1].key.split(" ");
        const monthNumber = monthNames.indexOf(dateParts[1]);
        const dayNumber = parseInt(dateParts[2]);
        const yearNumber = parseInt(dateParts[3]);
        return {
          x: new Date(yearNumber, monthNumber, dayNumber),
          y: item[1].doc_count,
        };
      }),
    };
  });
}
