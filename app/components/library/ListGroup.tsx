"use client";

import { memo } from "react";
import { cn } from "tailwind-cn";

export interface ListGroupObject {
  title: string;
  url: string;
  target: string;
  isHeader: boolean;
  isDisabled: boolean;
}

export interface ListGroupProps {
  className?: string;
  items?: Array<ListGroupObject>;
  headerColor?: string; //bg-blue-600
  bodyColor?: string;
}

/**
 * @name ListGroup
 * @description
 * * Company - ARITS Ltd. 16th Jan 2023.
 * * This component is used to render a List Group.
 * @param {string} className Custom class Name for the component class
 * @param {string} items Items for the List Group
 * @param {string} HeaderColor Color for the group header in tailwind bg color class. Example: bg-yellow-500
 * @param {string} BodyColor Color for the group item body in tailwind bg color class. Example: bg-yellow-500
 */

const ListGroup = memo(function ListGroup({
  className = "",
  items = [
    {
      title: "hello world internal",
      url: "#",
      target: "_self",
      isHeader: true,
      isDisabled: false,
    },
  ],
  headerColor = "bg-blue-600",
  bodyColor = "bg-white",
}: ListGroupProps) {
  return (
    <div className="altd-list-group max-w-max rounded-lg border border-gray-200 bg-white text-gray-900">
      {items.map((item, index) => {
        return (
          <>
            {item.isHeader && !item.isDisabled && (
              <a
                href={item.url}
                target={item.target}
                rel="noopener noreferrer"
                aria-current="true"
                className={cn(
                  "block cursor-pointer rounded-t-lg border-b border-gray-200 px-6 py-2 text-white",
                  headerColor,
                  className
                )}
              >
                {item.title}
              </a>
            )}
            {item.isHeader && item.isDisabled && (
              <a
                href={item.url}
                target={item.target}
                aria-current="true"
                className={cn(
                  "block cursor-pointer rounded-t-lg border-b border-gray-200 px-6 py-2 text-amber-300",
                  headerColor,
                  className
                )}
              >
                {item.title}
              </a>
            )}

            {!item.isHeader && !item.isDisabled && (
              <a
                href={item.url}
                target={item.target}
                className={cn(
                  "block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-500 hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-200 focus:text-gray-600 focus:outline-none focus:ring-0",
                  bodyColor,
                  className
                )}
              >
                {item.title}
              </a>
            )}

            {!item.isHeader && item.isDisabled && (
              <a
                href={item.url}
                target={item.target}
                className={cn(
                  "block cursor-default rounded-b-lg border-gray-200 px-6 py-2 text-gray-400 focus:outline-none focus:ring-0",
                  className
                )}
              >
                {item.title}
              </a>
            )}
          </>
        );
      })}
    </div>
  );
});

export default ListGroup;
