import ChartTitle from "@components/charts/ChartTitle";
import { ColorSchemeId } from "@nivo/colors";
import { Serie } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "@utils/styles/ThemeToken";
import { memo } from "react";

// import data from "public/fake-data/DistrictWiseDataCount.json";

export interface DonutChartProps {
  data: any[];
  chartTitle?: string;
  colorScheme?: ColorSchemeId;
  arcLabelsTextColor?: string;
  showTotalCount?: boolean;
  totalCountLeadText?: string;
}

export default memo(function DonutChartMCI({
  data,
  chartTitle = "",
  colorScheme = "red_yellow_green",
  arcLabelsTextColor = "#ffffff",
  showTotalCount = true,
  totalCountLeadText = "Total -",
}: DonutChartProps) {
  const colors: any = tokens();
  const getValueCount = (data: Serie[]) => {
    let count = 0;
    data.forEach((item) => {
      if(!item.hidden){
        count += item.value;
      }
    });
    return count;
  };
  return (
    <>
      <ChartTitle
        title={chartTitle}
        // size="lg"
        align="left"
        classNames="mb-12 text-slate-600 text-sm uppercase"
      />
      <div className="relative flex flex-col h-full w-full items-center justify-center">
        {data.length > 0 ? (
          <>
            <div className="h-[500px] w-full">
              <ResponsivePie
                data={data}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: colors.secondary[900],
                        textTransform: "capitalize",
                      },
                    },
                    legend: {
                      text: {
                        fill: colors.primary[900],
                        textTransform: "capitalize",
                      },
                    },
                    ticks: {
                      line: {
                        stroke: colors.primary[900],
                        strokeWidth: 2,
                        textTransform: "capitalize",
                      },
                      text: {
                        fill: colors.primary[500],
                        textTransform: "capitalize",
                        strokeWidth: 2,
                      },
                    },
                  },
                  legends: {
                    text: {
                      fill: colors.secondary[700],
                      textTransform: "capitalize",
                    },
                  },
                  tooltip: {
                    container: {
                      color: colors.slate,
                    },
                  },
                  background: colors.slate,
                }}
                margin={{ top: 80, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: colorScheme }}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsThickness={2}
                arcLinkLabelsTextColor={colors.white}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={arcLabelsTextColor}
                defs={[
                  {
                    id: "dots",
                    // type: "patternDots",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    size: 4,
                    padding: 1,
                    stagger: true,
                  },
                  {
                    id: "lines",
                    // type: "patternLines",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                  },
                ]}
                fill={[
                  {
                    match: {
                      id: "region1",
                    },
                    id: "dots",
                  },
                  {
                    match: {
                      id: "region2",
                    },
                    id: "dots",
                  },
                  {
                    match: {
                      id: "region3",
                    },
                    id: "dots",
                  },
                  {
                    match: {
                      id: "region4",
                    },
                    id: "dots",
                  },
                  {
                    match: {
                      id: "others",
                    },
                    id: "lines",
                  },
                ]}
                legends={[
                  {
                    toggleSerie: true,
                    anchor: "bottom-left",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 5,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: colors.primary[600],
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000",
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
            {/* {showTotalCount && (
              <div className="absolute top-[50%-80px] left-[50%-100px] w-[200px] overflow-hidden space-y-24 text-sm font-semibold flex justify-center items-center">
                {totalCountLeadText} {getValueCount(data).toLocaleString("en-IN")}
              </div>
            )} */}
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </>
  );
});
