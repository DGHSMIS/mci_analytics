"use client";

import BadgeNotification from "@library/BadgeNotification";
import ButtonIcon from "@library/ButtonIcon";
import DropDownSingle from "@library/form/DropDownSingle";
import Icon from "@library/Icon";
import SvgImage from "@library/SvgImage";
import Link from "next/link";
import { memo, useCallback } from "react";
import styled from "styled-components";
import { cn } from "tailwind-cn";
import twcolors from "tailwindcss/colors";
import config from "../../../../../tailwind.config";
import {
  ModuleItemProps,
  ModuleSubItemProps,
  SidebarProps,
} from "./SidebarProps";

const BackdropShadow = styled.nav`
  box-shadow: 0 0 100vw 100vw rgba(0, 0, 0, 0.75);
`;

/**
 * @param moduleList List of Modules
 * @param selectedModule Selected Module
 * @param className Custom class Name for the component class
 * @param sideBarStatus Status of the Sidebar
 * @param stateChange State Change
 * @param onSidebarToggle On Sidebar Toggle
 * @param isModuleChanged   Is Module Changed
 * @param onMenuItemChanged On Menu Item Changed
 * @param showMobileSidebar Show Mobile Sidebar
 * @param hideMobileSidebar Hide Mobile Sidebar
 * @name MobileSidebar
 * @description
 * * Company - ARITS Ltd. 29th Jan 2023.
 * * This component is used to render a Sidebar.
 * * This component's rendering is controlled by layout-partial.tsx
 */

