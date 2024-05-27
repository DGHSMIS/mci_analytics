import { memo } from "react";
import { cn } from "tailwind-cn";

export interface SectionDividerProps {
  text?: string;
  align?: "left" | "right" | "center";
  lineClassName?: string;
  textClassName?: string;
}

/**
 * SectionDivider Component
 *
 * @description
 * Company - ARITS Ltd.
 * This component is used to render the SectionDivider component
 *
  @param {string} text The text that will render within the dividing line
  @param {string} align "left" | "right" | "center"
	@param {string} lineClassName Modifier classes for dividing line
	@param {string} textClassName Modifier classes for text
*/

const SectionDivider = memo(function SectionDivider({
  text = "text",
  align = "center",
  lineClassName,
  textClassName,
}: SectionDividerProps) {
  return (
    <>
      {align == "left" ? (
        <div className="my-8 flex items-center">
          <span
            className={cn(
              "mr-12 text-sm font-normal text-slate-400",
              textClassName
            )}
          >
            {text}
          </span>
          <span
            aria-hidden="true"
            className={cn("h-1 grow rounded bg-slate-200", lineClassName)}
          ></span>
        </div>
      ) : align == "right" ? (
        <div className="my-8 flex items-center">
          <span
            aria-hidden="true"
            className={cn("h-1 grow rounded bg-slate-200", lineClassName)}
          ></span>
          <span
            className={cn(
              "ml-12 text-sm font-normal text-slate-400",
              textClassName
            )}
          >
            {text}
          </span>
        </div>
      ) : align == "center" ? (
        <div className="my-8 flex items-center">
          <span
            aria-hidden="true"
            className={cn("h-1 grow rounded bg-slate-200", lineClassName)}
          ></span>
          <span
            className={cn(
              "mx-12 text-sm font-normal text-slate-400",
              textClassName
            )}
          >
            {text}
          </span>
          <span
            aria-hidden="true"
            className="h-1 grow rounded bg-slate-200"
          ></span>
        </div>
      ) : (
        ""
      )}
    </>
  );
});

export default SectionDivider;
