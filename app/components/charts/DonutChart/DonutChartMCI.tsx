import { Serie } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "@utils/ThemeToken";
import React, { memo } from "react";
import ChartTitle from "../ChartTitle";

// import data from "public/fake-data/DistrictWiseDataCount.json";

export interface DonutChartProps {
  data: any[];
  chartTitle?: string;
}

export default memo(function DonutChartMCI({
  data,
  chartTitle = "",
}: DonutChartProps) {
  const colors: any = tokens();
  const getValueCount = (data: Serie[]) => {
    let count = 0;
    data.forEach((item) => {
      count += item.value;
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
      {data.length > 0 ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="h-[500px] w-full">
            <ResponsivePie
              data={data}
              theme={{
                axis: {
                  domain: {
                    line: {
                      stroke: colors.secondary[900],
                    },
                  },
                  legend: {
                    text: {
                      fill: colors.primary[900],
                    },
                  },
                  ticks: {
                    line: {
                      stroke: colors.primary[900],
                      strokeWidth: 2,
                    },
                    text: {
                      fill: colors.primary[500],
                    },
                  },
                },
                legends: {
                  text: {
                    fill: colors.secondary[700],
                  },
                },
                tooltip: {
                  container: {
                    color: colors.slate,
                  },
                },
                background: colors.slate,
              }}
              margin={{ top: 40, right: 80, bottom: 120, left: 80 }}
              innerRadius={0.6}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: "red_yellow_green" }}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor={colors.white}
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
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
          <div className="flex w-full items-center justify-center space-y-24 text-sm font-bold">
            Total Registrations- {getValueCount(data).toLocaleString("en-IN")}
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
});
