"use client";

import { setTimeout } from "timers";
import ModalAlert from "@library/ModalAlert";
import MobileSidebar from "@library/molecules/navigation/MobileSidebar";
import Sidebar from "@library/molecules/navigation/Sidebar";
import {
  ModuleItemProps,
  ModuleListProps,
  ModuleSubItemProps,
  SidebarProps,
} from "@library/molecules/navigation/SidebarProps";
import Topbar from "@library/molecules/navigation/Topbar";
import { getCookie, removeAllCookies, setCookie } from "@library/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, memo, useCallback, useEffect, useState } from "react";

export const AppContext = createContext({});

const LayoutPartial = memo(function LayoutPartial({
  props,
  children,
}: {
  props: SidebarProps;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  //App Context Variables
  const [token, setToken] = useState<string>("");
  const [sitePath, setSitePath] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>({});
  const [sideBarProps, setSidebarProps] = useState<SidebarProps>(props);
  const [onInitialized, setOnInitialized] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  //Set Token on navigating to logged in pages
  useEffect(() => {
    const tokenCookie = getCookie("token");
    setToken(tokenCookie ? tokenCookie : "");
    const userInfoCookie = getCookie("user-info");
    //convert the cookie string to JSON
    const userData = JSON.parse(userInfoCookie as string);
    setUserInfo(userData);
    // console.log(userData.name);
  }, []);

  useEffect(() => {
    if (onInitialized) {
      setTimeout(() => {
        recalculateSidebarProps(sideBarProps, true, location.pathname);
      }, 100);
    }
  }, [searchParams]);

  //Set Site Origin Path
  useEffect(() => {
    setSitePath(process.env.NEXT_PUBLIC_site_url || "");
  }, [process.env.NEXT_PUBLIC_site_url]);

  useEffect(() => {
    setCookie("sitePath", sitePath);
  }, [sitePath]);

  //Setup Sidebar Open/Close Props from cookies
  useEffect(() => {
    if (onInitialized) {
      //now update the cookie - sidebar status
      setCookie("sidebar-open", sideBarProps.sideBarStatus == true ? "1" : "0");
    } else {
      const checkIfSidebarCookieIsSet = getCookie("sidebar-open");
      if (checkIfSidebarCookieIsSet == undefined) {
        //if the cookie is not set, then set it to 1
        setCookie("sidebar-open", "1");
      } else {
        setOnInitialized(true);
      }
    }
    // console.log(sideBarProps.sideBarStatus);
  }, [sideBarProps]);

  function recalculateSidebarProps(
    sideBarData: {
      moduleList: ModuleListProps[];
    },
    forceTrigger: boolean = false,
    compareURL: string = ""
  ) {
    //console.log("Use Effects <<Sidebar>>");
    const updateStateVar = (Math.random() * 1000) / 322;
    //console.log(updateStateVar);
    const urlPath = forceTrigger ? compareURL : location.pathname;

    /**
     * * Check if the urlPath exists in the module list items
     */
    let moduleIndex: number = 0;
    let itemIndex: number = 0;
    let hasModule: boolean = false;
    let hasItem: boolean = false;
    let subItemIndex: number = -1;
    let subItemLink: string = "";
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
      getCookie("sidebar-open") !== null
        ? parseInt(getCookie("sidebar-open") as string)
        : 1;

    sideBarData.moduleList.forEach((module: ModuleListProps, i1: number) => {
      module.items.forEach((item: ModuleItemProps, i2: number) => {
        if (((!hasModule && !hasItem) || forceTrigger) && item.link) {
          const itemLink = "/" + removeLeadingSlash(item.link);
          //console.log(itemLink);
          //console.log(urlPath);
          //console.log(urlPath.includes(itemLink));
          // console.log("/dashboard/");
          const path1Segments = itemLink.split("/").slice(1, 3);
          const path2Segments = urlPath.split("/").slice(1, 3);

          if (
            itemLink == urlPath ||
            (path1Segments[0] === path2Segments[0] &&
              path1Segments[1] === path2Segments[1])
          ) {
            // console.log("Found the URL Path in the module list items >>>>>>>>>>>");
            // console.log(i2);

            hasModule = true;
            hasItem = true;
            moduleIndex = i1;
            itemIndex = i2;
          }
        } else {
          console.log(
            "Not Found the URL Path in the module list items >>>>>>>>>>>"
          );
          console.log(i2);
          module.items[i2].subItems?.forEach(
            (subItem: ModuleSubItemProps, i3: number) => {
              const itemLink = "/" + removeLeadingSlash(subItem.link);
              let path1Segments = itemLink.split("/").slice(2, 4);
              const path2Segments = location.pathname.split("/").slice(2, 4);
              path1Segments = path1Segments.filter((str) => str !== "");
              console.log(path1Segments);
              console.log(path2Segments);

              if (
                itemLink == urlPath ||
                (path1Segments[0] === path2Segments[0] &&
                  path1Segments[1] === path2Segments[1])
              ) {
                // console.log("Found the URL Path in the module list items >>>>>>>>>>>");
                // console.log(i2);
                subItemIndex = i3;
                subItemLink = subItem.link;
                hasModule = true;
                hasItem = true;
                moduleIndex = i1;
                itemIndex = i2;
              }
            }
          );
        }
      });
    });

    console.log("Does the URL Path exist in the module list items?");
    console.log(moduleIndex);
    console.log(itemIndex);
    console.log(hasModule);
    console.log(hasItem);

    //If the urlPath exists, then switch to that module and show that item as active
    if ((hasModule && hasItem) || forceTrigger) {
      // console.log("The URL Path exists in the module list items");
      // console.log("Switching to the module and showing the item as active");
      setSidebarProps((prevState) => {
        let updatedModuleList: ModuleListProps[] = prevState.moduleList;

        updatedModuleList[moduleIndex].items.forEach(
          (item: ModuleItemProps, index: number) => {
            // console.log("Index Loop");
            // console.log(index);
            // console.log(itemIndex);
            // console.log(index == itemIndex);
            if (index == itemIndex) {
              updatedModuleList[moduleIndex].items[index].isActive = true;
            } else {
              updatedModuleList[moduleIndex].items[index].isActive = false;
            }

            if (subItemIndex !== -1) {
              updatedModuleList[moduleIndex].items[index].subItems?.forEach(
                (subItem: ModuleSubItemProps, subItemIndex: number) => {
                  console.log(subItem.link);
                  console.log(subItemLink);
                  console.log(subItem.link === subItemLink);

                  if (subItem.link === subItemLink) {
                    console.log(
                      updatedModuleList[moduleIndex].items[index].subItems![
                        subItemIndex
                      ].name
                    );
                    updatedModuleList[moduleIndex].items[index].isActive = true;
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    updatedModuleList[moduleIndex].items[index].subItems![
                      subItemIndex
                    ].isActive = true;
                    updatedModuleList[moduleIndex].items[index].isOpen = true;
                  } else {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    updatedModuleList[moduleIndex].items[index].subItems![
                      subItemIndex
                    ].isActive = false;
                  }
                }
              );
            }
          }
        );

        return {
          ...prevState,
          sideBarStatus: sidebarState === 1 ? true : false,
          selectedModule: moduleIndex,
          stateChange: updateStateVar,
          moduleList: updatedModuleList,
        };
      });
      //now update the local storage - selected module
      localStorage.setItem("selected-module", moduleIndex.toString());
    }
  }
  //Setup Sidebar Selected Module Props from cookies
  useEffect(() => {
    recalculateSidebarProps(props);
  }, [props]);

  //Handle Hiding Mobile Sidebar
  const handleHideMobileSidebar = useCallback((e: boolean | undefined) => {
    // console.log("Show Mobile Sidebar Request Received");
    // console.log("Show Sidebar" + e);
    setSidebarProps((prevState) => {
      return { ...prevState, showMobileSidebar: false };
    });
  }, []);

  //Handle Showing Mobile Sidebar
  const handleShowMobileSidebar = useCallback((e: boolean | undefined) => {
    // console.log("Show Mobile Sidebar Request Received");
    // console.log("Show Sidebar" + e);
    setSidebarProps((prevState) => {
      return { ...prevState, showMobileSidebar: true };
    });
  }, []);

  //Sidebar Module Switching Handler
  const handleModuleChange = useCallback(
    (e: number) => {
      // console.log("Module Changed Request Received");
      // console.log("Which Module to show?" + e);
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
          stateChange: (Math.random() * 1000) / 322,
          showMobileSidebar: false,
          moduleList: updatedModuleList,
        };
      });
      if (
        sideBarProps.moduleList[e].items[activeItemIndex].link !== undefined
      ) {
        const itemLink =
          sideBarProps.moduleList[e].items[activeItemIndex].link || "/";
        router.push(itemLink);
      }
      // console.log("Active Item Index" + activeItemIndex);
      localStorage.setItem("selected-module", e.toString());
    },
    [router, sideBarProps.moduleList]
  );

  //Sidebar Menu Item Click Handler for Navigation
  const handleMenuItemClick = useCallback(
    (e: number, isSubItem = false, subItemIndex?: number) => {
      console.log(e);
      if (e == -1) {
        // console.log("User is attempting to log out of the system");
        setShowModal(true);
        setSidebarProps((prevState) => {
          return {
            ...prevState,
            //Random number to force a re-render
            stateChange: (Math.random() * 1000) / 322,
            showMobileSidebar: false,
          };
        });
        return;
      }
      let updatedModuleList: ModuleListProps[] = [];
      let activeLink = "";
      let selectedSubItemIndex = -1;
      if (subItemIndex !== undefined) {
        activeLink =
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          sideBarProps.moduleList[sideBarProps.selectedModule].items[e]
            ?.subItems![subItemIndex].link;
        selectedSubItemIndex = subItemIndex;
      }

      setSidebarProps((prevState) => {
        updatedModuleList = prevState.moduleList;
        updatedModuleList[prevState.selectedModule].items.forEach(
          (item: ModuleItemProps, index: number) => {
            console.log(e);
            console.log(index);

            if (e === index) {
              updatedModuleList[prevState.selectedModule].items[
                index
              ].isActive = true;
              if (subItemIndex !== undefined) {
                updatedModuleList[prevState.selectedModule].items[
                  index
                ].isOpen = true;
              }
            } else {
              updatedModuleList[prevState.selectedModule].items[
                index
              ].isActive = false;
            }

            if (isSubItem && subItemIndex !== undefined) {
              updatedModuleList[prevState.selectedModule].items[
                index
              ].subItems?.forEach(
                (subItem: ModuleSubItemProps, subItemIndex: number) => {
                  if (subItem.link === activeLink) {
                    updatedModuleList[prevState.selectedModule].items[
                      e
                    ].isActive = true;
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    updatedModuleList[prevState.selectedModule].items[
                      index
                    ].subItems![subItemIndex].isActive = true;

                    updatedModuleList[prevState.selectedModule].items[
                      index
                    ].subItems![subItemIndex].notificationCount = 0;

                    updatedModuleList[prevState.selectedModule].items[
                      index
                    ].isOpen = true;
                  } else {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    updatedModuleList[prevState.selectedModule].items[
                      index
                    ].subItems![subItemIndex].isActive = false;
                  }
                }
              );
            } else {
              updatedModuleList[prevState.selectedModule].items[
                index
              ].subItems?.forEach(
                (subItem: ModuleSubItemProps, subItemIndex: number) => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  updatedModuleList[prevState.selectedModule].items[
                    index
                  ].subItems![subItemIndex].isActive = false;
                }
              );
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

      const itemLink =
        sideBarProps.moduleList[sideBarProps.selectedModule].items[e].link ||
        "";
      if (itemLink.length > 0) {
        router.push(itemLink);
      } else {
        console.log("Active Link" + activeLink);
        if (activeLink.length > 0) {
          router.push(activeLink);
        }
      }
    },
    [router, sideBarProps.moduleList, sideBarProps.selectedModule]
  );

  //Sidebar Toggle Handler
  const handleSideBarToggle = useCallback(() => {
    // console.log("User toggled Sidebar");
    let sidebarState: boolean;
    setSidebarProps((prevState) => {
      sidebarState =
        typeof prevState.sideBarStatus != "undefined"
          ? prevState.sideBarStatus
          : true;
      return {
        ...prevState,
        showMobileSidebar: false,
        stateChange: (Math.random() * 1000) / 322,
        sideBarStatus: !sidebarState,
      };
    });
    // console.log("User toggled Sidebar 2");
    // console.log(sideBarProps.sideBarStatus);
  }, []);

  return (
    <AppContext.Provider
      value={{
        token,
        sitePath,
        userInfo,
      }}
    >
      <MobileSidebar
        {...sideBarProps}
        hideMobileSidebar={handleHideMobileSidebar}
        isModuleChanged={handleModuleChange}
        onMenuItemChanged={(e, isSubItem?: boolean, subItemIndex?: number) =>
          handleMenuItemClick(e, isSubItem, subItemIndex)
        }
        onMenuSubItemToggle={(index, isOpen) => {
          setSidebarProps((prevState) => {
            let updatedModuleList: ModuleListProps[] = prevState.moduleList;

            updatedModuleList.forEach(
              (module: ModuleListProps, moduleIndex: number) => {
                module.items.forEach(
                  (item: ModuleItemProps, itemIndex: number) => {
                    if (itemIndex === index) {
                      updatedModuleList[moduleIndex].items[itemIndex].isOpen =
                        isOpen;
                    }
                  }
                );
              }
            );

            return {
              ...prevState,
              stateChange: (Math.random() * 1000) / 322,
              // showMobileSidebar: false,
              moduleList: updatedModuleList,
            };
          });
        }}
      />
      <Sidebar
        {...sideBarProps}
        onMenuSubItemToggle={(index, isOpen) => {
          setSidebarProps((prevState) => {
            let updatedModuleList: ModuleListProps[] = prevState.moduleList;

            updatedModuleList.forEach(
              (module: ModuleListProps, moduleIndex: number) => {
                module.items.forEach(
                  (item: ModuleItemProps, itemIndex: number) => {
                    if (itemIndex === index) {
                      updatedModuleList[moduleIndex].items[itemIndex].isOpen =
                        isOpen;
                    }
                  }
                );
              }
            );

            return {
              ...prevState,
              stateChange: (Math.random() * 1000) / 322,
              showMobileSidebar: false,
              moduleList: updatedModuleList,
            };
          });
        }}
        isModuleChanged={handleModuleChange}
        onMenuItemChanged={(e, isSubItem?: boolean, subItemIndex?: number) =>
          handleMenuItemClick(e, isSubItem, subItemIndex)
        }
        onSidebarToggle={handleSideBarToggle}
      />
      <div
        className={`fixed inset-0 ${
          sideBarProps.sideBarStatus
            ? "md:left-[232px] md:w-[calc(100vw-232px)]"
            : "md:left-[70px] md:w-[calc(100vw-70px)]"
        }`}
      >
        <Topbar
          userName={userInfo.name}
          role={userInfo.roleName}
          showMobileHamburger={handleShowMobileSidebar}
        />
        <div className="w-100 h-screen overflow-auto bg-slate-50 p-24 pb-96 dark:bg-slate-800">
          {showModal && (
            <ModalAlert
              title="Are you sure you want to log out?"
              successText="Yes"
              cancelText="No"
              onSuccessClick={() => {
                // console.log("success");
                setShowModal(false);
                removeAllCookies();
                //Log out from API and invalidate the token
                router.push("/");
                fetch(`${sitePath}logout`, {
                  cache: "no-cache",
                  method: "GET",
                  headers: { Authorization: `${token}` },
                });
              }}
              onCancelClick={() => {
                setShowModal(false);
              }}
            />
          )}
          {children}
        </div>
      </div>
    </AppContext.Provider>
  );
});

export default LayoutPartial;
