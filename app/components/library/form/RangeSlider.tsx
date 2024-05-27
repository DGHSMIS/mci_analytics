import Label from "@components/library/form/Label";
import { ChangeEvent, memo, useCallback } from "react";
import { cn } from "tailwind-cn";

export interface RangeSliderProps {
  label?: string;
  min?: string;
  max?: string;
  value?: string;
  onChange: any;
  className?: string;
  step?: string;
}

const RangeSlider = memo(function RangeSlider({
  label = "Range label",
  min = "0",
  max = "10",
  value = "",
  onChange,
  className,
  step = "1",
}: RangeSliderProps) {
  const handleClick = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    },
    [onChange]
  );
  return (
    <div className="altd-range-slider relative pt-1">
      {/* <label htmlFor="customRange3" className="text-sm inline-flex mb-4 form-label text-slate-400">
				{label}
			</label> */}
      <Label text={label} />
      <input
        type="range"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleClick(e);
        }}
        className={cn(
          "form-range bg-current-color h-6 w-full appearance-none rounded-full bg-slate-100 p-0 accent-primary-500 focus:shadow-none focus:outline-none focus:ring-0 dark:bg-slate-300 dark:accent-primary-600",
          className
        )}
        min={min}
        max={max}
        step={step}
        id="customRange3"
      />
    </div>
  );
});
export default RangeSlider;
