"use client";

import { defaultBarLegend, defaultBottomAxisProps, defaultLeftAxisProps, defaultOtherProps } from "@charts/BarChart/BarChartDefaultProps";
import { TooltipBarChartProps } from "@charts/BarChart/TooltipBarChart";
import { ChartThemeDef } from "@charts/ChartThemeDef";
import { MCISpinner } from "@components/MCISpinner";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { BarDatum } from "@nivo/bar";
import { useStore } from "@store/store";
import { ConvertDivisionTreeCountToBarChartArray } from "@utils/converters/ConvertDivisionTreeCountToBarChartArray";
import DivisionDistrictwiseDocCountToTableData, {
  AggregatedDivisionDistrictWiseData,
} from "@utils/converters/DivisionDistrictwiseDocCountToTableData";
import { AreaWiseRegistrationStatsProps } from "@utils/interfaces/DataModels/LocalityInterfaces";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { tokens } from "@utils/styles/ThemeToken";
import { delay } from "lodash";
import { MRT_ExpandedState } from "material-react-table";
import dynamic from "next/dynamic";
import { memo, Suspense, useEffect, useMemo, useRef, useState } from "react";

const ChartViewManagerComponent = dynamic(
  () => import("@components/publicDashboard/sectionFilterSegment/ChartViewManagerComponent"), {
    ssr: false,
  });
const BarChartMCI = dynamic(
  () => import("@charts/BarChart/BarChartMCI"), {
    ssr: false,
  });

const TablePagyCustom = dynamic(
  () => import("@components/table/TablePagyCustom"), {
    ssr: false,
  });

const TooltipBarChart = dynamic(() => import("@charts/BarChart/TooltipBarChart"), {
  ssr: true,
});

interface DivisionRegListAndBarChartProps {
  divisionWiseRegistrationCount: AreaWiseRegistrationStatsProps;
}

