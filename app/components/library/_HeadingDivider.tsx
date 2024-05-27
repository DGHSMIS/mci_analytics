import { memo } from "react";

export interface HeadingDividerProps {
  title?: string;
  className?: string;
  position?: "left" | "right" | "center";
}

const HeadingDivider = memo(function HeadingDivider({
  title = "",
  className = "",
  position = "center",
}: HeadingDividerProps) {
  return (
    <>
      {position == "left" ? (
        <h3 className="my-8 flex items-center">
          <span className="mr-12 text-lg font-normal text-slate-500">
            {title}
          </span>
          <span
            aria-hidden="true"
            className="h-1 grow rounded bg-slate-100"
          ></span>
        </h3>
      ) : position == "right" ? (
        <h3 className="my-8 flex items-center">
          <span
            aria-hidden="true"
            className="h-1 grow rounded bg-slate-100"
          ></span>
          <span className="ml-12 text-lg font-normal text-slate-500">
            {title}
          </span>
        </h3>
      ) : position == "center" ? (
        <h3 className="my-8 flex items-center">
          <span
            aria-hidden="true"
            className="h-1 grow rounded bg-slate-100"
          ></span>
          <span className="mx-12 text-lg font-normal text-slate-500">
            {title}
          </span>
          <span
            aria-hidden="true"
            className="h-1 grow rounded bg-slate-100"
          ></span>
        </h3>
      ) : (
        ""
      )}
    </>
  );
});

export default HeadingDivider;
