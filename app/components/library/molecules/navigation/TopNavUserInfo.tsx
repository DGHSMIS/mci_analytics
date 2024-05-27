import Avatar from "@components/library/Avatar";
import { memo } from "react";

export interface TopNavUserInfoProps {
  name?: string;
  role?: string;
  imgSrc?: string;
  imgAlt?: string;
}
const TopNavUserInfo = memo(function TopNavUserInfo({
  name = "Bangla Messi",
  role = "Manager",
  imgSrc = "",
  imgAlt = "",
}: TopNavUserInfoProps) {
  return (
    <div className="ml-20 flex items-center hover:cursor-pointer">
      <Avatar src={imgSrc} alt={imgAlt} size="xs" personName={name} />
      <div className="user-info ml-8 mt-14">
        <h6 className="text-sm leading-none text-slate-700 md:pb-4 md:text-base md:leading-0">
          {name}
        </h6>
        <small className="leading-0 text-slate-500">{role}</small>
      </div>
    </div>
  );
});
export default TopNavUserInfo;
