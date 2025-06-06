import dynamic from "next/dynamic";
import React, { memo } from "react";
import Skeleton from "react-loading-skeleton";
import { cn } from "tailwind-cn";

const DemographySwitcherDD = dynamic(() => import("@components/publicDashboard/sectionFilterSegment/DemographySwitcherDD"), {
  ssr: true,
  loading: () => <Skeleton containerClassName="flex-1" height={24} width={"w-full"} />,
});
const SearchDateRangeFilter = dynamic(() => import("@components/publicDashboard/sectionFilterSegment/SearchDateRangeFilter"), {
  ssr: false,
  loading: () => <Skeleton containerClassName="flex-1" height={24} width={"w-full"} />,
});
const Label = dynamic(() => import("@library/form/Label"), {
  ssr: true,
});
export default memo(function DefaultSectionTemplate({
                                                      children,
                                                      sectionHeader,
                                                      renderContext,
                                                      showDropdownSwitcher = true,
                                                    }: {
  children: React.ReactNode;
  sectionHeader: string;
  renderContext: number; // 1 - Demography, 2 - Service Overview
  showDropdownSwitcher?: boolean;
}) {
  return (
    <div className="h-fit">
      <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
        {sectionHeader}
      </h3>
      <Label
        className={`text-sm text-primary md:hidden`}
        text="Select Metrics"
      />
      <div className="relative min-h-[400px] w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20 hover:border-primary-400  hover:shadow-xl">
      {/* <div className="relative min-h-[890px] w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20 hover:border-primary-400  hover:shadow-xl"> */}
        {/* //! Filters */}
        <div className="mx-auto mt-16 grid sm:grid-cols-1 lg:grid-cols-3 max-w-7xl gap-20 lg:h-36 lg:gap-40 lg:pb-20">
          <div
            className={cn(
              "flex justify-end items-end lg:col-span-2",
              showDropdownSwitcher ? "col-span-3 md:col-span-2 max-w-full":"col-span-3",
            )}
          >
            <SearchDateRangeFilter renderContext={renderContext} />
          </div>
          {showDropdownSwitcher && (
            <div className="flex justify-start col-span-3 md:col-span-2 lg:col-span-1 lg:pt-24 w-full">
              <DemographySwitcherDD />
            </div>
          )}
        </div>
        <hr />
        {/*Primary Analytics Display Section */}
        {children}
      </div>
    </div>
  );
});
