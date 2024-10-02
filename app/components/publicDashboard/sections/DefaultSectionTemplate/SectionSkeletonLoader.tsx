import SkeletonRankList from "@components/globals/RankList/SkeletonRankList";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import { cn } from "tailwind-cn";


export interface SectionSkeletonLoaderProps {
  hideFilterDD: boolean;
  renderContext: number;
  // renderContext = 1 - 2 columns 30% left, 70% right
  // renderContext = 2 - 4 columns
}

export default memo(function SectionSkeletonLoader({
                                                     hideFilterDD = true,
                                                     renderContext = 2,
                                                   }: SectionSkeletonLoaderProps) {
  return (
    <div className="h-fit transition-all ">
      <h3 className="mb-12 text-base font-semibold uppercase text-slate-600 w-[50%]">
        <Skeleton height={24} />
      </h3>
      <div className="altd-label inline-block select-none dark:bg-slate-800 dark:text-slate-500 text-sm text-primary md:hidden">
        <Skeleton />
      </div>

      <div className="relative min-h-[400px] w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20">
      {/* <div className="relative min-h-[890px] w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20"> */}
        {/* //! Filters */}
        <div className="mx-auto mt-16 grid max-w-7xl gap-20 sm:grid-cols-2 lg:h-36 lg:grid-cols-3 lg:gap-40 lg:pb-20">
          <div className="flex justify-end lg:col-span-2 col-span-2">
            <div className="isolate z-10 grid w-full grid-cols-1 items-start space-y-16 lg:grid-cols-5 lg:gap-x-12 lg:space-y-0">
              <div className="lg:mb-0 text-sm col-span-2">
                <div
                  className={cn("flex flex-col", "lg:mb-0 text-sm col-span-2")}
                >
                  <Skeleton containerClassName="flex-1" height={24} />
                </div>
              </div>
              <div className="lg:mb-0 text-sm col-span-2">
                <div
                  className={cn("flex flex-col", "lg:mb-0 text-sm col-span-2")}
                >
                  <Skeleton containerClassName="flex-1" height={24} />
                </div>
              </div>
              <div className="col-span-1 flex justify-start h-36 w-full lg:w-auto">
                <div className="altd-dropdown-single relative w-full transition">
                  <div className="altd-dropdown-single relative w-full transition">
                    <Skeleton height={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!hideFilterDD && (
            <div className="flex flex-grow justify-start h-36">
              <Skeleton containerClassName="flex-1" height={24} />
            </div>
          )}
          {/*Primary Analytics Display Section */}
        </div>
        <hr />
        {/*<div className="relative z-10 flex h-fit w-full items-start justify-start rounded-lg bg-white">*/}
        {/*  <div className="grid w-full grid-cols-2 gap-20 p-24 lg:grid-cols-4">*/}

        {renderContext==1 && (
          <div>
            <div className="relative z-10 flex h-fit w-full items-start justify-start rounded-lg bg-white">
              <div className="grid w-full gap-20 p-24 grid-cols-1 md:grid-cols-2">
                <div className="grid-item">
                  <div className="flex flex-col space-y-12">
                    <Skeleton height={24} width={100} />
                    <Skeleton height={600} />
                  </div>
                </div>
                <div className="grid-item relative lg:col-span-2">
                  <div className="flex flex-col space-y-12">
                    <Skeleton height={24} />
                    <Skeleton height={600} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {renderContext==2 && (
          <div className="relative z-10 flex h-fit w-full items-start justify-start rounded-lg bg-white">
            <div className="grid w-full gap-20 p-0 sm:p-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {[...Array(4)].map((item, index) => (
                <SkeletonRankList key={index.toString()} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});