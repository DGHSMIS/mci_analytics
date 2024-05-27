"use client";

import ButtonIcon from "@components/library/ButtonIcon";
import BadgeNotification from "@library/BadgeNotification";
import DropDownSingle from "@library/form/DropDownSingle";
import Icon from "@library/Icon";
import SvgImage from "@library/SvgImage";
import Link from "next/link";
import { memo, useCallback } from "react";
import { cn } from "tailwind-cn";
import config from "../../../../../tailwind.config";
import {
  ModuleItemProps,
  ModuleSubItemProps,
  SidebarProps,
} from "./SidebarProps";

// const tailwindConfig = getConfig()
/**
 * @param moduleList List of Modules
 * @param selectedModule Selected Module
 * @param className Custom class Name for the component class
 * @param sideBarStatus Status of the Sidebar
 * @param stateChange State Change
 * @param onSidebarToggle On Sidebar Toggle
 * @param isModuleChanged   Is Module Changed
 * @param onMenuSubItemToggle On Menu Sub Item Toggle
 * @param onMenuItemChanged On Menu Item Changed
 * @param showMobileSidebar Show Mobile Sidebar
 * @param hideMobileSidebar Hide Mobile Sidebar
 * @param madeBy Set Developer name
 * @param alignDevNameToCenter Align Developer name/credits to center
 * @name Sidebar
 * @description
 * * Company - ARITS Ltd. 29th Jan 2023.
 * * This component is used to render a Sidebar
 * * This component's rendering is controlled by layout-partial.tsx
 */

