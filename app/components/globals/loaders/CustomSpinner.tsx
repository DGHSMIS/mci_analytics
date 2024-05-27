import Spinner from "@library/Spinner";
import React, { memo } from "react";
import { cn } from "tailwind-cn";

interface CustomSpinnerProps {
  containerClassName?: string;
}
export default memo(function CustomSpinner({
  containerClassName,
}: CustomSpinnerProps) {
  return (
    <Spinner
      size="lg"
      variant="primary"
      className="h-36 w-36"
      spinnerText="Fetching analytics data ..."
      containerClassName={cn("w-full h-full", containerClassName)}
    />
  );
});
