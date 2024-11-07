"use client";

import { MCISpinner } from "@components/MCISpinner";
import { useStore } from "@store/store";
import { mapData } from "@utils/constantsInMemory";
import { AreaWiseRegistrationStatsProps } from "@utils/interfaces/DataModels/LocalityInterfaces";
import dynamic from "next/dynamic";
import { memo } from "react";

const BangladeshChart = dynamic(() => import("@charts/Map/BangladeshChart"), {
  ssr: false,
});

const DivisionRegistrationListAndBarChart = dynamic(() => import("@components/publicDashboard/sections/demographySection/subSections/DivisionRegistrationListAndBarChart"), {
  ssr: false
});

const AgeDistributionStats = dynamic(() => import("@components/publicDashboard/sections/demographySection/subSections/AgeDistributionStats"), {
  ssr: false
});
const Alert = dynamic(() => import("@library/Alert"), {
  ssr: true,
});

const GenderwiseStats = dynamic(() => import("@components/publicDashboard/sections/demographySection/subSections/GenderwiseStats"), {
  ssr: false,
});

export interface ChartRenderingSectionProps {
  divisionWiseRegistrationCount: AreaWiseRegistrationStatsProps;
}
export default memo(function ChartRenderingSection({
  divisionWiseRegistrationCount,
}: ChartRenderingSectionProps) {
  const {
    apiCallInProgress,
    errorInAPI,
    dashboardDemographicViewState,
    selectedDivision,
  } = useStore();

  console.log("The selected division is: ");
  console.log(selectedDivision);

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-x-20">
      <div className="grid-item  transition-colors">
        <BangladeshChart
          size="md"
          dataToPrint={mapData}
          mapTitle={`${
            selectedDivision.length > 0
              ? `Filter by Division : ${selectedDivision[0]}`
              : "Filter by Division "
          }`}
        />
      </div>
      <div className="grid-item relative lg:col-span-2">
        {apiCallInProgress && <MCISpinner />}
        {!apiCallInProgress && errorInAPI && (
          <Alert
            className="m-20 w-full"
            variant="warning"
            iconName="alert-triangle"
            isIconClicked={false}
            title="Error fetching data"
            body="We are facing some technical difficulties with this API. Please try again later!"
            isBtnGhost={true}
            hideCross={true}
          />
        )}
        {!errorInAPI && dashboardDemographicViewState == 0 && (
          <DivisionRegistrationListAndBarChart
            divisionWiseRegistrationCount={divisionWiseRegistrationCount}
          />
        )}
        {!errorInAPI && dashboardDemographicViewState == 1 && (
          <GenderwiseStats
            lineTitle="Genderwise Timeline Trends"
            pieTitle="Genderwise Cumulative Timeline Overview"
          />
        )}
        {!errorInAPI && dashboardDemographicViewState == 2 && (
          <AgeDistributionStats />
        )}
      </div>
    </div>
  );
});
