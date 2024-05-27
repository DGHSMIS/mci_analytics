import { memo } from "react";
import { cn } from "tailwind-cn";

export interface HintTextProps {
  text: string;
  className?: string;
}

/**
 * Hint Text for Form Fields
 *
 * @description
 * Company - ARITS Ltd. 4th Jan 2023
 *
 * This component is used to render an hint text on a form field
 */

const HintText = memo(function HintText({ text, className }: HintTextProps) {
  return (
    <p
      className={cn("mt-2 pt-4 text-sm !text-slate-500", className)}
      id="email-description"
    >
      {text}
    </p>
  );
});

export default HintText;
