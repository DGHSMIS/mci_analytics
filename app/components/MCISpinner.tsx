import Spinner from "@library/Spinner";
import { memo } from "react";
import { cn } from "tailwind-cn";

export interface MCISpinnerProps {
  classNames?: string;
}

export const MCISpinner = memo(function MCISpinner({
  classNames = "absolute top-0 left-0 flex h-full w-full items-center justify-center z-10",
}: MCISpinnerProps) {
  return (
    <div className={cn(classNames)}>
      <Spinner
        size="lg"
        variant="primary"
        className="h-36 w-36"
        spinnerText="Fetching analytics data ..."
        containerClassName="w-full h-full bg-white"
      />
    </div>
  );
});
