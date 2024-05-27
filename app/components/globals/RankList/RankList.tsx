import React, { memo } from "react";
import { cn } from "tailwind-cn";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";
import { RankListProps } from "@utils/interfaces/RankListProps";

const Icon = dynamic(() => import("@library/Icon"), {
  ssr: true,
  loading: () => <Skeleton width={24} height={24} />,
});


export default memo(function RankList({
                                   listTitle,
                                   titleColor,
                                   titleIcon,
                                   titleIconColor,
                                   listHeader,
                                   listData,
                                 }: RankListProps) {
  console.log("The listData value is: ");
  console.log(listData);
  return (
    <>
      <ul className="flex w-full flex-col rounded bg-white text-xs">
        <li className="flex items-center justify-start space-x-8 text-base font-semibold text-primary-600 py-4">
          <Icon iconName={titleIcon} iconColor={titleIconColor} iconSize="16" />
          <h6 className={cn("text-sm font-semibold truncate", titleColor)}>{listTitle}</h6>
        </li>
        <li key="header-item" className="flex justify-content-center space-x-8 flex-col text-xs font-bold bg-slate-200  text-slate-600">
          <div className="grid w-full cursor-pointer grid-cols-4 items-left bg-slate-200  text-slate-600 p-12">
            <div className="col-span-3">
              <div className="grid grid-cols-7 w-full grow gap-x-4">
                <div className="col-span-2 shrink-0">{listHeader.id}</div>
                <div className="w-fit col-span-5">{listHeader.name}</div>
              </div>
            </div>
            <div className="col-span-1 text-center text-slate-600">
              {listHeader.total}
            </div>
          </div>
        </li>
        {listData.length > 0 ?
          <>
            {listData.map((item, index) => (
              <li
                key={index.toString()}
                className="border-b-1 flex justify-content-center space-x-8 flex-col text-xs border-slate-600 h-52 overflow-y-hidden"
              >
                <div
                  className={cn(
                    "grid w-full grid-cols-4 items-left text-slate-500 py-8 px-12",
                    index % 2===0 ? "bg-slate-50":"bg-slate-150",
                  )}
                >
                  <div className="col-span-3">
                    <div className="grid grid-cols-7 w-full grow gap-x-4">
                      <div className="text-[0.6rem] break-all col-span-2 shrink-0 tracking-tighter font-mono hover:text-slate-600 hover:underline">
                        {item.id ?? ""}
                      </div>
                      <div className="w-fit col-span-5 cursor-pointer hover:text-slate-600 hover:underline leading-tight">
                        {item.name ?? ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-center font-mono font-medium text-slate-500">
                    {item.total.toLocaleString() ?? ""}
                  </div>
                </div>
              </li>
            ))}
          </>:<li
            key={"no-data"}
            className="border-b-1 flex flex-row border-slate-600 text-slate-500 bg-slate-100 p-12 justify-center items-left"
          >
            <p className="font-light text-md w-full flex items-start">
              No available data for this metric
            </p>
          </li>}

        {/* load more row */}
        {/*<li key={"footer"} className="flex justify-end my-12 group/viewmore">*/}
        {/*  <div className="group-hover/viewmore:cursor-pointer uppercase text-xs text-primary group-hover/viewmore:text-primary-400">*/}
        {/*    View More &rarr;*/}
        {/*  </div>*/}
        {/*</li>*/}
      </ul>
    </>
  );
})
