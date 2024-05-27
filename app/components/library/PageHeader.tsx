"use client";

import Button, { ButtonProps } from "@components/library/Button"; // Import ButtonProps if needed
import ButtonIcon from "@library/ButtonIcon";
import variables from "@variables/variables.module.scss";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { cn } from "tailwind-cn";
import Flyout from "./Flyout";
import Tooltip from "./ToolTip";

export interface PageHeaderProps {
  title: string;
  variant?: "primary" | "secondary" | "neutral";
  titleSize?: "sm" | "md" | "lg";
  subTitle?: string;
  backLink?: "history" | (string & {});
  btn1?: ButtonProps;
  btn2?: ButtonProps;
  btn3?: ButtonProps;
  btn1Clicked?: () => void;
  btn2Clicked?: () => void;
  btn3Clicked?: () => void;
  showTooltip?: boolean;
  tooltipPosition?: "top" | "right" | "bottom" | "left" | undefined;
  btnContainerClassName?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * @name PageHeader
 * @description
 * *Company - ARITS Ltd. 4th Jan 2023.
 * This component is used to render a PageHeader.
 * @param {string} title - Title text for the page header
 * @param {string} subTitle - Title text for the page header
 * @param {string} variant - Title variant
 * !@param {ButtonProps} btn1 - button 1 to display with the header
 * !@param {ButtonProps} btn2 - button 2 to display with the header
 * !@param {ButtonProps} btn3 - URL of the image to be displayed
 * @param {Function} btn1Clicked - Click event on button 1
 * @param {Function} btn2Clicked - Click event on button 2
 * @param {Function} btn3Clicked - Click event on button 3
 */

const PageHeader = memo(function Component({
  title,
  variant = "primary",
  titleSize = "md",
  subTitle,
  backLink,
  btn1,
  btn2,
  btn3,
  btn1Clicked,
  btn2Clicked,
  btn3Clicked,
  showTooltip = false,
  tooltipPosition = "bottom",
  btnContainerClassName,
  className,
  containerClassName,
}: PageHeaderProps) {
  const minTitleLength = 50;
  const shortenedTitle =
    title.length > minTitleLength
      ? title.substring(0, minTitleLength) + "..."
      : title;

  const router = useRouter();
  const [history, setHistoryStatus] = useState<false | History>(false);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const handleClick = (btnNo: number) => {
    if (btnNo === 1 && btn1Clicked) {
      btn1Clicked();
    } else if (btnNo === 2 && btn2Clicked) {
      btn2Clicked();
    } else if (btnNo === 3 && btn3Clicked) {
      btn3Clicked();
    }
  };
  const BackButton = () => {
    return (
      <ButtonIcon
        className="mr-8 inline-flex text-primary-500"
        iconName="arrow-narrow-left"
        clicked={() => {
          if (backLink && backLink !== "history") return router.push(backLink);
          router.back();
        }}
      />
    );
  };

  useEffect(() => {
    window.addEventListener("click", () => {
      if (isFlyoutOpen) {
        setIsFlyoutOpen(false);
      }
    });
  }, [isFlyoutOpen]);

  useEffect(() => {
    // render back button on hydration
    setHistoryStatus(window.history);
  }, []);

  return (
    <div className={cn("flex gap-8", containerClassName)}>
      <div className={cn("flex min-w-max items-center", className)}>
        {titleSize === "sm" && (
          <h4
            className={cn("inline-flex items-center text-primary", {
              "text-primary": variant === "primary",
              "text-secondary": variant === "secondary",
              "text-slate-600/90": variant === "neutral",
            })}
          >
            {backLink && history && (history as History).length > 0 && (
              <BackButton />
            )}
            {showTooltip ? (
              <Tooltip position={tooltipPosition} text={title}>
                {shortenedTitle}
              </Tooltip>
            ) : (
              <span>{shortenedTitle}</span>
            )}
          </h4>
        )}
        {titleSize === "md" && (
          <h3
            className={cn("inline-flex items-center text-primary", {
              "text-primary": variant === "primary",
              "text-secondary": variant === "secondary",
              "text-slate-600/90": variant === "neutral",
            })}
          >
            {backLink && history && (history as History).length > 0 && (
              <BackButton />
            )}
            {showTooltip ? (
              <Tooltip position={tooltipPosition} text={title}>
                {shortenedTitle}
              </Tooltip>
            ) : (
              <span>{shortenedTitle}</span>
            )}
          </h3>
        )}
        {titleSize === "lg" && (
          <h2
            className={cn("inline-flex items-center text-primary", {
              "text-primary": variant === "primary",
              "text-secondary": variant === "secondary",
              "text-slate-600/90": variant === "neutral",
            })}
          >
            {backLink && history && (history as History).length > 0 && (
              <BackButton />
            )}
            {showTooltip ? (
              <Tooltip position={tooltipPosition} text={title}>
                {shortenedTitle}
              </Tooltip>
            ) : (
              <span>{shortenedTitle}</span>
            )}
          </h2>
        )}
        {subTitle && <p>{subTitle}</p>}
      </div>
      <div className="flex w-full items-center justify-end @container">
        <div
          className={cn(
            "hidden w-full flex-wrap items-center justify-end gap-5 @sm:flex",
            btnContainerClassName
          )}
        >
          {btn1 && <Button {...btn1} clicked={() => handleClick(1)} />}
          {btn2 && <Button {...btn2} clicked={() => handleClick(2)} />}
          {btn3 && <Button {...btn3} clicked={() => handleClick(3)} />}
        </div>

        {(btn1 || btn2 || btn3) && (
          <Flyout
            itemsAlign="right"
            controllingComponent={[
              <ButtonIcon
                key={Math.random()}
                className="@sm:hidden"
                iconName="dots-vertical"
                iconColor={variables.gray400}
                clicked={() => {
                  if (!isFlyoutOpen) {
                    setIsFlyoutOpen(true);
                  } else {
                    setIsFlyoutOpen(false);
                  }
                }}
              />,
            ]}
            isOpen={isFlyoutOpen}
            items={[
              btn1 && <Button {...btn1} clicked={() => handleClick(1)} />,
              btn2 && <Button {...btn2} clicked={() => handleClick(2)} />,
              btn3 && <Button {...btn3} clicked={() => handleClick(3)} />,
            ]}
          />
        )}
      </div>
    </div>
  );
});

export default PageHeader;
