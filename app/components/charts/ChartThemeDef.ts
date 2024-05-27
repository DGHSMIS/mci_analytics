export interface ChartThemeDefProps {
  colors: any;
  domainLineStrokeColor?: string;
  legendTextFillColor?: string;
  ticksLineStrokeColor?: string;
  ticksLineStrokeWidth?: number;
  tickTextFillColor?: string;
  legendsTextFillColor?: string;
  tooltipContainerColor?: string;
  backgroundColor?: string;
  otherThemePropObject?: {};
}

export const ChartThemeDef = function ChartThemeDef({
  colors,
  domainLineStrokeColor = "",
  legendTextFillColor = "",
  ticksLineStrokeColor = "",
  ticksLineStrokeWidth = 2,
  tickTextFillColor = "",
  legendsTextFillColor = "",
  tooltipContainerColor = "",
  backgroundColor = "",
  otherThemePropObject = {},
}: ChartThemeDefProps) {
  return {
    theme: {
      axis: {
        domain: {
          line: {
            stroke:
              domainLineStrokeColor.length > 0
                ? domainLineStrokeColor
                : colors.secondary[900],
          },
        },
        legend: {
          text: {
            fill:
              legendTextFillColor.length > 0
                ? legendTextFillColor
                : colors.primary[900],
          },
        },
        ticks: {
          line: {
            stroke:
              ticksLineStrokeColor.length > 0
                ? ticksLineStrokeColor
                : colors.primary[900],
            strokeWidth: ticksLineStrokeWidth,
          },
          text: {
            fill:
              tickTextFillColor.length > 0
                ? tickTextFillColor
                : colors.primary[500],
          },
        },
      },
      legends: {
        text: {
          fill:
            legendsTextFillColor.length > 0
              ? legendsTextFillColor
              : colors.secondary[700],
        },
      },
      tooltip: {
        container: {
          color:
            tooltipContainerColor.length > 0
              ? tooltipContainerColor
              : colors.slate,
        },
      },

      background: backgroundColor.length > 0 ? backgroundColor : colors.slate,
      //Possible Other Theme Props that we can add
      ...otherThemePropObject,
    },
  };
};
