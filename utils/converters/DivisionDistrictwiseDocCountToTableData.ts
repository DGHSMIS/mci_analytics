/**
 *
 * Transform the division wise data to a format that can be used by the table
 * Callback function to memoize the results
 * @param input
 */

import { AreaWiseRegistrationStatsProps } from "@utils/interfaces/DataModels/LocalityInterfaces";

export interface AggregatedDivisionDistrictWiseData {
  id: number;
  division_name: string;
  district_name: string;
  reg_count: number | string;
}

export default function DivisionDistrictwiseDocCountToTableData(
  input: AreaWiseRegistrationStatsProps
): AggregatedDivisionDistrictWiseData[] {
  let idCounter = 1;

  const calculatedRes: AggregatedDivisionDistrictWiseData[] = [];

  for (const division in input) {
    // Add division data
    calculatedRes.push({
      id: idCounter++,
      division_name: division,
      district_name: `${division} (Aggregated total)`,
      reg_count: input[division].count,
    });

    // Add district data
    for (const district in input[division].districts) {
      calculatedRes.push({
        id: idCounter++,
        division_name: division,
        district_name: district,
        reg_count: input[division].districts[district].toLocaleString("en-IN"),
      });
    }
  }

  return calculatedRes;
}
