import React, { memo } from "react";

export interface TooltipBarChartProps {
  line1Label: string;
  line1Value: string;
  line2Label: string;
  line2Value: string;
}

const TooltipBarChart = memo(function BarAgePointer({
  line1Label,
  line1Value,
  line2Label,
  line2Value,
}: TooltipBarChartProps) {
  return (
    <div
      className={"rounded bg-slate-100 p-12 text-primary-900 backdrop:rounded"}
    >
      <div className="text-base">
        <strong className="font-bold">{line1Label}&nbsp;</strong>
        {line1Value}
        <div className="capitalize">
          <strong className="font-bold">{line2Label}&nbsp;</strong>
          {line2Value}
        </div>
      </div>
    </div>
  );
});

export default TooltipBarChart;
