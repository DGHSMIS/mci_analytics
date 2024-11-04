"use client";

import { defaultBarLegend, defaultBottomAxisProps, defaultLeftAxisProps, defaultOtherProps } from "@charts/BarChart/BarChartDefaultProps";

import { TooltipBarChartProps } from "@charts/BarChart/TooltipBarChart";
import { ChartThemeDef } from "@charts/ChartThemeDef";
import { MCISpinner } from "@components/MCISpinner";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { AxisProps } from "@nivo/axes";
import { BarDatum, BarLegendProps } from "@nivo/bar";
import { useStore } from "@store/store";
import { divisionCodes, primaryMapGradientHue, primaryMapGradientSaturation } from "@utils/constants";
import { LatestGenderWiseStatsInterface } from "@utils/interfaces/PublicDashboardInterfaces";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { tokens } from "@utils/ThemeToken";
import { generateHslLightShades, getObjectKeyFromValue } from "@utils/utilityFunctions";
import { size } from "lodash";
import React, { memo, Suspense, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const TooltipBarChart = dynamic(() => import("@charts/BarChart/TooltipBarChart"), {
  ssr: true,
});

const BarChartMCI = dynamic(
  () =>import("@charts/BarChart/BarChartMCI"), {
    ssr: true,
  })
const ChartViewManagerComponent = dynamic(
  () =>import("@components/publicDashboard/sectionFilterSegment/ChartViewManagerComponent"), {
    ssr: true,
  })
export default memo(function AgeDistributionStats() {
  //Theme Stuff
  const colorsTheme: any = tokens();

  const {
    demographyMinDate,
    demographyMaxDate,
    selectedDivision,
    dashboardDemographicViewState,
    setApiCallInProgress,
    setSelectedDivision,
    setErrorInAPI,
  } = useStore();
  const [barChartData, setBarChartData] = useState<BarDatum[]>([]);
  const [isVerticalChart, setIsVerticalChart] = useState(true);
  useEffect(() => {
    if (dashboardDemographicViewState == 2 && barChartData.length == 0) {
      void getAgeGroupStats(demographyMinDate, demographyMaxDate);
    }
  }, [dashboardDemographicViewState, barChartData, demographyMinDate, demographyMaxDate]);

  useEffect(() => {
    if (dashboardDemographicViewState == 2) {
      void getAgeGroupStats(demographyMinDate, demographyMaxDate);
    }
  }, [demographyMinDate, demographyMaxDate, selectedDivision]);

  async function getAgeGroupStats(searchMinDate: Date, searchMaxDate: Date) {
    setErrorInAPI(false);
    setApiCallInProgress(true);
    let queryParams = "?dateFrom="+demographyMinDate.toISOString()+"&dateTo="+demographyMaxDate.toISOString();
    console.log("queryParams", queryParams);
    if (selectedDivision.length > 0) {
      queryParams = queryParams+"&divisionId=" + getObjectKeyFromValue(divisionCodes, selectedDivision[0]);
    }

    try {
      const results: LatestGenderWiseStatsInterface = await getAPIResponse(
        getBaseUrl(),
        getUrlFromName("get-agewise-count-stats")+queryParams,
        "",
        "GET",
        null,
        false,
        getRevalidationTime()
      );
      const finalResults: BarDatum[] = [];
      // create an age range color map
      const shadeArray = generateHslLightShades(
        primaryMapGradientHue,
        primaryMapGradientSaturation,
        size(results),
        40,
        20
      );
      let index = 0;
      for (const key in results) {
        const res: BarDatum = {
          ageRange: results[key].key,
          label: results[key].key,
          count: results[key].doc_count,
        };
        //find key from color map

        res.color = shadeArray[index];
        finalResults.push(res);
        index++;
      }
      setApiCallInProgress(false);
      setErrorInAPI(false);
      setBarChartData(finalResults.reverse());
    } catch (error) {
      console.log(error);
      setApiCallInProgress(false);
      setErrorInAPI(true);
      setBarChartData([]);
    }
  }

  const leftAxisProps: AxisProps<any> = {
    ...defaultLeftAxisProps,
    legend: "Age Groups",
    legendOffset: -40,
  };

  const bottomAxisProps: AxisProps<any> = {
    ...defaultBottomAxisProps,
    legend: "Registration Count",
    legendOffset: 50,
  };
  const barLegend: BarLegendProps[] = [...defaultBarLegend];

  const tooltipProps = (item: any): TooltipBarChartProps => {
    return {
      line1Label: "Age Group: ",
      line1Value: item.indexValue,
      line2Label: "Registrations:",
      line2Value: item.value,
    };
  };

  const otherPropVals = useMemo(() => {
    return {
      ...defaultOtherProps,
      isInteractive: true,
      legend: "Registration Count",
      tooltip: (item: any) => <TooltipBarChart {...tooltipProps(item)} />,
    };
  }, [barChartData]);

  return (
    <div className="w-full transition-colors">
      <ChartViewManagerComponent
        title={`Age Distribution Trends`}
        showBackButton={selectedDivision.length > 0}
        primaryBtnTitle="Bar - Vertical"
        isPrimarySelected={isVerticalChart ?? true}
        primaryIconName="bar-chart-11"
        secondaryBtnTitle="Bar - Horizontal"
        secondaryIconName="horizontal-bar-chart-01"
        showChartSwitcher={true}
        showSecondaryBtn={true}
        onPrimaryClick={() => {
          if (isVerticalChart) return;
          setIsVerticalChart((_prev: any) => !_prev);
        }}
        onSecondaryClick={() => {
          if (!isVerticalChart) return;
          setIsVerticalChart((_prev: any) => !_prev);
        }}
      />
      <div className="h-[640px] w-full  rounded-lg relative">
        <Suspense fallback={<MCISpinner />}>
          <BarChartMCI
            chartTitle="Registration Age Distribution Trends"
            originalData={barChartData}
            indexBy="ageRange"
            groupModeState="stacked"
            keys={["count"]}
            colors={(bar: any) => String(bar.data.color)}
            axisLeft={leftAxisProps}
            axisBottom={bottomAxisProps}
            legend={barLegend}
            otherProps={{
              ...otherPropVals,
              layout: isVerticalChart ? "vertical" : "horizontal",
              valueScale: { type: "linear" },
              margin: {
                top: 50,
                right: 60,
                bottom: 70,
                left: 60,
              },
            }}
            {...ChartThemeDef({
              colors: colorsTheme,
            })}
          />
        </Suspense>
      </div>
    </div>
  );
});