const MobileSidebar = memo(function MobileSidebar(
  mobileSidebarProps: SidebarProps
) {
  const colorList: any = config?.theme?.extend?.colors as any;

  //On Changing the Dropdown to switch modules
  const handleDDChange = useCallback(
    (e: number) => {
      console.log("User Updated the Selected Module - letting parent know");
      console.log(e);
      if (mobileSidebarProps.isModuleChanged) {
        mobileSidebarProps.isModuleChanged(e);
      }
    },
    [mobileSidebarProps]
  );
  //On Closing the Sidebar
  const handleCloseModal = useCallback(
    (e: any) => {
      console.log("The type is");
      console.log(e);
      if (mobileSidebarProps.hideMobileSidebar) {
        mobileSidebarProps.hideMobileSidebar(true);
      }
    },
    [mobileSidebarProps]
  );
  //On Changing the Menu Item
  const handleMenuItemChange = useCallback(
    (index: number, isSubMenu?: boolean, subItemIndex?: number) => {
      console.log("The type is");
      console.log(index);
      console.log(subItemIndex);
      if (mobileSidebarProps.onMenuItemChanged) {
        if (isSubMenu && subItemIndex !== undefined) {
          mobileSidebarProps.onMenuItemChanged(index, isSubMenu, subItemIndex);
        } else {
          mobileSidebarProps.onMenuItemChanged(index);
        }
      }
    },
    [mobileSidebarProps]
  );

  const logout = (e: any) => {
    localStorage.clear();
    // setTimeout(() => {
    // 	dispatch(setLogOut());
    // }, 1500);
  };

  return (
    <>
      {/* <div
        className={`inset-0 bg-slate-600 opacity-75 fixed z-40 md:hidden ${
          mobileSidebarProps.showMobileSidebar ? '' : 'hidden'
        }`}></div> */}
      <BackdropShadow
        style={{ overflow: "auto" }}
        className={cn(
          "sideWrapper relative z-50 block h-screen w-[75vw] border-r bg-navBg py-16 duration-300 ease-in-out md:hidden md:w-[300px]",
          mobileSidebarProps.showMobileSidebar
            ? "translate-x-0"
            : "-translate-x-full !shadow-none",
          mobileSidebarProps.dividerColor
            ? mobileSidebarProps.dividerColor
            : "border-slate-200"
        )}
      >
        <button onClick={handleCloseModal} className="inline">
          <div
            className={cn(
              "absolute right-12 top-12 bg-navBg p-4 hover:cursor-pointer hover:bg-navHover",
              !mobileSidebarProps.showMobileSidebar && "hidden"
            )}
          >
            <Icon
              iconColor={twcolors.slate[500]}
              iconName={`x`}
              className=""
              iconSize="28"
            />
          </div>
        </button>
        <div className={`px-24 pb-20`}>
          <Link href="/" className="inline-block">
            <SvgImage
              className={cn(
                "logo",
                !mobileSidebarProps.sideBarStatus && "hidden"
              )}
              svgPath="/img/logo.svg"
            />
          </Link>
        </div>
        <hr
          className={cn(
            "mb-20 dark:border-slate-600",
            mobileSidebarProps.dividerColor
              ? mobileSidebarProps.dividerColor
              : "border-slate-200"
          )}
        />
        {mobileSidebarProps.hasDropDown && (
          <div className="px-24 py-40">
            <DropDownSingle
              items={mobileSidebarProps.moduleList}
              index={mobileSidebarProps.selectedModule}
              onChange={(e: any) => {
                console.log(e);
                let itemIndex = 0;
                mobileSidebarProps.moduleList.forEach((element, index) => {
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
          </div>
        )}

        <div className="flex h-[81.5vh] flex-col justify-between">
          <div className="top">
            <ul className="ps-0">
              {mobileSidebarProps.moduleList[
                mobileSidebarProps.selectedModule
              ].items.map((item: ModuleItemProps, index: number) => {
                // console.log('Printing Pages available for the module');
                // console.log(item.isActive);
                return item.name !== "Settings" ? (
                  <li key={index}>
                    <div
                      onClick={() =>
                        !item.subItems
                          ? handleMenuItemChange(index)
                          : mobileSidebarProps.onMenuSubItemToggle
                          ? mobileSidebarProps.onMenuSubItemToggle(
                              index,
                              item.isOpen !== undefined ? !item.isOpen : false
                            )
                          : null
                      }
                      id={`${item.id}`}
                      key={item.link}
                      className={cn(
                        "h-52 items-center px-24 py-12 font-medium text-navText hover:cursor-pointer dark:text-primary-200",
                        mobileSidebarProps.sideBarStatus
                          ? "flex justify-between"
                          : "block",
                        item.isActive
                          ? " bg-navActiveLink !text-navActiveLinkText hover:bg-navActiveLink dark:bg-primary-800 dark:hover:bg-primary-800"
                          : "hover:bg-navHover dark:hover:bg-primary-800"
                      )}
                    >
                      <>
                        <span className="flex place-items-center truncate">
                          <Icon
                            // iconColor={twcolors.primary500}
                            // iconColor={`${activeItem == index ? "white" : ""} ${twcolors.primary500}`}
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
                              !mobileSidebarProps.sideBarStatus && "hidden",
                              item.isActive ? "font-medium" : null
                            )}
                          >
                            {item.name}
                          </span>
                        </span>
                        <div className="badge-section">
                          {item.notificationCount ? (
                            <BadgeNotification count={item.notificationCount} />
                          ) : null}
                          {item.subItems ? (
                            <ButtonIcon
                              clicked={() => {
                                if (mobileSidebarProps.onMenuSubItemToggle) {
                                  mobileSidebarProps.onMenuSubItemToggle(
                                    index,
                                    item.isOpen !== undefined
                                      ? !item.isOpen
                                      : false
                                  );
                                }
                              }}
                              iconName={`${
                                item.isOpen ? "chevron-down" : "chevron-right"
                              }`}
                              // iconSize="24"
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
              })}
            </ul>
          </div>
          <div className="bottom">
            <hr
              className={cn(
                "mb-20 dark:border-slate-600",
                mobileSidebarProps.dividerColor
                  ? mobileSidebarProps.dividerColor
                  : "border-slate-200"
              )}
            />
            {mobileSidebarProps.moduleList[
              mobileSidebarProps.selectedModule
            ].items.map((item: ModuleItemProps, index: number) => {
              return item.name == "Settings" ? (
                <li key={index} className="list-none">
                  <div
                    onClick={() => handleMenuItemChange(index)}
                    id={`${item.id}`}
                    key={item.link}
                    className={cn(
                      "h-52 items-center px-24 py-12 font-medium text-navText hover:cursor-pointer dark:text-primary-200",
                      mobileSidebarProps.sideBarStatus ? "flex" : "block",
                      item.isActive
                        ? "pointer-events-none bg-navActiveLink !text-navActiveLinkText hover:bg-navHover dark:bg-primary-800 dark:hover:bg-primary-800"
                        : "hover:bg-navHover dark:hover:bg-primary-800"
                    )}
                  >
                    <Icon
                      // iconColor={twcolors.primary500}
                      // iconColor={`${activeItem == index ? "white" : ""} ${twcolors.primary500}`}
                      iconColor={`${
                        item.isActive
                          ? colorList.navActiveLinkText
                          : colorList.navText
                      }`}
                      iconStrokeWidth={`${item.isActive ? "2" : "2"}`}
                      iconName={item.icon}
                      className="relative -left-3 mr-12 h-[26px] dark:stroke-primary-200"
                    />
                    <span>Settings</span>
                  </div>
                </li>
              ) : null;
            })}
            <div
              onClick={() => {
                if (mobileSidebarProps.onMenuItemChanged) {
                  mobileSidebarProps.onMenuItemChanged(-1);
                }
              }}
              className={cn(
                "h-52 items-center px-24 py-12 font-medium text-navText hover:cursor-pointer hover:bg-navHover dark:text-primary-200 dark:hover:bg-primary-800",
                mobileSidebarProps.sideBarStatus ? "flex" : "block"
              )}
            >
              <>
                <Icon
                  iconColor={colorList.navText}
                  iconName="log-out-01"
                  className={cn(
                    "relative mr-12 h-[26px] dark:stroke-primary-200",
                    mobileSidebarProps.sideBarStatus
                      ? "-top-1 flex"
                      : "top-10 block"
                  )}
                />
                <span
                  className={`${!mobileSidebarProps.sideBarStatus && "hidden"}`}
                >
                  Logout
                </span>
              </>
            </div>
            <small className="my-20 block h-[16px] px-24 text-slate-400">
              Made with <span className="text-heartColor">♥︎</span> by ARITS
              Ltd.
            </small>
          </div>
        </div>
      </BackdropShadow>
    </>
  );
});
export default MobileSidebar;
