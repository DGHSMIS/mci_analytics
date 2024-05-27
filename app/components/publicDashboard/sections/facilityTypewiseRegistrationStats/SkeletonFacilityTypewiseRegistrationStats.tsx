import React, { memo } from "react";
import Skeleton from "react-loading-skeleton";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";

export default memo(function SkeletonFacilityTypewiseRegistrationStats() {

  return (
    <div>
      <h3 className="flex max-w-[90%] md:max-w-[30%] mb-12 text-base font-semibold uppercase text-slate-600">
        <Skeleton containerClassName={'flex-1 w-fit'} height={24}/>
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-16 lg:space-x-0 lg:space-y-0">
        <SkeletonCardIndicator className={'col-span-2 lg:col-span-1'}/>
        <SkeletonCardIndicator className={'col-span-1 lg:col-span-1'}/>
        <SkeletonCardIndicator className={'col-span-1 lg:col-span-1'}/>
        <SkeletonCardIndicator className={'col-span-1 lg:col-span-1'}/>
        <SkeletonCardIndicator className={'col-span-1 lg:col-span-1'}/>
      </div>
    </div>
  );
})