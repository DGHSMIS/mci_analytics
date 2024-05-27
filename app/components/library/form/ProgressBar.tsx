"use client";

import { memo } from "react";
import { cn } from "tailwind-cn";

export interface ProgressBarProps {
  showPercentage?: boolean; //true/false
  progressValue?: number;
  loadedColor?: string;
  barColor?: string;
  customClass?: string;
  percentageClass?: string;
  onProgress: (e: any) => void;
}

/**
 * Progressbar Component
 *
 * @description
 * Company - ARITS Ltd. 29th Dec 2022.
 * This component is used to render a toggle switch in the app.
 *
 * @param {boolean} showPercentage If true then show the progress value in percentage
 * @param {number} progressValue This value shows the current value of progress in percentage
 * @param {string} loadedColor The color for the already progressed section
 * @param {string} barColor The color for the progress remaining section
 * @param {string} className Custom Tailwind or CSS class which will apply on the progress bar
 * @param {string} textStyle Text style for the percentage value
 * @param {void} onProgress Functionality to take actions based on the progress percentage
 */

const ProgressBar = memo(function ProgressBar({
  showPercentage = true,
  progressValue = 100,
  loadedColor = "min-w-[20px] bg-gradient-to-r from-primary-600 via-primary-500 to-green-500",
  barColor = "bg-slate-200",
  customClass = "h-16",
  percentageClass = "text-slate-50",
  onProgress,
}: ProgressBarProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl dark:bg-slate-700",
        barColor,
        customClass
      )}
    >
      <div
        style={{ width: `${progressValue <= 100 ? progressValue : null}%` }}
        className={cn(
          "absolute left-0 top-0 flex h-full items-center justify-center rounded-2xl text-xs font-semibold text-white",
          loadedColor
        )}
      >
        {showPercentage && progressValue <= 100 && (
          <span className={cn("relative top-1", percentageClass)}>
            {progressValue}%
          </span>
        )}
      </div>
    </div>
  );
});

export default ProgressBar;
