"use client";

import UserInfoProps from "@library/interfaces/UserInfoProps";
import Login from "@library/molecules/auth/Login";
import Spinner from "@library/Spinner";
import { removeAllCookies, setCookie } from "@library/utils";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { ModuleList } from "utils/models/ModuleList";
import { ModuleItemProps, ModuleListProps } from "../navigation/SidebarProps";

export interface LoginPageBaseProps {
  successRoute?: string;
  loginRoute?: string;
  apiURL?: string;
}

const LoginPageBase = memo(function LoginPageBase({
  successRoute = "/dashboard",
  loginRoute = "login",
  apiURL = "",
}: LoginPageBaseProps) {
  const router = useRouter();
  const [tokenVal, setTokenVal] = useState<string>("");
  const [userInfo, setUserInfo] = useState<string>("");
  const [isFetchingAPi, setIsFetchingAPi] = useState<any>(false);
  const [hasAPIError, setHasAPIError] = useState<string>("");

  /**
   * * Removing uncleared cookies, if any
   * * when token is set, redirect to dashboard
   */
  useEffect(() => {
    if (window !== undefined) {
      localStorage.clear();
      removeAllCookies();
    }
    if (tokenVal.length) {
      // Set the token cookie
      setCookie("token", tokenVal);
      setCookie("sidebar-open", "1");
    }
  }, [tokenVal]);

  useEffect(() => {
    if (userInfo.length) {
      let urlToNavigateTo = "";
      const userData: UserInfoProps = JSON.parse(userInfo);
      // Set the userInfo cookie
      setCookie("user-info", userInfo);
      const userModuleList: ModuleListProps[] = [];
      // - If Permissions are set then determine the user's Sidebar Module List
      // ! Please note this has been developed with the context of a singular module in the module list
      // ! Once we have more than one module, we have to strategize and update accordingly
      if (userData?.permissions) {
        ModuleList.forEach((module) => {
          const modItemIndex: ModuleListProps = { ...module, items: [] };
          modItemIndex.items = [];
          // * Checks if module has items and then loops through the items
          module.items?.forEach((item: ModuleItemProps) => {
            // * if the item has permission property then loop through the permission property
            item.permissions?.forEach((sidebarItemPermission: string) => {
              // console.log("Item Name ", item.name);
              // console.log("Item Permission ", sidebarItemPermission);
              // * Loop through the user permissions and compare with sidebar's individual item permissions...
              userData.permissions?.forEach((userPermission: string) => {
                // * console.log("User Permission ", userPermission);
                // * if the user permission matches with the sidebar item permission then push the item to the items array
                if (userPermission === sidebarItemPermission) {
                  // * if permission parameter is found then return the menu item
                  if (modItemIndex.items) {
                    modItemIndex.items.push(item);
                  } else {
                    modItemIndex.items = [item];
                  }
                  userModuleList.push(modItemIndex);
                }
              });
            });
          });
        });
      }
      if (userModuleList.length > 0) {
        if (userModuleList[0].items.length > 0) {
          urlToNavigateTo = userModuleList[0].items[0].link
            ? userModuleList[0].items[0].link
            : userModuleList[0].items[0].subItems?.length
            ? userModuleList[0].items[0].subItems[0].link
            : "";
          setCookie("module-list", JSON.stringify(userModuleList[0].items));
          router.push(urlToNavigateTo);
        }
        console.log("Updated List");
      } else {
        console.log("Original List");
        if (ModuleList.length > 0) {
          if (ModuleList[0].items?.length) {
            urlToNavigateTo = ModuleList[0].items[0].link
              ? ModuleList[0].items[0].link
              : ModuleList[0].items[0].subItems?.length
              ? ModuleList[0].items[0].subItems[0].link
              : "";
            setCookie("module-list", JSON.stringify(ModuleList[0].items));
            router.push(urlToNavigateTo);
          }
        }
      }
    }
  }, [userInfo]);

  const handleSubmit = async (e: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? apiURL;
    setIsFetchingAPi(true);
    let data;
    try {
      const response = await fetch(`${apiUrl}${loginRoute}`, {
        method: "POST",
        cache: "no-cache",
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          username: e.text,
          password: e.password,
        }),
      });

      if (response.status == 200) {
        data = await response.json();
        const userData: UserInfoProps = {
          companyId: data.results.companyId,
          companyName: data.results.companyName,
          name: data.results.name,
          permissions: data.results.permissions,
          roleId: data.results.roleId,
          roleName: data.results.roleName,
          userImg: data.results.userImg
            ? data.results.userImg
            : "/img/avatar2.jpg",
        };
        //get size of object
        setTokenVal(data.results.token);
        // stringify object
        console.log("userData>>>on sucess");
        console.log(userData);
        setUserInfo(JSON.stringify(userData));
      } else {
        setHasAPIError("There was an error logging in. Please try again.");
        setIsFetchingAPi(false);
      }
    } catch (error) {
      setIsFetchingAPi(false);
      if (data?.message) {
        setHasAPIError("Invalid Credentials");
      }
    }
  };

  return (
    <>
      {isFetchingAPi && (
        <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform bg-white bg-opacity-70 p-12">
          <Spinner className="" />
        </div>
      )}
      <Login
        submitClicked={handleSubmit}
        onTextInputChange={(e) => setHasAPIError("")}
        errorLoginText={hasAPIError}
        defaultValidation={false}
        showForgotPass={false}
        isFetchingAPI={isFetchingAPi}
      ></Login>
    </>
  );
});

export default LoginPageBase;
