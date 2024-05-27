"use client";

import { ButtonProps } from "@components/library/Button";
import React, { memo, useCallback } from "react";

export interface SectionHeaderInterface {
  title?: string;
  titleClass?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  boldText?: string;
  className?: string;
  clicked?: Function;
}

const SectionHeader = memo(function SectionHeader({
  title = "Title",
  titleClass = "",
  subtitle = "",
  align = "center",
  className = "",
  boldText,
  clicked,
}: SectionHeaderInterface) {
  const handleClick = useCallback(() => {
    if (clicked) {
      clicked();
    }
  }, [clicked]);

  const btnProps: ButtonProps = {
    btnText: "MY Button",
    clicked: () => {},
  };

  return (
    <header
      className={`${
        align == "left"
          ? "text-left"
          : align == "center"
          ? "text-center"
          : align == "right"
          ? "text-right"
          : ""
      } ${className}
      space-y-8 pb-16 sm:pb-20
      `}
    >
      <h3 className={`${titleClass}`}>{title}</h3>
      {subtitle.length > 0 && (
        <p
          className={`max-w-2xl text-gray-600 ${
            align == "left"
              ? "mr-auto"
              : align == "center"
              ? "mx-auto"
              : align == "right"
              ? "ml-auto"
              : ""
          }`}
        >
          {subtitle} <b>{boldText}</b>
        </p>
      )}
    </header>
  );
});

export default SectionHeader;
