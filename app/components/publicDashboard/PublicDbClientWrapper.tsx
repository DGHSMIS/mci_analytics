"use client";
import dynamic from "next/dynamic";
import React, { memo } from "react";
import { QueryClient, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { fetchDivisionWiseData } from "@utils/providers/pbdClientServiceProvider";
import { useStore } from "@store/store";
import { RegistrationStatsProps } from "@api/es/analytics/patient/get-facility-type-registration-stats/route";
import SectionSkeletonLoader from "@components/publicDashboard/sections/DefaultSectionTemplate/SectionSkeletonLoader";
import SkeletonFacilityTypewiseRegistrationStats from "./sections/facilityTypewiseRegistrationStats/SkeletonFacilityTypewiseRegistrationStats";

const FacilityTypewiseRegistrationStats = dynamic(() => import("@components/publicDashboard/sections/facilityTypewiseRegistrationStats/FacilityTypewiseRegistrationStats"), {
  ssr: false,
  loading: () => (<SkeletonFacilityTypewiseRegistrationStats />)
});

const DemographyMain = dynamic(() => import("@components/publicDashboard/sections/demographySection/DemographyMain"), {
  ssr: false,
  loading: () => (<SectionSkeletonLoader renderContext={1} hideFilterDD={false} />)
});

const FacilityServiceOverview = dynamic(() => import("@components/publicDashboard/sections/facilityServiceOverview/FacilityServiceOverview"), {
  ssr: false,
  loading: () => (<SectionSkeletonLoader renderContext={2} hideFilterDD={true} />)
});


function useRegistrationStatsAPI(props: {
  queryClient: QueryClient;
}) {
  /* @ts-ignore */
  return useSuspenseQuery({
    queryKey: ["getPublicDashboardAnalytics", props.queryClient],
    queryFn: async () => await getAPIResponse(
      getBaseUrl(),
      getUrlFromName("get-facilitywise-count-stats"),
      "",
      "GET",
      null,
      false,
      getRevalidationTime(),
    ),
    //https://tkdodo.eu/blog/react-query-data-transformations
    //Tranform data
    select: (data) => {
      if (data) {
        console.log("The registration stats from Page RSC");
        console.table(data);
        const regStats: RegistrationStatsProps = { ...data };
        return regStats;
      } else {
        const empty: RegistrationStatsProps = {
          totalRegistration: 0,
          openMRSFacilityCount: 0,
          openSRPFacilityCount: 0,
          aaloClincFacilityCount: 0,
          eMISFacilityCount: 0,
        };
        return empty;
      }
    },
  }, props.queryClient);
}


function useDivisionWiseDataAPI(props: {
  queryClient: QueryClient;
  minDate: Date;
  maxDate: Date;
  regStatsData: RegistrationStatsProps;
}) {
  /* @ts-ignore */
  return useSuspenseQuery({
    queryKey: ["getDivisionWiseData", props.queryClient, props.minDate, props.maxDate],
    queryFn: async () => await fetchDivisionWiseData(
      props.minDate,
      props.maxDate,
    ),
    select: (data) => {
      // Step 3 - Combine the data for the page
      if (data) {
        return {
          ...props.regStatsData,
          dailyRegistration: {},
          divisionWiseData: { ...data },
        };
      } else {
        return {
          ...props.regStatsData,
          dailyRegistration: {},
          divisionWiseData: {},
        };
      }
    },
  }, props.queryClient);
}


interface PublicDashboardProps {
  section1Title: string;
  section2Title: string;
  section3Title: string;
}

export default memo(function PublicDbClientWrapper({
                                                     section1Title,
                                                     section2Title,
                                                     section3Title,
                                                   }: PublicDashboardProps) {

  const {
    demographyMinDate,
    demographyMaxDate,
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


  // Step 1 - Getting the data for the Dashboard page, directly on the server site
  const { data: regStatsData, isError: regStatIsError, isLoading: regStatIsLoading } = useRegistrationStatsAPI({ queryClient });
  // Step 2 - Get Division/District wise data
  const { data: dvWiseData, isError: dvWiseError, isPending: dvWisePending, isLoading: dvWiseLoading } = useDivisionWiseDataAPI({
    queryClient,
    minDate: demographyMinDate,
    maxDate: demographyMaxDate,
    regStatsData: regStatsData,
  });


  console.log("The registration stats from Page RSC");

  return (
    <>
      {/*Section 1 - Lifetime Stats*/}
      <FacilityTypewiseRegistrationStats
        sectionHeader={section1Title}
        registrationStats={regStatsData}
      />
      {/*/!*Section 2 - Nationwide Demography Stats *!/*/}
      <DemographyMain
        sectionHeader={section2Title}
        divisionWiseRegistrationCount={dvWiseData.divisionWiseData}
      />
      {/*/!*Section 3 - Facility-wise Registration Stats *!/*/}
      <FacilityServiceOverview
        sectionHeader={section3Title}
        apiEndPoints={[]}
      />
    </>
  );
});