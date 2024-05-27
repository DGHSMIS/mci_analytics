"use client";

import SectionSkeletonLoader from "@components/publicDashboard/sections/DefaultSectionTemplate/SectionSkeletonLoader";
import { useStore } from "@store/store";
import { fetchFacilityServiceOverview } from "@utils/providers/pbdClientServiceProvider";
import dynamic from "next/dynamic";
import React, { memo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SkeletonRankList from "@components/globals/RankList/SkeletonRankList";
import { RankListProps } from "@utils/interfaces/RankListProps";

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

  /**
   * Using useMutation to fetch data (Sample)
   */
  // queryClient.setMutationDefaults(["facilityServiceOverview", serviceOverviewMinDate, serviceOverviewMaxDate],
  //   {
  //     retry: 3,
  //     retryDelay: 1000,
  //   });
  // const mutations = useMutation({
  //     mutationFn: async () => await fetchFacilityServiceOverview(serviceOverviewMinDate, serviceOverviewMaxDate),
  //     onMutate: async () => {
  //       await queryClient.cancelQueries({ queryKey: ["facilityServiceOverview", serviceOverviewMinDate, serviceOverviewMaxDate] });
  //       return await queryClient.fetchQuery({
  //           queryKey: ["facilityServiceOverview", serviceOverviewMinDate, serviceOverviewMaxDate],
  //           queryFn: async () => await fetchFacilityServiceOverview(serviceOverviewMinDate, serviceOverviewMaxDate),
  //         },
  //       );
  //     },
  //     onSuccess: (data) => {
  //       queryClient.getQueryCache().clear();
  //       queryClient.setQueryData(["facilityServiceOverview", serviceOverviewMinDate, serviceOverviewMaxDate], data);
  //     },
  //     onError: async (error) => {
  //       queryClient.getQueryCache().clear();
  //       await queryClient.cancelQueries();
  //       queryClient.setQueryData(["facilityServiceOverview", serviceOverviewMinDate, serviceOverviewMaxDate], []);
  //     },
  //   }, queryClient,
  // );


  return (
    <>
      <DefaultSectionTemplate
        renderContext={2}
        sectionHeader={sectionHeader}
        showDropdownSwitcher={false}
      >
        <div className="relative flex h-fit w-full items-start justify-start rounded-lg bg-white">
          <div className="grid w-full grid-cols-2 gap-20 p-24 lg:grid-cols-4">
            {isPending ?
              (<>
                <SkeletonRankList rows={10} />
                <SkeletonRankList rows={10} />
                <SkeletonRankList rows={10} />
                <SkeletonRankList rows={10} />
              </>):

              data ? data.map((item: RankListProps, index) => {
                console.log("The item value is: ");
                console.log(item);
                return <RankList key={index} {...item} />;
              }):null
            }
          </div>
        </div>
      </DefaultSectionTemplate>
    </>
  )
    ;
});
