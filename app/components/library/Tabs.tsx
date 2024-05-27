"use client";

import Icon, { IconProps } from "@components/library/Icon";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { cn } from "tailwind-cn";
import BadgeNotification from "./BadgeNotification";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

export interface TabItemProps {
  id?: number;
  name: string;
  count?: string;
  current: boolean;
  icon?: IconProps["iconName"];
  isDisabled: boolean;
  apiUrl?: string;
}
export interface TabsProps {
  align?: "left" | "center" | "right";
  tabItems: TabItemProps[];
  itemChanged: (index: number) => void;
}

/**
 @param {TabItemProps} tabItems - The array of tab items with the following properties:
 @param {string} name - The name of the tab
 @param {string} count - The count to be displayed in the badge (optional)
 @param {boolean} current - Is set to true if the tab is the current tab
 @param {string} icon - The icon to be displayed in the tab (optional) and can be blank
 @param {boolean} isDisabled - Is set to true if the tab is disabled
 @param {void} itemChanged - Returns the clicked tab index to the parent component
 *
 * Tab Component
 *
 * * @description
 * * Company - ARITS Ltd. 30th Dec 2022.
 * * This component is used to render a tabbed interface.
 * * The tab component is capable of showing text, icons and badges with counts.
 * * The tab component can have disabled tabs.
 * * On click of a tab, the tab index is returned to the parent component.
 * * The parent component can then use the index to render the content.
 * * Please note,  require('@tailwindcss/forms'), is required in the tailwind.config.js file for this component to work.
 */

const Tabs = memo(function TabComponent({
  align = "left",
  tabItems,
  itemChanged,
}: TabsProps) {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [tabs, setTabs] = useState(tabItems);

  const alignClass =
    align == "left"
      ? "justify-left"
      : align == "center"
      ? "justify-center"
      : "justify-end";
  useEffect(() => {
    tabItems.forEach((element, index) => {
      if (element.current == true) {
        setSelectedTabIndex(index);
      }
    });
  }, []);

  useEffect(() => {
    setTabs((_prev) => {
      const tabArray: TabItemProps[] = [];
      _prev.forEach((item, i) => {
        if (i == selectedTabIndex) {
          item.current = true;
        } else {
          item.current = false;
        }
        tabArray.push(item);
      });
      return tabArray;
    });
    itemChanged(selectedTabIndex);
  }, [selectedTabIndex]);

  //Set the tab index to the tab where property current is true and set all other tabs to false
  const getSelectedTab = (items: TabItemProps[]) => {
    let index = 0;
    let itemFound = false;
    items.forEach((item: TabItemProps, i: number) => {
      console.log("The current index is " + i);
      if (item.current) {
        index = i;
        itemFound = true;
      }
      if (itemFound && index !== i) {
        item.current = false;
      }
    });
    return index;
  };

  //On Changing Tabs on Desktop or Mobile Notify parent to update input params
  const handleClickEvent = useCallback(
    (id: number) => {
      setSelectedTabIndex(id);
    },
    [setSelectedTabIndex]
  );

  console.log("Rendering the tabs component");
  return (
    <>
      {/*
              Mobile menu, show/hide based on menu state.
      */}
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/*
			Use an "onChange" listener to redirect the user to the selected tab URL.
		*/}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-slate-200 p-8 text-base text-slate-600/90 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-slate-600"
          defaultValue={tabs.find((tab: TabItemProps) => tab.current)?.name}
          onChange={(e) => handleClickEvent(e.target.selectedIndex)}
        >
          {tabs.map((tab: any) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      {/*
              Desktop menu, show/hide based on menu state.
      */}
      <div className="hidden sm:block">
        <nav className={`-mb-px flex ${alignClass}`} aria-label="Tabs">
          {tabs.map((tab: any, index) => (
            <a
              onClick={(e) =>
                !tab.isDisabled ? handleClickEvent(index) : null
              }
              key={tab.name}
              className={`${
                tab.isDisabled
                  ? "text-slate-300 hover:cursor-not-allowed hover:text-slate-300"
                  : "flex items-center hover:cursor-pointer"
              } ${classNames(
                tab.current
                  ? "border-primary-500 text-primary-500"
                  : "border-slate-200 text-slate-500 hover:border-slate-200 hover:text-slate-700 dark:border-slate-600",
                "flex whitespace-nowrap border-b px-12 py-6 text-base font-medium transition-colors ease-in-out"
              )}`}
              aria-current={tab.current ? "page" : undefined}
            >
              <>
                {tab.icon &&
                  (tab.icon.length > 0 ? (
                    <Icon
                      iconSize="24px"
                      // iconStrokeWidth='2'
                      className={`${
                        tab.current ? "primary-500" : "slate-500"
                      } px-4`}
                      iconName={tab.icon}
                    />
                  ) : null)}
                {tab.name}
                {tab.count
                  ? tab.count.length > 0 &&
                    tab.count != "0" && <BadgeNotification count={tab.count} />
                  : null}
              </>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
});

export default Tabs;

export interface SkeletonTabsProps {
  tabItemCount: number;
  tabItemCustomClassName?: string;
}

export const SkeletonTab = memo(function SkeletonTab({
  tabItemCount,
  tabItemCustomClassName = "",
}: SkeletonTabsProps) {
  return (
    <>
      {/*
              Mobile menu, show/hide based on menu state.
      */}
      <div className="sm:hidden my-12">
        <Skeleton containerClassName="flex-1 p-8 " height={42} />
      </div>
      {/*
              Desktop menu, show/hide based on menu state.
      */}
      <div className="hidden sm:block">
        <div className={`-mb-px flex justify-start`} aria-label="Tabs">
          {[
            [...Array(tabItemCount)].map((item: any, index) => (
              <span
                key={index.toString()}
                className={cn(
                  "items-center hover:cursor-pointer h-[46ox] whitespace-nowrap border-slate-200 text-slate-500 hover:border-slate-200 hover:text-slate-700 dark:border-slate-600 flex border-b px-12 py-6 text-base font-medium transition-colors ease-in-out",
                  tabItemCustomClassName
                )}
              >
                <Skeleton containerClassName={"flex-1"} height={32} />
              </span>
            )),
          ]}
        </div>
      </div>
    </>
  );
});
