"use client";

import { RankListProps } from "@components/globals/RankList/RankListProps";
import SkeletonRankList from "@components/globals/RankList/SkeletonRankList";
import SectionSkeletonLoader from "@components/publicDashboard/sections/DefaultSectionTemplate/SectionSkeletonLoader";
import { useStore } from "@store/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFacilityServiceOverview } from "@utils/providers/pbdClientServiceProvider";
import dynamic from "next/dynamic";
import { memo } from "react";

const FacilityServiceSkeltonGroup = memo(function FacilityServiceSkeltonGroup(){
  return <>
  <SkeletonRankList rows={10} />
  <SkeletonRankList rows={10} />
  <SkeletonRankList rows={10} />
  <SkeletonRankList rows={10} />
  </>
})

const DefaultSectionTemplate = dynamic(
  () => import("@components/publicDashboard/sections/DefaultSectionTemplate/DefaultSectionTemplate"),
  {
    ssr: true,
    loading: () => (
      <SectionSkeletonLoader renderContext={2} hideFilterDD={true} />
    ),
  },
);

const RankList = dynamic(() => import("@components/globals/RankList/RankList"), {
  ssr: true,
  loading: () => (<SkeletonRankList rows={10} />),
});

export interface FacilityServiceOverviewProps {
  sectionHeader: string;
  apiEndPoints: String[];
}

export default memo(function FacilityServiceOverview({
                                                       sectionHeader,
                                                       apiEndPoints = [],
                                                     }: FacilityServiceOverviewProps) {
  const {
    serviceOverviewMinDate,
    serviceOverviewMaxDate,
  } = useStore();
  const queryClient = useQueryClient();
  const defaultQueryOptions = queryClient.getDefaultOptions();
  queryClient.setDefaultOptions({
    queries: {
      ...defaultQueryOptions.queries,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const { data, isError, isPending, error } = useQuery(
    {
      queryKey: ["facilityServiceOverview", serviceOverviewMinDate, serviceOverviewMaxDate],
      queryFn: async () => await fetchFacilityServiceOverview(serviceOverviewMinDate, serviceOverviewMaxDate),

    }, queryClient,
  );

  return <DefaultSectionTemplate
        renderContext={2}
        sectionHeader={sectionHeader}
        showDropdownSwitcher={false}
      >
        <div className="relative flex h-fit w-full items-start justify-start rounded-lg bg-white">
          {/* <div className="grid w-full grid-cols-2 gap-20 p-24 lg:grid-cols-4"> */}
          <div className="grid w-full grid-cols-1 gap-20 p-0 md:p-24 sm:grid-cols-2 lg:grid-cols-4">
            {isPending ?
              <FacilityServiceSkeltonGroup />:
              data ? data.map((item: RankListProps, index) => {
                console.log("The item value is: ");
                console.log(item);
                return <RankList key={index} {...item} />;
              }):null
            }
          </div>
        </div>
      </DefaultSectionTemplate>
});
