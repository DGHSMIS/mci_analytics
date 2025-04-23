import { AxisProps } from "@nivo/axes";
import { Margin } from "@nivo/core";
import { LegendProps } from "@nivo/legends";
import { Point, PointTooltipProps, ResponsiveLine, Serie } from "@nivo/line";
import { tokens } from "@utils/styles/ThemeToken";
import { timeFormat } from "d3-time-format";
import { differenceInDays, format, parseISO } from "date-fns";
import { memo, Suspense, useMemo } from "react";

interface LineChartProps {
  originalData: Serie[];
  chartTitle?: string;
  useToolTip?: boolean;
}
const maxTicksInDesktop = 10;
const maxTicketsInMobile = 5;
const formatTime = timeFormat("%Y-%m-%d");

const toolTip = memo(function toolTip({ point }: PointTooltipProps) {
  return (
    <PointerBox
      pointData={point}
      row1Header="Client ID:"
      row2Header="Date:"
      row3Header="Verifications:"
    />
  );
});

function LineChartMCI({
  originalData = [],
  chartTitle = "New Registrations",
  useToolTip = false,
}: LineChartProps) {
  // 0) don't render if no data present
  if (!originalData.length) {
    return null;
  }

  const windowWidth = window.innerWidth;
  const colors: any = tokens();

  // 1) derive date range from series data
  const { startDate, endDate } = useMemo<{ startDate: string; endDate: string }>(() => {
    let minDate: Date | null = null;
    let maxDate: Date | null = null;
    originalData.forEach((serie: Serie) => {
      serie.data.forEach((point: any) => {
        const date = new Date(point.x as string);
        if (!minDate || date < minDate) minDate = date;
        if (!maxDate || date > maxDate) maxDate = date;
      });
    });
    const startStr = minDate ? (minDate as Date).toISOString().split("T")[0] : "";
    const endStr = maxDate ? (maxDate as Date).toISOString().split("T")[0] : "";
    return { startDate: startStr, endDate: endStr };
  }, [originalData]);

  // 2) calculate days span and tick interval
  const totalDays = differenceInDays(parseISO(endDate), parseISO(startDate));
  const daysPerTick =
    windowWidth > 400
      ? Math.round(totalDays / maxTicksInDesktop)
      : Math.round(totalDays / maxTicketsInMobile);

  const lineMargins: Margin =
    windowWidth > 400
      ? { top: 40, right: 40, bottom: 100, left: 64 }
      : { top: 40, right: 40, bottom: 200, left: 60 };

  // 3) compute tick values array
  const tickValues = useMemo<Date[]>(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    const step = daysPerTick * oneDay;
    const values: Date[] = [];
    let current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
      values.push(new Date(current));
      current = new Date(current.getTime() + step);
    }
    return values;
  }, [startDate, endDate, daysPerTick]);

  // 4) configure axes and legends
  const axisLeft: AxisProps =
    windowWidth > 400
      ? { tickSize: 4, tickPadding: 8, tickRotation: 0, legend: chartTitle, legendOffset: -52, legendPosition: "middle" }
      : { tickSize: 10, tickPadding: 0, tickRotation: 90, legend: chartTitle, legendOffset: -28, legendPosition: "end" };

  const axisBottom: AxisProps =
    windowWidth > 400
      ? {
          tickSize: 4,
          tickPadding: 20,
          tickRotation: 0,
          format: (value) => formatTime(new Date(value as string)),
          tickValues: `every ${daysPerTick} day`,
          legend: `Last ${totalDays} Days`,
          legendOffset: 72,
          legendPosition: "middle",
        }
      : {
          tickSize: 4,
          tickPadding: 4,
          tickRotation: 90,
          tickValues,
          format: (value) => formatTime(new Date(value as string)),
          legend: `Last ${totalDays} Days`,
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
            effects: [{ on: "hover", style: { itemBackground: "rgba(0, 0, 0, .03)", itemOpacity: 1 } }],
          },
        ]
      : [
          {
            anchor: "bottom-left",
            direction: "column",
            justify: false,
            translateY: 175,
            itemsSpacing: 5,
            itemDirection: "left-to-right",
            itemWidth: 100,
            itemHeight: 14,
            itemOpacity: 0.75,
            symbolSize: 14,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [{ on: "hover", style: { itemOpacity: 0.9 } }],
          },
        ];

  return (
    <Suspense fallback={null}>
      <ResponsiveLine
        data={originalData}
        theme={{
          axis: {
            domain: { line: { stroke: colors.secondary[900] } },
            legend: { text: { fill: colors.primary[900] } },
            ticks: { line: { stroke: colors.primary[900], strokeWidth: 2 }, text: { fill: colors.primary[500] } },
          },
          legends: { text: { fill: colors.secondary[700] } },
          tooltip: { container: { color: colors.slate } },
          background: colors.slate,
        }}
        margin={lineMargins}
        xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
        yScale={{ type: "linear", min: 0, max: "auto", stacked: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={axisBottom}
        axisLeft={axisLeft}
        enableArea={false}
        enableGridX
        enableGridY
        curve="linear"
        lineWidth={2}
        colors={{ scheme: "red_yellow_green" }}
        pointSize={windowWidth > 400 ? 8 : 4}
        pointColor={{ theme: "background" }}
        pointBorderWidth={1}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={12}
        tooltip={useToolTip ? (toolTip as any) : undefined}
        useMesh
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
  const date = new Date(pointData.data.x as string);
  const formattedDate = format(date, "do MMM, yy");
  const count = pointData.data.y as number;
  let pointerText: string = pointData.id;
  if (pointerText.includes(".")) {
    pointerText = pointerText.split(".")[0];
  }
  return (
    <div className="rounded bg-slate-100 p-12 text-primary-900 backdrop:rounded">
      <div className="text-base"><strong className="font-bold">{row1Header}</strong><span className="capitalize"> {pointerText}</span></div>
      <div className="text-base"><strong className="font-bold">{row2Header}</strong><span className="capitalize"> {formattedDate}</span></div>
      <div className="text-base"><strong className="font-bold">{row3Header}</strong><span className="capitalize"> {count.toLocaleString("en-IN")}</span></div>
    </div>
  );
});
