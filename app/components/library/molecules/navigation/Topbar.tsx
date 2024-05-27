"use client";

// import variables from "@variables/variables.module.scss"
import ButtonIcon from "@components/library/ButtonIcon";
import FormItemResponseProps from "@components/library/form/FormItemResponseProps";
import TypeaheadSearch from "@components/library/form/TypeaheadSearch";
import BadgeNotification from "@library/BadgeNotification";
import Flyout from "@library/Flyout";
import { memo, useState } from "react";
import { cn } from "tailwind-cn";
import twcolors from "tailwindcss/colors";
import TopNavUserInfo from "./TopNavUserInfo";

export interface TopbarProps {
  userName?: string;
  role?: string;
  enableSearch?: boolean;
  userImg?: string;
  imgAlt?: string;
  showMobileHamburger: (e: boolean) => void;
  children?: React.ReactNode;
  customClass?: string;
  hasNotifyIcon?: boolean;
  onNotificationIconClick?: () => void;
  isNotificationExpanded?: boolean;
  notifyItems?: Array<any>;
  showNotificationCount?: boolean;
  notificationCount?: number;
  badgeNotificationKey?: number;
}
const Topbar = memo(function Topbar(props: TopbarProps) {
  const [sideBarStatus, setSideBarStatus] = useState(false);
  const updateMenuBarStatus = () => {
    props.showMobileHamburger(!sideBarStatus);
    setSideBarStatus(!sideBarStatus);
  };

  const handleOnNotificationIconClick = () => {
    console.log("Right Icon CLicked!!");
    if (props.onNotificationIconClick) {
      props.onNotificationIconClick();
    }
  };

  const customClass =
    props?.customClass ??
    "grid h-64 grid-cols-12 place-content-center items-center border-b border-slate-200 bg-topNavBg p-16 dark:border-slate-600 dark:bg-slate-700";
  return (
    <header>
      <nav className={cn("atld-topbar topWrapper", customClass)}>
        {props?.children ?? (
          <>
            <div className="flex items-center justify-between md:col-span-1 md:hidden">
              <ButtonIcon
                iconName="menu-01"
                iconSize="24"
                iconColor={twcolors.slate[500]}
                clicked={updateMenuBarStatus}
              />
            </div>
            <div className="col-span-6 lg:col-span-9">
              {props.enableSearch && (
                <TypeaheadSearch
                  apiURL=""
                  onClick={(e: FormItemResponseProps) => console.log(e)}
                />
              )}
            </div>
            <div className="col-span-5 flex items-center justify-end md:col-span-6 md:mr-16 lg:col-span-3">
              {props.hasNotifyIcon && (
                <div className="">
                  <NotificationIcon
                    onNotificationIconClick={handleOnNotificationIconClick}
                    isNotificationExpanded={props.isNotificationExpanded}
                  />
                  {props.showNotificationCount && (
                    <BadgeNotification
                      className="!w-15 !h-15 !absolute !ml-[-.5rem]"
                      key={
                        props.badgeNotificationKey
                          ? props.badgeNotificationKey
                          : null
                      }
                      count={
                        props.notificationCount ? props.notificationCount : 0
                      }
                    />
                  )}

                  <Flyout
                    controllingComponent={[""]}
                    itemsAlign={"right"}
                    className="!max-w-[18rem]"
                    // items={[<div>hello</div>]}
                    isOpen={props.isNotificationExpanded}
                    notificationItems={
                      props.notifyItems ? props.notifyItems : undefined
                    }
                  />
                </div>
              )}

              {/* <Icon iconColor={variables.gray500} iconName='bell-03' /> */}
              <TopNavUserInfo
                name={props.userName ? props.userName : "Anonymous"}
                role={props.role ? props.role : "Account Holder"}
                imgSrc={props.userImg}
                imgAlt={props.imgAlt}
              />
            </div>
          </>
        )}
      </nav>
    </header>
  );
});

export default Topbar;

export interface NotificationProps {
  onNotificationIconClick?: () => void;
  isNotificationExpanded?: boolean;
}

export function NotificationIcon(props: NotificationProps) {
  const handleOnNotificationIconClick = () => {
    console.log("Right Icon CLicked!!");
    if (props.onNotificationIconClick) {
      props.onNotificationIconClick();
    }
  };
  return (
    <>
      <ButtonIcon
        iconName="bell-03"
        iconColor={"twcolors.color.slate[500]"}
        clicked={handleOnNotificationIconClick}
      />
    </>
  );
}
