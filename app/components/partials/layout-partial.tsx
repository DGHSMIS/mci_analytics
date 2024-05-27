"use client";

import MobileSidebar from "@components/library/molecules/navigation/MobileSidebar";
import Sidebar from "@components/library/molecules/navigation/Sidebar";
import Topbar from "@components/library/molecules/navigation/Topbar";
// import { ModuleItemProps } from "utils/models/ModuleList";
// import { SidebarProps } from "@components/library/molecules/navigation/SidebarProps";
// import { ModuleListProps } from "../../../utils/models/ModuleList";
import {
  ModuleItemProps,
  ModuleListProps,
  SidebarProps,
} from "@library/molecules/navigation/SidebarProps";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function LayoutPartial({
  props,
  children,
}: {
  props: SidebarProps;
  children: React.ReactNode;
}) {
  const [sideBarProps, setSidebarProps] = useState<SidebarProps>(props);
  const router = useRouter();

  useEffect(() => {
    console.log("Initializing the Layout Partial");
    const urlPath = location.pathname;
    console.log("The URL Path is " + urlPath);
    console.log("The props are ");
    console.log(props);
    /**
     * * Check if the urlPath exists in the module list items
     */
    let moduleIndex: number = 0;
    let itemIndex: number = 0;
    let hasModule: boolean = false;
    let hasItem: boolean = false;
    /**
     * * String remove a leading / from a string, if it exists
     */
    function removeLeadingSlash(str: string) {
      if (str[0] === "/") {
        return str.slice(1);
      }
      return str;
    }
    const sidebarState =
      localStorage.getItem("sidebar-open") !== null
        ? parseInt(localStorage.getItem("sidebar-open") as string)
        : 1;

    props.moduleList.forEach((module: ModuleListProps, i1: number) => {
      module.items.forEach((item: ModuleItemProps, i2: number) => {
        if (!hasModule && !hasItem) {
          const itemLink = removeLeadingSlash(item.link ? item.link : "");
          console.log("/" + itemLink);
          console.log(urlPath);
          if ("/" + itemLink === urlPath) {
            hasModule = true;
            hasItem = true;
            moduleIndex = i1;
            itemIndex = i2;
          }
        }
      });
    });
    console.log("Does the URL Path exist in the module list items?");
    console.log(moduleIndex);
    console.log(itemIndex);
    console.log(hasModule);
    console.log(hasItem);
    //If the urlPath exists, then switch to that module and show that item as active
    if (hasModule && hasItem) {
      console.log("The URL Path exists in the module list items");
      console.log("Switching to the module and showing the item as active");

      setSidebarProps((prevState) => {
        let updatedModuleList: ModuleListProps[] = prevState.moduleList;
        updatedModuleList[moduleIndex].items.forEach(
          (item: ModuleItemProps, index: number) => {
            if (index === itemIndex) {
              updatedModuleList[moduleIndex].items[index].isActive = true;
            } else {
              updatedModuleList[moduleIndex].items[index].isActive = false;
            }
          }
        );
        return {
          ...prevState,
          sideBarStatus: sidebarState === 1 ? true : false,
          selectedModule: moduleIndex,
          moduleList: updatedModuleList,
        };
      });
      //now update the local storage - selected module
      localStorage.setItem("selected-module", moduleIndex.toString());
    }
  }, [props]);

  const handleHideSidebar = useCallback(
    (e: boolean) => {
      console.log("Hanlde Hide Sidebar");
      console.log("Show Sidebar" + e);
      sideBarProps.sideBarStatus = e;
    },
    [sideBarProps]
  );

  const handleHideMobileSidebar = useCallback((e: boolean | undefined) => {
    console.log("Show Mobile Sidebar Request Received");
    console.log("Show Sidebar" + e);
    setSidebarProps((prevState) => {
      return { ...prevState, showMobileSidebar: false };
    });
  }, []);

  const handleShowMobileSidebar = useCallback((e: boolean | undefined) => {
    console.log("Show Mobile Sidebar Request Received");
    console.log("Show Sidebar" + e);
    setSidebarProps((prevState) => {
      return { ...prevState, showMobileSidebar: true };
    });
  }, []);

  const handleModuleChange = useCallback(
    (e: number) => {
      console.log("Module Changed Request Received");
      console.log("Which Module to show?" + e);
      let activeItemIndex: number = 0;
      //update the module list to show the selected module as active and the rest as inactive
      setSidebarProps((prevState) => {
        let updatedModuleList: ModuleListProps[] = prevState.moduleList;
        let hasActiveItem: boolean = false;
        updatedModuleList[e].items.forEach(
          (item: ModuleItemProps, index: number) => {
            if (item.isActive && !hasActiveItem) {
              hasActiveItem = true;
              activeItemIndex = index;
            } else {
              updatedModuleList[e].items[index].isActive = false;
            }
          }
        );
        if (!hasActiveItem) {
          updatedModuleList[e].items[0].isActive = true;
          activeItemIndex = 0;
        }
        return {
          ...prevState,
          selectedModule: e,
          showMobileSidebar: false,
          moduleList: updatedModuleList,
        };
      });

      console.log("Active Item Index" + activeItemIndex);
      router.push(sideBarProps.moduleList[e].items[activeItemIndex].link ?? "");
      localStorage.setItem("selected-module", e.toString());
    },
    [router, sideBarProps.moduleList]
  );

  const handleMenuItemClick = useCallback(
    (e: number) => {
      console.log("User is trying to navigate to a new page");
      console.log("Which Page to show?" + e);
      console.log(
        sideBarProps.moduleList[sideBarProps.selectedModule].items[e].isActive
      );
      setSidebarProps((prevState) => {
        let updatedModuleList: ModuleListProps[] = prevState.moduleList;
        updatedModuleList[prevState.selectedModule].items.forEach(
          (item: ModuleItemProps, index: number) => {
            if (e === index) {
              updatedModuleList[prevState.selectedModule].items[
                index
              ].isActive = true;
            } else {
              updatedModuleList[prevState.selectedModule].items[
                index
              ].isActive = false;
            }
          }
        );
        return {
          ...prevState,
          //Random number to force a re-render
          stateChange: (Math.random() * 1000) / 322,
          showMobileSidebar: false,
          moduleList: updatedModuleList,
        };
      });
      router.push(
        sideBarProps.moduleList[sideBarProps.selectedModule].items[e].link ?? ""
      );
    },
    [router, sideBarProps.moduleList, sideBarProps.selectedModule]
  );
  const handleSideBarToggle = useCallback(() => {
    console.log("User toggled Sidebar");
    setSidebarProps((prevState) => {
      let sidebarState: boolean =
        typeof prevState.sideBarStatus != "undefined"
          ? prevState.sideBarStatus
          : true;
      return {
        ...prevState,
        showMobileSidebar: false,
        sideBarStatus: !sidebarState,
      };
    });

    //now update the local storage - sidebar status
    localStorage.setItem(
      "sidebar-open",
      sideBarProps.sideBarStatus ? "0" : "1"
    );
  }, []);

  return (
    <>
      <MobileSidebar
        {...sideBarProps}
        hideMobileSidebar={handleHideMobileSidebar}
        isModuleChanged={handleModuleChange}
        onMenuItemChanged={handleMenuItemClick}
      />
      <Sidebar
        {...sideBarProps}
        isModuleChanged={handleModuleChange}
        onMenuItemChanged={handleMenuItemClick}
        onSidebarToggle={handleSideBarToggle}
      />
      <div
        className={`fixed inset-0 ${
          sideBarProps.sideBarStatus
            ? "md:left-[232px] md:w-[calc(100vw-232px)]"
            : "md:left-[70px] md:w-[calc(100vw-70px)]"
        }`}
      >
        <Topbar showMobileHamburger={handleShowMobileSidebar} />
        <div className="w-100 h-screen overflow-auto bg-slate-50 p-24 pb-96 dark:bg-slate-800">
          {children}
        </div>
      </div>
    </>
  );
}
