import React, { memo } from "react";
import { cn } from "tailwind-cn";

interface ChartTitleProps {
  title: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
  classNames?: string;
}

export default memo(function ChartTitle({
  title,
  align = "left",
  size = "lg",
  classNames = "mb-12 text-slate-600 text-sm uppercase",
}: ChartTitleProps) {
  const alignLeft = "justify-start text-left";
  const alignCenter = "justify-center text-center";
  const alignRight = "justify-end text-right";
  const alignClassList =
    align == "left" ? alignLeft : align == "center" ? alignCenter : alignRight;
  const sizeSm = "text-sm";
  const sizeMd = "text-xl";
  const sizeLg = "text-2xl";
  const sizeClassList = size == "sm" ? sizeSm : size == "md" ? sizeMd : sizeLg;
  const classList = alignClassList + " " + sizeClassList + " " + classNames;
  return (
    <h3 className={cn("flex w-fit font-medium capitalize", classList)}>
      {title}
    </h3>
  );
});
