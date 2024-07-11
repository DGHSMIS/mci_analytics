import Spinner from "@library/Spinner";
import { memo } from "react";
import { cn } from "tailwind-cn";

export interface MCISpinnerProps {
  classNames?: string;
  spinnerText?: string;
  spinnerClassName?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  spinnerContainerClassName?: string;
}

export const MCISpinner = memo(function MCISpinner({
  classNames = "absolute top-0 left-0 flex h-full w-full items-center justify-center z-10",
  spinnerText ="Fetching analytics data ...",
  spinnerClassName = "h-36 w-36",
  size = "lg",
  variant = "primary",
  spinnerContainerClassName="w-full h-full bg-white",
}: MCISpinnerProps) {
  return (
    <div className={cn(classNames)}>
      <Spinner
        size={size}
        variant={variant}
        className={spinnerClassName}
        spinnerText={spinnerText}
        containerClassName={spinnerContainerClassName}
      />
    </div>
  );
});