export default function DivisionRegistrationListAndBarChart({
                                               divisionWiseRegistrationCount,
                                             }: DivisionRegListAndBarChartProps){
  /*
   * Get the store variables
   */
  const {
    demographyMinDate,
    demographyMaxDate,
    selectedDivision,
    apiCallInProgress,
    setErrorInAPI,
    setApiCallInProgress,
    setSelectedDivision,
  } = useStore();
  //Data from initial render is passed as props ONLY
  const isFirstRender = useRef(true);
  const renderCounter = useRef(0);
  const memorizeInitialData = useMemo(() => {
    return divisionWiseRegistrationCount;
  }, [divisionWiseRegistrationCount]);

  const [renderableData, setRenderableData] =
    useState<AreaWiseRegistrationStatsProps>(memorizeInitialData);
  /**
   * Setup Component States
   */
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>();
  const [tableExpanded, setTableExpanded] = useState<MRT_ExpandedState>({});
  const [tableKey, setTableKey] = useState(0);
  const [isTableView, setIsTableView] = useState<boolean>(false);
  const [barViewState, setBarViewState] = useState<number>(0);



  useEffect(() => {
    setRenderableData(memorizeInitialData);

  }, [memorizeInitialData]);
  /**
   * Memo Function to Get the Bar Chart Data via a transformer
   */
  const generateBarData: {
    divisionData: BarDatum[];
    districtData: BarDatum[];
  } = useMemo(() => {
    const keys = Object.keys(renderableData);
    //Map Color Generator
    const results = ConvertDivisionTreeCountToBarChartArray(renderableData);
    return {
      ...results,
    };
  }, [renderableData]);
  /**
   * Memo Function to Get the Table Data via a transformer
   */
  const divisionDocCountToTableDataConverter: AggregatedDivisionDistrictWiseData[] =
    useMemo(() => {
      return DivisionDistrictwiseDocCountToTableData(renderableData);
    }, [renderableData]);

  /**
   * Get the theme colors for the charts
   */

  const colorsTheme: any = tokens();
  //
  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     console.log("Date Changed New Renderer");
  //     console.log("Render Counter: " + renderCounter.current);
  //     console.log("Min Date: " + demographyMinDate);
  //     console.log("Max Date: " + demographyMaxDate);
  //   } else {
  //     console.log("Date Changed Old Renderer");
  //     console.log("Render Counter: " + renderCounter.current);
  //     console.log("Min Date: " + demographyMinDate);
  //     console.log("Max Date: " + demographyMaxDate);
  //       console.log("Render Counter " + renderCounter.current);
  //     if (renderCounter.current >= 1) {
  //       console.log("Render Counter > 1" + renderCounter.current);
  //       console.log("apiCallProgress " + apiCallInProgress);
  //       if (!apiCallInProgress) {
  //         void fetchFilterdDivisionWiseData();
  //       }
  //     }
  //   }
  // }, [demographyMinDate, demographyMaxDate]);

  useEffect(() => {
    //Setting this to false after the first render
    if (isFirstRender.current) {
      console.log("First Render");
      isFirstRender.current = false;
      renderCounter.current = renderCounter.current + 1;
    } else {
      console.log("Not First Render");
      renderCounter.current = renderCounter.current + 1;
    }
  }, []);

  useEffect(() => {
    setTableData(divisionDocCountToTableDataConverter);
  }, [divisionDocCountToTableDataConverter]);

  async function fetchFilterdDivisionWiseData() {
      setApiCallInProgress(true);
      setErrorInAPI(false);
      await delay(async() => {
        console.log("Fake Delau");
        try {
          console.log("fetchDivisionWiseData from Client Component");
          const fetchTimeFilteredDataX = await getAPIResponse(
            getBaseUrl(),
            getUrlFromName("get-areawise-count-stats") + "?dateFrom=" + demographyMinDate.toISOString() + "&dateTo=" + demographyMaxDate.toISOString(),
            "",
            "GET",
            null,
            false,
            getRevalidationTime(),
          );
          console.log("fetchDivisionWiseData");
          console.log(fetchTimeFilteredDataX);
          setApiCallInProgress(false);
          setErrorInAPI(false);
          setRenderableData(fetchTimeFilteredDataX);
        } catch (e) {
          setApiCallInProgress(false);
          setErrorInAPI(true);
        }
      }, 50);
  }

  const { leftAxisProps, bottomAxisProps, otherPropVals } = useMemo(() => {
    const leftAxisProps = {
      ...defaultLeftAxisProps,
      tickRotation: -45,
      legend: barViewState==0 ? "Divisions":"Districts",
    };

    const bottomAxisProps = {
      ...defaultBottomAxisProps,
      legendOffset: 40,
      borderColor: {
        from: "color",
        modifiers: [["darker", 1.6]],
      },
      legend: "Registration Count",
    };
    const otherPropVals = {
      ...defaultOtherProps,
      isInteractive: true,
      legend: "Registration Count",
      tooltip: (item: any) => (
        <TooltipBarChart {...tooltipProps(item, barViewState)} />
      ),
    };
    return {
      leftAxisProps,
      bottomAxisProps,
      otherPropVals,
    };
  }, [barViewState]);

  //Use Effect Hook
  useEffect(() => {
    console.log("Selected Division Changed");
    console.log(selectedDivision);
    console.log("");
    if (selectedDivision.length > 0) {
      const newTableData = divisionDocCountToTableDataConverter.filter(
        (item: any) => {
          return item.division_name===selectedDivision[0];
        },
      );
      setTableData(newTableData);
      setTableExpanded(true);
      setTableKey((prevKey) => prevKey + 1);

      if (barViewState==0) {
        setBarViewState(1);
      }
    } else {
      if (barViewState==1) {
        setBarViewState(0);
      }
      setTableData(divisionDocCountToTableDataConverter);
      setTableExpanded({});
      setTableKey((prevKey) => prevKey + 1);
    }
    return () => {
      // cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDivision, divisionDocCountToTableDataConverter]);

  return (
    <div className="w-full transition-colors">
      <ChartViewManagerComponent
        title={`Registration stats by ${
          barViewState==0 ? "division":"districts in " + selectedDivision[0]
        }`}
        showBackButton={barViewState==1}
        primaryBtnTitle="Bar"
        isPrimarySelected={!isTableView}
        primaryIconName="horizontal-bar-chart-01"
        secondaryBtnTitle="Table"
        secondaryIconName="list"
        showChartSwitcher={true}
        onBack={() => {
          setBarViewState(0);
        }}
        onPrimaryClick={() => {
          if (!isTableView) return;
          setIsTableView((_prev: any) => !_prev);
        }}
        onSecondaryClick={() => {
          if (isTableView) return;
          setIsTableView((_prev: any) => !_prev);
        }}
      />

      {
        // Show Table View
        isTableView ? (
          <div className="h-full w-full rounded-lg md:mt-24 md:pl-24">
            <Suspense fallback={<MCISpinner />}>
              <TablePagyCustom
                key={tableKey}
                expandAggregated={tableExpanded}
                grouping={["division_name"]}
                // groupingChange={(e: any) => setGroupedBy(e)}
                density="compact"
                enablePagination={false}
                rawData={tableData}
                setExpandedAggregatedState={(e: MRT_ExpandedState) => {
                  setTableExpanded(e);
                }}
                columnHeadersLabel={[
                  {
                    accessorKey: "division_name",
                    header: "Division",
                    maxSize: 180,
                    enableResizing: true,
                    GroupedCell: ({ row }) => {
                      console.log("The row");
                      console.log(row);
                      return row ? <AggregatedCell row={row} />:<> </>;
                    },
                  },
                  {
                    accessorKey: "district_name",
                    header: "District",
                    maxSize: 400,
                    enableResizing: true,
                  },
                  {
                    accessorKey: "reg_count",
                    header: "Total Registrations",
                    maxSize: 200,
                    enableResizing: true,
                  },
                ]}
              />
            </Suspense>
          </div>
        ):(
          //    Show CHart View
          <div className="h-[640px] w-full rounded-lg">
            <Suspense fallback={<MCISpinner />}>
              <BarChartMCI
                chartTitle=""
                originalData={
                  barViewState==0
                    ? generateBarData.divisionData
                    :generateBarData.districtData.filter(
                      (item) => item.parent_name==selectedDivision[0],
                    )
                }
                indexBy="name"
                groupModeState="stacked"
                keys={["count"]}
                colors={(bar: any) => String(bar.data.color)}
                axisLeft={leftAxisProps}
                axisBottom={bottomAxisProps}
                legend={[...defaultBarLegend]}
                otherProps={{
                  ...otherPropVals,
                }}
                onClicked={(barEvent: any) => {
                  if (barViewState==0) {
                    console.log("Event Fired");
                    console.log(barEvent);
                    setSelectedDivision([barEvent.data.name]);
                    setBarViewState(1);
                  }
                }}
                {...ChartThemeDef({
                  colors: colorsTheme,
                })}
              />
            </Suspense>
          </div>
        )
      }
    </div>
  );
};

const AggregatedCell = memo(function AggregatedCell({ row }: any) {
  const aggregatedDataRow: any[] = row.subRows;
  let total = 0;
  if (aggregatedDataRow) {
    aggregatedDataRow.forEach((item: any) => {
      total += item.original.reg_count;
    });
    total = aggregatedDataRow.length
      ? aggregatedDataRow[0].original?.reg_count?.toLocaleString()
      :0;
  }
  return (
    <div>
      <b>{row.original["division_name"]}</b>
      <br />
      Registrations: ({total.toLocaleString()})
    </div>
  );
});

const tooltipProps = (
  item: any,
  chartViewState: number,
): TooltipBarChartProps => {
  return {
    line1Label: `${chartViewState==0 ? "Division:":"District"}`,
    line1Value: item.indexValue,
    line2Label: "Registrations:",
    line2Value: item.value,
  };
};
