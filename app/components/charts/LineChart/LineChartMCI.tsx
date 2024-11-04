import { AxisProps } from "@nivo/axes";
import { Margin } from "@nivo/core";
import { LegendProps } from "@nivo/legends";
import { Point, PointTooltipProps, ResponsiveLine, Serie } from "@nivo/line";
import { tokens } from "@utils/ThemeToken";
import { timeFormat } from "d3-time-format";
import { differenceInDays, format, parseISO } from "date-fns";
import { memo, Suspense, useMemo } from "react";

interface LineChartProps {
  originalData: Serie[];
  chartTitle?: string;
}
const maxTicksInDesktop = 10;
const maxTicketsInMobile = 5;
const formatTime = timeFormat("%Y-%m-%d");

const toolTip = memo(function toolTip({ point }: PointTooltipProps) {
  return <PointerBox pointData={point} />;
});

function LineChartMCI({
  originalData = [],
  chartTitle = "New Registrations",
}: LineChartProps) {
  const windowWidth = window.innerWidth;
  const colors: any = tokens();
  console.log("Original Data", originalData.length);
  console.log(JSON.stringify(originalData));
  // Get startDate and endDate
  const { startDate, endDate } = useMemo(() => {
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    originalData.forEach((serie: Serie) => {
      serie.data.forEach((point: any) => {
        const date = new Date(point.x);
        if (!startDate || date < startDate) {
          startDate = date;
        }
        if (!endDate || date > endDate) {
          endDate = date;
        }
      });
    });

    // Convert to YYYY-MM-DD format
    const startDateStr = startDate
      ? (startDate as Date).toISOString().split("T")[0]
      : "";
    const endDateStr = endDate
      ? (endDate as Date).toISOString().split("T")[0]
      : "";

    return { startDate: startDateStr, endDate: endDateStr };
  }, [originalData]);

  console.log("Start Date", startDate);
  console.log("End Date", endDate);

  const totalDays = differenceInDays(parseISO(endDate), parseISO(startDate));
  console.log("Total Days", totalDays);

  const daysPerTick =
    windowWidth > 400
      ? Math.round(totalDays / maxTicksInDesktop)
      : Math.round(totalDays / maxTicketsInMobile);

  console.log("Days Per Tick", daysPerTick);
  const lineMargins: Margin =
    windowWidth > 400
      ? { top: 40, right: 40, bottom: 100, left: 64 }
      : {
          top: 40,
          right: 40,
          bottom: 200,
          left: 60,
        };

  // Now you can use these dates to generate your tickValues
  const tickValues = useMemo(() => {
    console.log("Tick Values useMemo function");
    const tickDays = daysPerTick; // or whatever value you want
    console.log("Tick Days are -" + tickDays);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const oneCycle = tickDays * oneDay;

    let current = new Date(startDate);
    const last = new Date(endDate);

    const tickValues = [];

    while (current <= last) {
      tickValues.push(new Date(current));
      current = new Date(+current + oneCycle);
    }

    return tickValues;
  }, [startDate, endDate]);

  console.log("Tick Values", tickValues);

  //! Left Axis
  const axisLeft: AxisProps =
    windowWidth > 400
      ? {
          tickSize: 4,
          tickPadding: 8,
          tickRotation: 0,
          // tickValues: yTickValues, // added
          // format: (value) => value,
          legend: chartTitle,
          legendOffset: -52,
          legendPosition: "middle",
        }
      : {
          tickSize: 10,
          tickPadding: 0,
          tickRotation: 90,
          // tickValues: yTickValues, // added
          // format: (value) => value,
          legend: chartTitle,
          legendOffset: -28,
          legendPosition: "end",
        };

  //! Bottom Axis
  const axisBottom: AxisProps =
    windowWidth > 400
      ? {
          tickSize: 4,
          tickPadding: 20,
          tickRotation: 0,
          format: (value) => formatTime(new Date(value)),
          tickValues: `every ${daysPerTick ? daysPerTick : 10} day`,
          legend: `Last ${totalDays ? totalDays : "X"} Days`,
          legendOffset: 72,
          legendPosition: "middle",
        }
      : {
          tickSize: 4,
          tickPadding: 4,
          tickRotation: 90, // rotate the labels by 45 degrees
          tickValues: tickValues,
          format: (value) => formatTime(new Date(value)),
          legend: `Last ${totalDays} Days `,
          legendOffset: 60,
          legendPosition: "middle",
        };

  const legendProps: LegendProps[] =
    windowWidth > 400
      ? [
          {
            anchor: "bottom-right",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 82,
            itemsSpacing: -12,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 18,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .15)",
            symbolBorderWidth: 1,
            // onClick: handleClickLegend,
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]
      : [
          {
            anchor: "bottom-left",
            direction: "column",
            justify: false,
            // translateX: -100,
            translateY: 175,
            itemsSpacing: 5,
            itemDirection: "left-to-right",
            itemWidth: 100,
            itemHeight: 14,
            itemOpacity: 0.75,
            symbolSize: 14,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            // onClick: handleClickLegend,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 0.9,
                },
              },
            ],
          },
        ];
  console.log("originalData");
  return (
    <Suspense>
    <ResponsiveLine
      animate={true}
      data={originalData}
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
      lineWidth={2}
      colors={{ scheme: "red_yellow_green" }}
      margin={lineMargins}
      // xFormat="time:%Y-%m-%d"
      yFormat=" >-.2f"
      xScale={{
        type: "time",
        format: "%Y-%m-%d",
        precision: "day",
      }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      motionConfig="wobbly"
      // areaBaselineValue={yScale.min}
      enableArea={false}
      enableGridX={true}
      enableGridY={true}
      curve="linear"
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottom}
      axisLeft={axisLeft}
      pointSize={windowWidth > 400 ? 8 : 4}
      pointColor={{ theme: "background" }}
      pointBorderWidth={1}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={12}
      // tooltip={toolTip as any}
      useMesh={true}
      legends={legendProps}
    />
    </Suspense>
  );
}

export default memo(LineChartMCI);

interface PointerBoxProps {
  pointData: Point;
  row1Header?: string;
  row2Header?: string;
  row3Header?: string;
}

export const PointerBox = memo(function PointerBox({
  pointData,
  row1Header = "Gender:",
  row2Header = "Date:",
  row3Header = "Registrations:",
}: PointerBoxProps) {
  const date = new Date(pointData.data.x);
  const formattedDate = format(date, "do MMM, yy");
  const count = pointData.data.y;
  let pointerText: string = pointData.id;
  if (pointerText.includes(".")) {
    // console.log(pointerText);
    //remove everything from the first dot onwards
    pointerText = pointerText.split(".")[0];
  }
  return (
    <div
      className={"rounded bg-slate-100 p-12 text-primary-900 backdrop:rounded"}
    >
      <div className="text-base">
        <strong className="font-bold">{row1Header}</strong>{" "}
        <span className="capitalize">{pointerText}</span>
      </div>
      <div className="text-base">
        <strong className="font-bold">{row2Header}</strong>{" "}
        <span className="capitalize">{formattedDate}</span>
      </div>
      <div className="text-base">
        <strong className="font-bold">{row3Header}</strong>{" "}
        <span className="capitalize">{count.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
});
