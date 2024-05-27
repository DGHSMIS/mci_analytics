import ButtonIcon from "@components/library/ButtonIcon";
import { memo, useCallback } from "react";
import { cn } from "tailwind-cn";

export interface ChipProps {
  text?: string;
  size?: string;
  shape?: "rounded" | "rect";
  hasIcon?: boolean;
  className?: string;
  clicked?: () => void;
}

/**
 * Chip Component
 *
 * @description
 * Company - ARITS Ltd.
 * This component is used to render the Chip component
 *
 * @param {string} size The rendering size - sm/md/lg
 * @param {string} shape The shape - rounded/rect
 * @param {string} variant Additional classes can be added
 * @param {string} className Additional classes can be added
 */

const Chip = memo(function Chip({
  text = "Tag / Chip",
  size = "md",
  shape = "rounded",
  hasIcon = true,
  className = "",
  clicked,
}: ChipProps) {
  const handleClick = useCallback(() => {
    console.log("Hello");
    if (clicked) {
      clicked();
    }
  }, [clicked]);
  return (
    <>
      <span
        className={cn(
          "altd-chip ease mr-4 inline-flex w-max cursor-pointer items-center whitespace-nowrap bg-slate-200 font-semibold text-slate-500 hover:bg-slate-300 active:bg-slate-400 active:text-slate-200",
          shape == "rounded" ? "rounded-full" : "",
          size === "sm"
            ? "px-6 py-2 text-xs"
            : size === "md"
            ? "px-8 py-4 text-sm"
            : size === "lg"
            ? "px-8 py-4 text-base"
            : "",
          className
        )}
        onClick={() => {
          handleClick();
        }}
      >
        {text}
        {hasIcon === true && (
          <ButtonIcon
            clicked={() => handleClick()}
            iconSize="16"
            iconName="x"
            className={`relative ${size === "sm" ? "-right-1" : ""}`}
          />
        )}
      </span>
    </>
  );
});

export default Chip;