const Sidebar = memo(function Sidebar(sidebarProps: SidebarProps) {
  const colorList: any = config?.theme?.extend?.colors as any;
  // Made By Text
  const madeBy = sidebarProps.madeBy ? sidebarProps.madeBy : "ARITS Ltd.";
  const alignDevNameToCenter = sidebarProps.alignDevNameToCenter
    ? "text-center"
    : "text-left";
  //On Changing the Dropdown to switch modules
  const handleDDChange = useCallback(
    (e: number) => {
      console.log("User Updated the Selected Module - letting parent know");
      console.log(e);
      if (sidebarProps.isModuleChanged) {
        sidebarProps.isModuleChanged(e);
      }
    },
    [sidebarProps]
  );

  //On Changing the Menu Item
  const handleMenuItemChange = useCallback(
    (index: number, isSubMenu?: boolean, subItemIndex?: number) => {
      console.log("The type is");
      console.log(index);
      console.log(subItemIndex);
      if (sidebarProps.onMenuItemChanged) {
        if (isSubMenu && subItemIndex !== undefined) {
          sidebarProps.onMenuItemChanged(index, isSubMenu, subItemIndex);
        } else {
          sidebarProps.onMenuItemChanged(index);
        }
      }
    },
    [sidebarProps]
  );

  // const toggleSubMenuState = (index: number) => {
  //   const newSubMenuOpen = [...subMenuOpen];
  //   newSubMenuOpen[index].isOpen = !newSubMenuOpen[index].isOpen;
  //   setSubMenuOpen(newSubMenuOpen);
  // };

  return (
    <nav
      className={cn(
        "hidden h-screen border-r border-slate-200 bg-navBg py-16 dark:border-slate-600 dark:bg-slate-700 md:block",

        typeof sidebarProps.sideBarStatus == "undefined"
          ? "w-[70px]"
          : sidebarProps.sideBarStatus
          ? "w-[232px]"
          : "w-[70px]"
      )}
    >
      <div className="flex h-24 items-center justify-between px-24">
        <Link href="/" className="inline-block">
          <SvgImage
            className={cn("logo", !sidebarProps.sideBarStatus && "hidden")}
            svgPath="/img/logo.svg"
          />
        </Link>
        <button
          onClick={() => {
            if (sidebarProps.onSidebarToggle) {
              sidebarProps.onSidebarToggle();
            }
          }}
          className={cn(
            "focus:outline-none",
            sidebarProps.sideBarStatus ? "" : "relative -left-2"
          )}
        >
          <Icon
            iconName="menu-02"
            iconSize="24"
            iconColor={`${colorList.navMenu}`}
            className="dark:stroke-primary-200"
          />
        </button>
      </div>

      <div className="nav-items-group flex flex-col justify-between">
        <div className="top mt-40">
          <div
            className={cn(
              "px-24 pb-20 pt-2",
              sidebarProps.sideBarStatus ? "" : "invisible"
            )}
          >
            {sidebarProps.hasDropDown && (
              <DropDownSingle
                items={sidebarProps.moduleList}
                index={sidebarProps.selectedModule}
                onChange={(e: any) => {
                  console.log(e);
                  let itemIndex = 0;
                  sidebarProps.moduleList.forEach((element, index) => {
                    if (element.id === e.data["id"]) {
                      itemIndex = index;
                    }
                  });
                  handleDDChange(itemIndex);
                }}
                label={""}
                isDisabled={false}
                isRequired={false}
                isFilterable={false}
              />
            )}

            {/* <Dropdown
              dropdownItems={sidebarProps.moduleList}
              dropdownSelectedItem={sidebarProps.selectedModule}
              setDropDownSelectedItem={ (e: any) => {
                console.log(e);
                handleDDChange(e);
              }}
              /> */}
          </div>

          <ul className="ps-0">
            {sidebarProps.moduleList[sidebarProps.selectedModule].items.map(
              (item: ModuleItemProps, index: number) => {
                // console.log('Printing Pages available for the module');
                // console.log(item.isActive);
                return item.name !== "Settings" ? (
                  <li key={item.name}>
                    <div
                      key={index}
                      onClick={() =>
                        !item.subItems
                          ? handleMenuItemChange(index)
                          : sidebarProps.onMenuSubItemToggle
                          ? sidebarProps.onMenuSubItemToggle(
                              index,
                              item.isOpen !== undefined ? !item.isOpen : false
                            )
                          : null
                      }
                      id={`${item.id}`}
                      className={cn(
                        "h-52 items-center justify-between px-24 py-12 font-medium text-navText hover:cursor-pointer dark:text-primary-200",
                        sidebarProps.sideBarStatus ? "flex" : "block",
                        item.isActive
                          ? "bg-navActiveLink !text-navActiveLinkText hover:bg-navActiveLink dark:bg-primary-800 dark:hover:bg-primary-800"
                          : "hover:bg-navHover dark:hover:bg-primary-800"
                      )}
                    >
                      <>
                        <span className="flex place-items-center truncate">
                          <Icon
                            // iconColor={variables.primary500}
                            // iconColor={`${activeItem == index ? "white" : ""} ${variables.primary500}`}
                            iconColor={`${
                              item.isActive
                                ? colorList.navActiveLinkText
                                : colorList.navText
                            }`}
                            iconStrokeWidth={`${item.isActive ? "2" : "2"}`}
                            iconName={item.icon}
                            className="relative mr-12 h-[26px] dark:stroke-primary-200"
                          />
                          <span
                            className={cn(
                              "truncate",
                              !sidebarProps.sideBarStatus && "hidden",
                              item.isActive ? "font-medium" : null
                            )}
                          >
                            {item.name}
                          </span>
                        </span>
                        <div
                          className={cn(
                            !sidebarProps.sideBarStatus && "hidden"
                          )}
                        >
                          {item.notificationCount ? (
                            <BadgeNotification
                              count={item.notificationCount}
                              className="relative -top-8"
                            />
                          ) : null}
                          {item.subItems ? (
                            <ButtonIcon
                              clicked={() => {
                                if (sidebarProps.onMenuSubItemToggle) {
                                  sidebarProps.onMenuSubItemToggle(
                                    index,
                                    item.isOpen !== undefined
                                      ? !item.isOpen
                                      : false
                                  );
                                }
                              }}
                              iconName={`${
                                item.isOpen == false
                                  ? "chevron-right"
                                  : "chevron-down"
                              }`}
                              // iconSize="24"
                              iconColor={`${colorList.navMenu}`}
                              className="dark:stroke-primary-200"
                            />
                          ) : null}
                        </div>
                      </>
                    </div>
                    {item.subItems !== undefined ? (
                      <ul
                        className={cn(
                          "w-full !list-disc",
                          !sidebarProps.sideBarStatus && "hidden",
                          !item.isOpen && "hidden"
                        )}
                      >
                        {item.subItems.map(
                          (subItem: ModuleSubItemProps, subIndex: number) => {
                            return (
                              <li
                                className={cn(
                                  "flex h-52 items-center py-8 pl-56 pr-28 hover:cursor-pointer hover:bg-navHover",
                                  subItem.isActive
                                    ? "bg-navHover/50 text-navText hover:bg-navActiveLink dark:bg-primary-800 dark:hover:bg-primary-800"
                                    : "text-navText hover:bg-navHover dark:hover:bg-primary-800"
                                )}
                                key={subIndex}
                                onClick={() =>
                                  handleMenuItemChange(index, true, subIndex)
                                }
                              >
                                <span>{subItem.name}</span>
                                {subItem.notificationCount ? (
                                  <BadgeNotification
                                    className=""
                                    count={subItem.notificationCount}
                                  />
                                ) : null}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    ) : null}
                  </li>
                ) : null;
              }
            )}
          </ul>
        </div>

        <div className="bottom ">
          <hr
            className={cn(
              "mb-20 dark:border-slate-600",
              sidebarProps.dividerColor
                ? sidebarProps.dividerColor
                : "border-slate-200"
            )}
          />
          {sidebarProps.moduleList[sidebarProps.selectedModule].items.map(
            (item: ModuleItemProps, index: number) => {
              return item.name == "Settings" ? (
                <div
                  key={index}
                  onClick={() => handleMenuItemChange(index)}
                  className={cn(
                    "h-52 items-center px-24 py-12 font-medium text-navText hover:cursor-pointer dark:text-primary-200",
                    sidebarProps.sideBarStatus ? "flex" : "block",
                    item.isActive
                      ? "pointer-events-none bg-navActiveLink !text-navActiveLinkText hover:bg-navHover dark:bg-primary-800 dark:hover:bg-primary-800"
                      : "hover:bg-navHover dark:hover:bg-primary-800"
                  )}
                >
                  <>
                    <Icon
                      // iconColor={variables.primary500}
                      // iconColor={`${activeItem == index ? "white" : ""} ${variables.primary500}`}
                      iconColor={`${
                        item.isActive
                          ? colorList.navActiveLinkText
                          : colorList.navText
                      }`}
                      iconStrokeWidth={`${item.isActive ? "2" : "2"}`}
                      iconName={item.icon}
                      className="relative mr-12 h-[26px] dark:stroke-primary-200"
                    />
                    <span
                      className={`${!sidebarProps.sideBarStatus && "hidden"}`}
                    >
                      Settings
                    </span>
                  </>
                </div>
              ) : null;
            }
          )}
          <div
            onClick={() => {
              if (sidebarProps.onMenuItemChanged) {
                sidebarProps.onMenuItemChanged(-1);
              }
            }}
            className={cn(
              "h-52 items-center px-24 py-12 font-medium text-navText hover:cursor-pointer hover:bg-navHover dark:text-primary-200 dark:hover:bg-primary-800",
              sidebarProps.sideBarStatus ? "flex" : "block"
            )}
          >
            <>
              <Icon
                iconColor={colorList.navText}
                iconName="log-out-01"
                className={cn(
                  "relative mr-12 h-[26px] dark:stroke-primary-200",
                  sidebarProps.sideBarStatus ? "-top-1 flex" : "block"
                )}
              />
              <span
                className={`${!sidebarProps.sideBarStatus && "hidden"}`}
                onClick={() => {
                  if (sidebarProps.onMenuItemChanged) {
                    sidebarProps.onMenuItemChanged(-1);
                  }
                }}
              >
                Logout
              </span>
            </>
          </div>
          <small
            className={cn(
              "my-20 block px-24 text-slate-400",
              alignDevNameToCenter,
              sidebarProps.sideBarStatus ? "" : "invisible h-[16px]"
            )}
          >
            Made with <span className="text-heartColor">♥︎ </span> by {madeBy}
          </small>
        </div>
      </div>
    </nav>
  );
});
export default Sidebar;
