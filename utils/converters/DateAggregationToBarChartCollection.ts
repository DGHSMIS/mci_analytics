import { BarDatum } from "@nivo/bar";

/**
 * Transform the data for the Nivo Line Graph
 * @param data
 * @param color
 * @returns
 */
export default function DateAggregationToBarChartCollection(
  data: any
): BarDatum[] {
  const dateWiseCounts: any = {};
  // Helper function to update date-wise counts
  const updateCounts = (array: any, key: any) => {
    array.forEach((item: any) => {
      const date = item.key;
      const count = item.doc_count;

      if (!dateWiseCounts[date]) {
        dateWiseCounts[date] = {};
      }

      dateWiseCounts[date][key] = count;
    });
  };

  // Update counts for 'all', 'male', 'female', and 'others'
  //   updateCounts(data.all, "all");
  updateCounts(data.male, "male");
  updateCounts(data.female, "female");
  updateCounts(data.others, "others");

  // Convert to the array format for Nivo Bar Graph
  const nivoBarData: BarDatum[] = Object.keys(dateWiseCounts).map((date) => {
    return {
      date,
      ...dateWiseCounts[date],
    };
  });
  return nivoBarData;
}
