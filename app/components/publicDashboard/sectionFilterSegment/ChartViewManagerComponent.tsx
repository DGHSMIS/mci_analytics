"use client";

import { IconProps } from "@library/Icon";
import dynamic from "next/dynamic";
import React, { memo } from "react";
import { cn } from "tailwind-cn";

const DemographFilterNavigation = dynamic(
  () =>
    import(
      "@components/publicDashboard/sectionFilterSegment/DemographFilterNavigation"
    ),
  { ssr: true }
);
const Button = dynamic(() => import("@library/Button"), { ssr: true });

const ChartTitle = dynamic(() => import("@charts/ChartTitle"), { ssr: true });

export interface ChartSwitcherComponentProps {
  title: string;
  isPrimarySelected: boolean;
  primaryBtnTitle: string;
  primaryIconName: IconProps["iconName"];
  secondaryIconName: IconProps["iconName"];
  showChartSwitcher: boolean;
  showSecondaryBtn?: boolean;
  secondaryBtnTitle: string;
  showBackButton: boolean;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onBack?: () => void;
}
export default memo(function ChartSwitcherComponent({
  title,
  isPrimarySelected,
  primaryBtnTitle,
  primaryIconName = "horizontal-bar-chart-01",
  secondaryBtnTitle,
  secondaryIconName = "list",
  showChartSwitcher = true,
  showSecondaryBtn = true,
  onPrimaryClick,
  onSecondaryClick,
  showBackButton,
  onBack,
}: ChartSwitcherComponentProps) {
  return (
    <div>
      <div className="ml-24">
        <ChartTitle title={title} size="md" align="left" />
      </div>
      <div className="relative flex w-full items-center justify-end px-24">
        {showBackButton && (
          <DemographFilterNavigation
            onBack={() => {
              if (onBack) {
                onBack();
              }
            }}
          />
        )}
        {showChartSwitcher && (
          <Button
            variant="link"
            btnText={primaryBtnTitle}
            className={cn(
              "font-bold underline-offset-4 hover:underline disabled:border-0",
              isPrimarySelected ? "underline" : ""
            )}
            textClassName={`${
              isPrimarySelected ? "underline" : "!text-slate-500"
            }`}
            iconName={primaryIconName}
            iconColor={`${
              isPrimarySelected ? "currentColor" : "rgb(100 116 139)"
            }`}
            size={"sm"}
            outline={true}
            clicked={() => {
              if (isPrimarySelected) return;
              if (onPrimaryClick) {
                onPrimaryClick();
              }
            }}
          />
        )}
        {showChartSwitcher && showSecondaryBtn && (
          <Button
            variant="link"
            btnText={secondaryBtnTitle}
            className={cn(
              "px-0 font-bold underline-offset-4 hover:underline disabled:border-0",
              isPrimarySelected ? "underline" : ""
            )}
            textClassName={`${
              !isPrimarySelected ? "underline" : "!text-slate-500"
            }`}
            iconName={secondaryIconName}
            iconColor={`${
              !isPrimarySelected ? "currentColor" : "rgb(100 116 139)"
            }`}
            size={"sm"}
            outline={true}
            clicked={() => {
              if (!isPrimarySelected) return;
              if (onSecondaryClick) {
                onSecondaryClick();
              }
            }}
          />
        )}
      </div>
    </div>
  );
})
