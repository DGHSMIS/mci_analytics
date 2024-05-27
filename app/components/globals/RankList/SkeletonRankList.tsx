import React, { memo } from "react";
import Skeleton from "react-loading-skeleton";
import { cn } from "tailwind-cn";

interface SkeletonRankListProps {
  rows?: number;
}
export default memo(function SkeletonRankList({
                                                      rows = 10,
                                                    }: SkeletonRankListProps) {
  return (
    <ul className="flex w-full flex-col rounded bg-white text-xs">
      <li className="flex flex-row items-left justify-start space-x-8 text-base font-semibold text-primary-600 py-8">
        <Skeleton containerClassName="flex-1 w-[75px] px-4" count={1} height={20} width={40}/>
        <h6 className="flex w-full text-sm font-semibold truncate justify-start items-start px-4"><Skeleton containerClassName="flex-1" count={1} height={20} width={'w-full'}/></h6>
      </li>
      <li key="header-item" className="flex justify-content-center space-x-8 flex-col text-xs font-bold bg-slate-200  text-slate-600">
        <div className="grid w-full cursor-pointer grid-cols-5 items-left bg-slate-200  text-slate-600 p-12">
          <div className="col-span-4">
            <div className="grid grid-cols-7 w-full grow gap-x-4">
              <div className="col-span-2 tracking-tighter font-mono hover:text-slate-600 hover:underline">
                <Skeleton count={1} height={16} width={30}/>
              </div>
              <div className="col-span-5 cursor-pointer hover:text-slate-600 px-0">
                <Skeleton count={1} height={16} width={'w-full'}/>
              </div>
            </div>
          </div>
          <div className="col-span-1 text-center items-center font-mono font-medium text-slate-500">
            <Skeleton count={1} height={20}  width={20}/>
          </div>
        </div>
      </li>
      {[...Array(rows)].map((item, index) => (
        <li
          key={index.toString()}
          className="border-b-1 flex justify-content-center space-x-8 flex-col text-xs border-slate-600 h-52"
        >
          <div
            className={cn(
              "grid w-full grid-cols-5 items-left text-slate-500 py-8 px-12",
              index % 2===0 ? "bg-slate-50":"bg-slate-150",
            )}
          >
            <div className="col-span-4">
              <div className="grid grid-cols-7 w-full grow gap-x-4">
                <div className="col-span-2 tracking-tighter font-mono hover:text-slate-600 hover:underline">
                  <Skeleton count={1} height={16} width={30}/>
                </div>
                <div className="col-span-5 cursor-pointer hover:text-slate-600 px-0">
                  <Skeleton count={2} height={16} width={'w-full'}/>
                </div>
              </div>
            </div>
            <div className="col-span-1 text-center items-center font-mono font-medium text-slate-500 flex justify-center ">
              <Skeleton containerClassName="flex-1" count={1} height={20}  width={20}/>
            </div>
          </div>
        </li>
      ))}
      {/* load more row */}
      <li key={"footer"} className="flex justify-end my-12 group/viewmore">
        <div className="group-hover/viewmore:cursor-pointer uppercase text-xs text-primary group-hover/viewmore:text-primary-400">
          {<Skeleton />}
        </div>
      </li>
    </ul>
  );
});
