"use client";


import dynamic from "next/dynamic";
import React, { memo, startTransition, useState } from "react";
import { cn } from "tailwind-cn";

const ButtonIcon = dynamic(() => import("@library/ButtonIcon"), { ssr: true });
const ToolTip = dynamic(() => import("@library/ToolTip"), { ssr: true });

interface IdPrintAndClickToCopyBlockProps {
  id: string;
  allowCopy?: boolean;
}

const clickToCopyVariable = "Copy";

const IdPrintAndClickToCopyBlock = memo(function IdPrintAndClickToCopyBlock({
                                                                              id,
                                                                              allowCopy = true,
                                                                            }: IdPrintAndClickToCopyBlockProps) {
  const clickedAndCopiedVariable =
    "copied";
  const [isHovered, setIsHovered] = useState(false);
  const [clickToCopyText, setClickToCopyText] = useState(clickToCopyVariable);

  // Browser API for copying to clipboard
  const copyToClipboard = () => {
    if (!allowCopy) return;
    navigator.clipboard
      .writeText(id)
      .then(() => {
        console.log("Copied");
        startTransition(() => {
          setClickToCopyText(clickedAndCopiedVariable);
        });
        // You can also show a toast or some feedback to the user indicating the text has been copied
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleMouseEnterOnCopyIcon = () => {
    if (!isHovered) {
      startTransition(() => {
        setIsHovered(true);
      });
    }
  };
  const handleMouseLeaveFromCopyIcon = () => {
    if (isHovered) {
      startTransition(() => {
        setIsHovered(false);
        setClickToCopyText(clickToCopyVariable);
      });
    }
  };
  return (
    <div className={"justify-content-end w-full flex min-h-[26px]"}>
      <p className={!allowCopy ? "w-full" : ""}>{id}</p>
      <span
        className={"hover:text-primary-500 flex w-full items-end justify-end"}
        onMouseEnter={handleMouseEnterOnCopyIcon}
        onMouseLeave={handleMouseLeaveFromCopyIcon}
      >
        {allowCopy && id != "Unavailable" && (
          <ToolTip
            text={clickToCopyText}
            position="top"
            className="pl-4 mb-4 transition-all"
          >
            <ButtonIcon
              className={cn(
                "hover:cursor-pointer rounded focus:bg-slate-200 focus:text-primary-500 px-4 mb-2",
              )}
              iconName={"copy-06"}
              iconSize="16"
              iconStrokeWidth={isHovered ? "2":"1.5"}
              clicked={copyToClipboard}
            />
          </ToolTip>
        )}
        </span>
    </div>
  );
});

export default IdPrintAndClickToCopyBlock;
