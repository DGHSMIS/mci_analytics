"use client";

import DonutChartMCI from "@charts/DonutChart/DonutChartMCI";
import LineChartMCI from "@charts/LineChart/LineChartMCI";
import { MCISpinner } from "@components/MCISpinner";
import ChartViewManagerComponent from "@components/publicDashboard/sectionFilterSegment/ChartViewManagerComponent";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { Serie } from "@nivo/line";
import { useStore } from "@store/store";
import { divisionCodes } from "@utils/constantsInMemory";
import DateAggregationToLineChartSerieCollection from "@utils/converters/DateAggregationToLineChartSerieCollection";
import LineToPieChartSerieCollection from "@utils/converters/LineToPieChartSerieCollection";
import { LatestGenderWiseStatsInterface } from "@utils/interfaces/Analytics/PublicDashboard/PublicDashboardInterfaces";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { getObjectKeyFromValue } from "@utils/utilityFunctions";
import { memo, Suspense, useEffect, useMemo, useState } from "react";

type GenderwiseStatsProps = {
  lineTitle?: string;
  pieTitle?: string;
};

export default memo(function GenderwiseStats({
  lineTitle = "",
  pieTitle = "",
}: GenderwiseStatsProps) {
  const [genderLineChartData, setGenderLineChartData] = useState<Serie[]>([]);
  const [showingPieChart, setShowingPieChart] = useState(false);

  const {
    demographyMinDate,
    demographyMaxDate,
    selectedDivision,
    apiCallInProgress,
    setApiCallInProgress,
    resetSelectedDivision,
    setErrorInAPI,
  } = useStore();

  async function getGenderCountStats(): Promise<void> {
    setApiCallInProgress(true);
    setErrorInAPI(false);
    try {
      // const formData = new FormData();
      // formData.append("dateFrom", demographyMinDate.toISOString());
      // formData.append("dateTo", demographyMaxDate.toISOString());
      // if (selectedDivision.length > 0) {
      //   const divisionId = String(
      //     getObjectKeyFromValue(divisionCodes, selectedDivision[0]) ?? ""
      //   );
      //   if (!divisionId) {
      //     throw new Error("Invalid division code");
      //   }
      //   formData.append("divisionId", divisionId);
      // }
      let queryParams = "?dateFrom="+demographyMinDate.toISOString()+"&dateTo="+demographyMaxDate.toISOString();
      console.log("queryParams", queryParams);
      if (selectedDivision.length > 0) {
        queryParams = queryParams+"&divisionId=" + getObjectKeyFromValue(divisionCodes, selectedDivision[0]);
      }
      const results: LatestGenderWiseStatsInterface = await getAPIResponse(
        getBaseUrl(),
        getUrlFromName("get-genderwise-count-stats")+queryParams,
        "",
        "GET",
        null,
        false,
        getRevalidationTime()
      );

      setApiCallInProgress(false);
      setErrorInAPI(false);
      setGenderLineChartData(
        DateAggregationToLineChartSerieCollection(results, "hsl(200, 70%, 50%)")
      );
    } catch (e) {
      setApiCallInProgress(false);
      setErrorInAPI(true);
    }
  }

  useEffect(() => {
    console.log("GenderwiseStats - useEffect called");
    if (!apiCallInProgress) {
      void getGenderCountStats();
    }
  }, [demographyMinDate, demographyMaxDate, selectedDivision]);

  const memorizedPieData = useMemo(() => {
    console.log("GenderwiseStats - memorizedPieData called");
    console.log(JSON.stringify(genderLineChartData));
    return LineToPieChartSerieCollection(genderLineChartData);
  }, [genderLineChartData]);

  return (
    <div className="w-full transition-colors">
      <ChartViewManagerComponent
        title={`${showingPieChart ? pieTitle : lineTitle}`}
        showBackButton={selectedDivision.length > 0}
        primaryBtnTitle="Line"
        isPrimarySelected={!showingPieChart}
        primaryIconName="line-chart-up-01"
        secondaryBtnTitle="Pie"
        secondaryIconName="pie-chart-02"
        showChartSwitcher={true}
        onBack={() => {
          resetSelectedDivision();
        }}
        onPrimaryClick={() => {
          if (!showingPieChart) return;
          setShowingPieChart((_prev: any) => !_prev);
        }}
        onSecondaryClick={() => {
          if (showingPieChart) return;
          setShowingPieChart((_prev: any) => !_prev);
        }}
      />

      <div className="h-[640px] w-full  rounded-lg">
        <Suspense fallback={<MCISpinner />}>
          {showingPieChart ? (
            <DonutChartMCI data={memorizedPieData} chartTitle="" />
          ) : (
            <LineChartMCI originalData={genderLineChartData} chartTitle="" />
          )}
        </Suspense>
      </div>
    </div>
  );
});
