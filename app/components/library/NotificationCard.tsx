import Icon, { IconProps } from "@components/library/Icon";
import variables from "@variables/variables.module.scss";
import Link from "next/link";
import { memo } from "react";
import { cn } from "tailwind-cn";

export interface NotificationCardProps {
  dateTime?: string;
  read?: boolean;
  iconName?: IconProps["iconName"];
  text?: string;
  link?: string;
  className?: string;
}

const defaultIconColor = variables.gray400;

/**
 * NotificationCard Component
 *
 * @description
 * Company - ARITS Ltd.
 * This component is used to render a push-style NotificationCard component
 *
  @param {string} dateTime Renders the timestamp within the component
	@param {boolean} read True/false for whether the notification is read
	@param {string} iconName Name of the icon in context of the notification
	@param {string} text Renders the notification message
	@param {string} link Links to the notification destination
	@param {string} className Additional classes can be added here
*/

const NotificationCard = memo(function NotificationCard({
  dateTime = "13th Sept '23",
  read = false,
  iconName = "bell-03",
  text = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. tempore dolorem et fugiat doloremque",
  link = "./",
  className = "",
}: NotificationCardProps) {
  return (
    <>
      <Link href={link}>
        <div
          className={cn(
            "altd-notification-card mb-4 flex items-start justify-between rounded-md border-b px-12 py-12 @container hover:bg-slate-200",
            read
              ? "bg-white text-slate-600"
              : "bg-slate-100 font-medium text-slate-800",
            className
          )}
        >
          <div className="left flex space-x-8 ">
            <Icon
              iconName={iconName}
              iconColor={defaultIconColor}
              className="mt-4 shrink-0"
              iconSize="16px"
            />
            <p className="line-clamp-1 pr-16">{text}</p>
          </div>
          <small className="mt-4 shrink-0 text-slate-400">{dateTime}</small>
        </div>
      </Link>
    </>
  );
});
export default NotificationCard;
