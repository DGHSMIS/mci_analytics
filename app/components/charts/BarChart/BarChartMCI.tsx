import ChartTitle from "@components/charts/ChartTitle";
import { AxisProps } from "@nivo/axes";
import { BarDatum, BarLegendProps, ResponsiveBar } from "@nivo/bar";
import { memo } from "react";

// export const axisBottomDefault = {
//     tickSize: 5,
//     tickPadding: 5,
//     tickRotation: -45, // Rotate ticks by -45 degrees
//     tickValues: tickValues
//       ? originalData
//           .map((d, i) => (i % tickValues === 0 ? d.date : null))
//           .filter(Boolean)
//       : undefined,
//     legend: bottomLegend,
//     legendPosition: "middle",
//     legendOffset: 30, // Increase the offset to make room for rotated ticks
//   }

interface BarChartProps {
  chartTitle?: string;
  originalData: BarDatum[];
  keys: string[];
  indexBy: string;
  colors?: any | true;
  tickValues?: undefined | number;
  groupModeState: "grouped" | "stacked";
  legend: BarLegendProps[] | undefined;
  axisBottom: AxisProps<any> | undefined | null;
  axisLeft?: AxisProps<any> | undefined | null;
  axisRight?: AxisProps<any> | undefined | null;
  axisTop?: AxisProps<any> | undefined | null;
  otherProps?: any;
  onClicked?: (barEvent: any) => void;
}

function BarChartMCI({
  originalData,
  keys,
  groupModeState = "stacked",
  colors = { scheme: "nivo" },
  axisTop = null,
  axisRight = null,
  axisLeft,
  legend,
  axisBottom,
  indexBy,
  chartTitle,
  otherProps,
  onClicked,
}: BarChartProps) {
  //Override value scale if there are more than 10 bars
  const overideOtherProps = {
    ...otherProps,
    // valueScale: { type: originalData.length > 10 ? "symlog" : "linear" },
  };

  return (
    <>
    <ChartTitle
        title={chartTitle ?? ""}
        // size="lg"
        align="left"
        classNames="mb-12 text-slate-600 text-sm uppercase"
      />
    <ResponsiveBar
      data={originalData}
      keys={keys}
      indexBy={indexBy}
      groupMode={groupModeState}
      colors={colors}
      axisTop={axisTop}
      axisRight={axisRight}
      axisBottom={axisBottom}
      axisLeft={axisLeft}
      legends={legend}
      ariaLabel={chartTitle}
      {...overideOtherProps}
      onClick={(barEvent: any) => {
        if (onClicked) {
          return onClicked(barEvent);
        }
      }}
      className="nivoBar"
    />
    </>
  );
}

export default memo(BarChartMCI);
