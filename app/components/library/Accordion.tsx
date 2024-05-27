"use client";

import Icon from "@components/library/Icon";
import React, { useState } from "react";
import { cn } from "tailwind-cn";
import twcolors from "tailwindcss/colors";

/**
 * *Interface for the each accordion item object
 */
export interface AccordionObjectItemProps {
  index: number;
  title: string | JSX.Element;
  titleClassName?: string;
  isDisabled: boolean;
  body: string | JSX.Element;
  bodyClassName?: string;
  barColor?: string;
}

/**
 * *Interface for the accordion
 */
export interface AccordionProps {
  defaultIndex?: number; // default
  items?: Array<AccordionObjectItemProps>;
}

const Accordion = function Accordion({
  defaultIndex = 1,
  items = [
    {
      title: "Accordion 1",
      index: 1,
      isDisabled: false,
      body: "Accordion Body 1",
      barColor: "bg-gray-100",
    },
    {
      title: "Accordion 2",
      index: 2,
      isDisabled: false,
      body: "Accordion Body 2",
      barColor: "bg-gray-100",
    },
  ],
}: AccordionProps) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex || null);

  const handleSetIndex = (index: number | null) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  return (
    <>
      {items.map((item: AccordionObjectItemProps) => (
        <AccordionItem
          key={item.index}
          index={item.index}
          barColor={item.barColor}
          title={item.title}
          titleClassName={item.titleClassName}
          isDisabled={item.isDisabled}
          body={item.body}
          bodyClassName={item.bodyClassName}
          selectedIndex={selectedIndex}
          handleSetIndex={handleSetIndex}
        />
      ))}
    </>
  );
};

/**
 * *Interface for the Accordion Item component
 */
export interface AccordionItemProps {
  title: JSX.Element | string;
  titleClassName?: string;
  body: JSX.Element | string;
  bodyClassName?: string;
  index: number;
  isDisabled?: boolean;
  barColor?: string;
  selectedIndex: number | null;
  handleSetIndex: (index: number) => void;
}

const AccordionItem = function AccordionItem({
  title = "Accordion",
  body = "",
  index = 1,
  isDisabled = false,
  barColor = "bg-gray-100",
  selectedIndex,
  titleClassName,
  bodyClassName,
  handleSetIndex,
}: AccordionItemProps) {
  const isActive = selectedIndex === index;

  return (
    <>
      <div
        onClick={() => handleSetIndex(index)}
        className={cn(
          "altd-accordion group mt-12 flex h-48 items-center justify-between rounded p-10 hover:cursor-pointer",
          barColor
        )}
      >
        <div
          className={cn(
            "font-semibold text-slate-700 group-hover:text-primary",
            titleClassName
          )}
        >
          {title}
        </div>

        <div onClick={() => handleSetIndex(index)}>
          {isDisabled == true ? (
            <Icon
              iconName="chevron-down"
              iconColor={twcolors.slate[400]}
              className="group-hover:stroke-primary"
            />
          ) : isActive ? (
            <Icon
              iconName="chevron-up"
              iconColor={twcolors.slate[400]}
              className="group-hover:stroke-primary"
            />
          ) : (
            <Icon
              iconName="chevron-down"
              iconColor={twcolors.slate[400]}
              className="group-hover:stroke-primary"
            />
          )}
        </div>
      </div>

      {isDisabled == false && isActive && (
        <p
          className={cn("bg-slate-100/20 p-20 !transition-all", bodyClassName)}
        >
          {body}
        </p>
      )}

      {isDisabled == false && !isActive && (
        <p
          className={cn(
            "hidden bg-slate-100/20 p-20 !transition-all",
            bodyClassName
          )}
        >
          {body}
        </p>
      )}

      {isDisabled == true && (
        <p className={cn("pointer-events-none p-20", bodyClassName)}>{body}</p>
      )}
    </>
  );
};

export default Accordion;
