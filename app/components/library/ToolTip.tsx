import React, { Fragment, memo, useState } from "react";
import { cn } from "tailwind-cn";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position: "top" | "right" | "bottom" | "left" | undefined;
  bgColor?: string;
  caretColor?: string;
  className?: string;
}

/**
 * Tooltip Component
 *
 * @description
 * Company - ARITS Ltd. 19th Jan 2023.
 * This component is used to render the tooltip component. Wrap any component with this tooltip component and it will work out of the box. Additionally, parameters can be passed
 *
  @param {string} text - Body text for the tooltip
	@property {boolean} children — Body of the tooltip Component
	@property {string} position — Postion of the tooltip -  Top | Right | Bottom | Left
	@property {string} bgColor — Background color of the tooltip
	@property {string} bgColor — Caret color of the tooltip - eg: "slate-800"
	@property {string} className — Pass any additional classes
 */

const Tooltip = memo(function Tooltip({
  text,
  children,
  position,
  bgColor = "bg-slate-800",
  caretColor = "slate-800",
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const handleMouseEnter = () => {
    // setTimeout(() => {
    // }, 250);
    setIsVisible(true);
  };
  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  const containerClassList =
    "isolate absolute text-white font-semibold whitespace-nowrap text-sm rounded transition";
  const caretClassList = "h-0 w-0 border-transparent absolute";
  const tooltopClassList = "rounded-sm px-6 py-4 text-xs";

  return (
    <>
      <div className={cn("tool-tip relative z-10 inline-flex", `${className}`)}>
        <span
          className="inline-flex"
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={() => handleMouseLeave()}
        >
          {children}
        </span>

        {/*//+ Top Tooltip */}
        {isVisible && position == "top" && (
          <div
            className={`${containerClassList} -top-28 right-8 translate-x-1/2`}
          >
            <span className={`${tooltopClassList} ${bgColor}`}>
              {/* Caret Down */}
              <span
                className={`${caretClassList} left-1/2 top-full -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-t-${caretColor}`}
              />
              <span>{text}</span>
            </span>
          </div>
        )}

        {/*//+ Right Tooltip */}
        {isVisible && position == "right" && (
          <div
            className={`${containerClassList} left-28 top-full -translate-y-full`}
          >
            <span className={`${tooltopClassList} ${bgColor}`}>
              {/* Caret Down */}
              <span
                className={`${caretClassList} bottom-1/2 right-full translate-y-1/2 border-b-8 border-r-8 border-t-8 border-r-${caretColor}`}
              ></span>
              <span>{text}</span>
            </span>
          </div>
        )}

        {/*//+ Bottom Tooltip */}
        {isVisible && position == "bottom" && (
          <div
            className={`${containerClassList} -bottom-28 right-8 translate-x-1/2`}
          >
            {/* <div className='relative whitespace-nowrap rounded text-sm font-semibold text-white transition '> */}
            <span className={`${tooltopClassList} ${bgColor}`}>
              {/* Caret Down */}
              <span
                className={`${caretClassList} bottom-full left-1/2 -translate-x-1/2 border-b-8 border-l-8 border-r-8 border-b-${caretColor}`}
              ></span>
              <span>{text}</span>
            </span>
          </div>
        )}

        {/*//+ Left Tooltip */}
        {isVisible && position == "left" && (
          <div
            className={`${containerClassList} right-28 top-full -translate-y-full`}
          >
            <span className={`${tooltopClassList} ${bgColor}`}>
              {/* Caret Down */}
              <span
                className={`${caretClassList} bottom-1/2 left-full translate-y-1/2 border-b-8 border-l-8 border-t-8 border-l-${caretColor}`}
              ></span>
              <span>{text}</span>
            </span>
          </div>
        )}
      </div>
    </>
  );
});

export default Tooltip;
