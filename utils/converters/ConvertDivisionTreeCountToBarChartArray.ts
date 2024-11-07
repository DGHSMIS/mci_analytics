import { BarDatum } from "@nivo/bar";
import {
  divisionCodes,
  primaryMapGradientHue,
  primaryMapGradientSaturation,
  secondaryMapGradientHue,
  secondaryMapGradientSaturation,
} from "@utils/constantsInMemory";
import {
  AreaWiseRegistrationStatsProps,
  DistrictWiseCounter,
  DivisionWiseCounter,
} from "@utils/interfaces/DataModels/LocalityInterfaces";
import { generateHslLightShades } from "@utils/utilityFunctions";

export const ConvertDivisionTreeCountToBarChartArray = (
  registrationData: AreaWiseRegistrationStatsProps
): {
  divisionData: BarDatum[];
  districtData: BarDatum[];
} => {
  const keys = Object.keys(registrationData);
  const divisionBarData: BarDatum[] = [];
  const districtBarData: BarDatum[] = [];
  if (keys[1] == "status") {
    throw new Error("Invalid Division ID");
    // return { divisionData: divisionBarData, districtData: districtBarData };
  }
  const divNameList = Object.values(divisionCodes);
  const divCodeList = Object.keys(divisionCodes);

  const colorArrayForDivisionCharts: string[] = generateHslLightShades(
    primaryMapGradientHue,
    primaryMapGradientSaturation,
    divCodeList.length,
    45,
    10
  );
  // console.log("The registration data is ", registrationData);
  Object.values(registrationData).forEach(
    (item: DivisionWiseCounter, index: number) => {
      /**
       * Division Data Collection
       */
      const nameIndex = divNameList.indexOf(keys[index]);
      const geoCode = divCodeList[nameIndex];
      const divisionItem: BarDatum = {
        id: index,
        geoCode: String(geoCode),
        name: keys[index],
        label: keys[index],
        count: registrationData[keys[index]].count,
      };

      const districtData: DistrictWiseCounter = item.districts;
      // console.log("The district data is ", districtData);

      const districtNameArray = Object.keys(districtData);

      const colorArrayForDistrictCharts: string[] = generateHslLightShades(
        secondaryMapGradientHue,
        secondaryMapGradientSaturation,
        districtNameArray.length,
        70,
        20
      );
      Object.values(districtData).forEach(
        (districtItem, districtIndex: number) => {
          const divisionDistrictItem: BarDatum = {
            name: districtNameArray[districtIndex],
            count: districtItem,
            label: districtNameArray[districtIndex],
            parent_index: index,
            parent_name: keys[index],
            color: colorArrayForDistrictCharts[districtIndex],
          };
          districtBarData.push(divisionDistrictItem);
        }
      );

      //If user requested color array then we give it
      if (colorArrayForDivisionCharts.length > 0) {
        divisionItem.color = colorArrayForDivisionCharts[index];
      }
      divisionBarData.push(divisionItem);
    }
  );
  return { divisionData: divisionBarData, districtData: districtBarData };
};
