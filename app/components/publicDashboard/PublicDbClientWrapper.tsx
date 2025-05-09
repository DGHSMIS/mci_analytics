"use client";
import SectionSkeletonLoader from "@components/publicDashboard/sections/DefaultSectionTemplate/SectionSkeletonLoader";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { useStore } from "@store/store";
import { QueryClient, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { FacilityTypeWiseStatsInterface } from "@utils/interfaces/Analytics/PublicDashboard/FacilityTypeWiseStatsInterface";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { fetchDivisionWiseData } from "@utils/providers/pbdClientServiceProvider";
import { xDaysAgo } from "@utils/utilityFunctions";
import dynamic from "next/dynamic";
import { memo } from "react";
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
        const regStats: FacilityTypeWiseStatsInterface = { ...data };
        return regStats;
      } else {
        const empty: FacilityTypeWiseStatsInterface = {
          totalCount: 0,
          openMRSCount: 0,
          openSRPCount: 0,
          aaloClincCount: 0,
          eMISCount: 0,
        };
        return empty;
      }
    },
  }, props.queryClient);
}


function useEncounterStatsAPI(props: {
  queryClient: QueryClient;
}) {
  /* @ts-ignore */
  return useSuspenseQuery({
    queryKey: ["getPublicEncounterAnalytics", props.queryClient],
    queryFn: async () => await getAPIResponse(
      getBaseUrl(),
      getUrlFromName("get-facilitywise-encounter-count-stats"),
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
        console.log("The encounter stats from Page RSC");
        console.table(data);
        const encounterStatsData: FacilityTypeWiseStatsInterface = { ...data };
        return encounterStatsData;
      } else {
        const empty: FacilityTypeWiseStatsInterface = {
          totalCount: 0,
          openMRSCount: 0,
          openSRPCount: 0,
          aaloClincCount: 0,
          eMISCount: 0,
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
  regStatsData: FacilityTypeWiseStatsInterface;
}) {

  const normalizeDate = (date:Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    return d.toISOString(); // Return as ISO string
  };
  /* @ts-ignore */
  return useSuspenseQuery({
    queryKey: ["getDivisionWiseData", props.queryClient, normalizeDate(props.minDate), normalizeDate(props.maxDate)],
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
  section4Title: string;
}

export default memo(function PublicDbClientWrapper({
  section1Title,
  section2Title,
  section3Title,
  section4Title,
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

  // Step 2 - Getting the encounter stats for the Dashboard page, directly on the server site
  const { data: encounterStatsData, isError: encounterStatIsError, isLoading: encounterStatIsLoading } = useEncounterStatsAPI({ queryClient });

  // Step 3 - Get Division/District wise data
  const { data: dvWiseData, isError: dvWiseError, isPending: dvWisePending, isLoading: dvWiseLoading } = useDivisionWiseDataAPI({
    queryClient,
    minDate: demographyMinDate,
    maxDate: demographyMaxDate,
    regStatsData: regStatsData,
  });

  console.log("The registration stats from Page RSC");

  return (
    <>
      {/*Section 1 - Lifetime Registration Stats*/}
      <FacilityTypewiseRegistrationStats key={1}
        sectionHeader={section1Title}
        countStats={regStatsData}
        card1Title={"Health ID Registered"}
        card2Title={"Regs. via OpenMRS+"}
        card3Title={"Regs. via OpenSRP"}
        card4Title={"Regs. via Aalo Clinic"}
        card5Title={"Regs. via eMIS"}
      />

      {/*Section 2 - Lifetime Clinical Data Collection Stats*/}
      <FacilityTypewiseRegistrationStats
        key={2}
        sectionHeader={section2Title}
        countStats={encounterStatsData}
        card1Title={"Total Clinical Records"}
        card2Title={"Records via OpenMRS+"}
        card3Title={"Records via OpenSRP"}
        card4Title={"Records via Aalo Clinic"}
        card5Title={"Records via eMIS"}
      />
      {/*/!*Section 3 - Facility-wise Registration Stats *!/*/}
      <FacilityServiceOverview
        key={4}
        sectionHeader={section3Title}
        apiEndPoints={[]}
      />
      {/*/!*Section 4 - Nationwide Demography Stats *!/*/}
      <DemographyMain
        key={3}
        sectionHeader={section4Title}
        divisionWiseRegistrationCount={dvWiseData.divisionWiseData}
      />
    </>
  );
});