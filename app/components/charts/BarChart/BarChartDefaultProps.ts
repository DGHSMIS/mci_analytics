import { AxisProps } from "@nivo/axes";
import { BarLegendProps } from "@nivo/bar";

export const defaultLeftAxisProps: AxisProps<any> = {
  tickSize: 5,
  tickPadding: 5,
  tickRotation: 45,
  tickValues: undefined,
  legend: "",
  legendPosition: "middle",
  legendOffset: -50,
};

export const defaultBottomAxisProps: AxisProps<any> = {
  tickSize: 5,
  tickPadding: 5,
  tickRotation: -45,
  legend: "",
  legendPosition: "middle",
  legendOffset: 30,
};

export const defaultBarLegend: BarLegendProps[] = [
  {
    dataFrom: "keys",
    anchor: "bottom-right",
    direction: "column",
    justify: false,
    translateX: 120,
    translateY: 0,
    itemsSpacing: 2,
    itemWidth: 100,
    itemHeight: 20,
    itemDirection: "left-to-right",
    itemOpacity: 0.85,
    symbolSize: 20,
  },
];

export const defaultOtherProps = {
  padding: 0.3,
  margin: { top: 50, right: 60, bottom: 50, left: 60 },
  valueScale: { type: "linear" },
  indexScale: { type: "band", round: true },
  labelSkipWidth: 10,
  labelSkipHeight: 10,
  labelTextColor: "#FFF",
  animate: true,
  reverse: false,
  isInteractive: true,
  enableGridX: true,
  enableGridY: true,
  layout: "horizontal",
  isFocusable: true,
  motionConfig: "gentle",
  borderColor: {
    from: "color",
    modifiers: [["darker", 1.6]],
  },
  role: "analyticsChart",
  grid: {
    line: {
      stroke: "#dddddd",
      strokeWidth: 1,
    },
  },
};
