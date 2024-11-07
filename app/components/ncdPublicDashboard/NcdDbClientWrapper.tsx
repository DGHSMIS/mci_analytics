"use client";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";
import SectionSkeletonLoader from "@components/publicDashboard/sections/DefaultSectionTemplate/SectionSkeletonLoader";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { useStore } from "@store/store";
import { QueryClient, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { NCDAggregatedStatsProps } from "@utils/interfaces/Analytics/NCD/NCDAggregatedStatsProps";
import { NCDDiseasewiseStatsProps } from "@utils/interfaces/Analytics/NCD/NCDDiseasewiseStatsProps";
import { NCDLifetimeStats } from "@utils/interfaces/Analytics/NCD/NCDLifetimeStats";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import dynamic from "next/dynamic";
import { memo } from "react";



const NCDLifetimeStatsSection = dynamic(
    () => import("@components/ncdPublicDashboard/ncdLifetimeStatsSection/NCDLifetimeStatsSection"), {
    ssr: true,
    loading: () => (<SkeletonCardIndicator />),
})
const NCDAggregatedDataSection = dynamic(
    () => import("@components/ncdPublicDashboard/ncdAggregatedDataSection/NCDAggregatedDataSection"), {
    ssr: false,
    loading: () => (<SectionSkeletonLoader renderContext={1} hideFilterDD={false} />)
})
const NCDDiseasewiseDataSection = dynamic(
    () => import("@components/ncdPublicDashboard/ncdDiseasewiseDataSection/NCDDiseasewiseDataSection"), {
    ssr: true,
    loading: () => (<SectionSkeletonLoader renderContext={1} hideFilterDD={false} />)
})



function useNCDLifeTimeStats(props: {
    queryClient: QueryClient;
}) {
    return useSuspenseQuery({
        queryKey: ["getNCDLifetimeStats", props.queryClient],
        queryFn: async () => await getAPIResponse(
            getBaseUrl(),
            getUrlFromName("get-ncd-lifetime-stats"),
            "",
            "GET",
            null,
            false,
            getRevalidationTime(),
        ),
        select: (data: any) => {
            console.log("The NCD Lifetime stats from Page RSC");
            console.table(data);
            // Step 3 - Combine the data for the page
            if (data) {
                const ncdLifeTimeStats: NCDLifetimeStats = { ...data };
                return ncdLifeTimeStats;
            } else {
                return {
                    totalPatients: 0,
                    totalReferrals: 0,
                    totalFollowUps: 0,
                    emergencyCounts: 0
                };
            }
        },
    }, props.queryClient);
}

function useNCDAggregatedStats(props: {
    queryClient: QueryClient;
    minDate: Date;
    maxDate: Date;
    facility_code: string;
}) {
    return useSuspenseQuery({
        queryKey: ["getNCDAggregatedStats", props.queryClient, props.minDate, props.maxDate, props.facility_code],
        queryFn: async () => await getAPIResponse(
            getBaseUrl(),
            getUrlFromName("get-ncd-aggregated-stats") + `?dateFrom=${props.minDate.toISOString()}&dateTo=${props.maxDate.toISOString()}&facility_code=${props.facility_code ?? ""}`,
            "",
            "GET",
            null,
            false,
            getRevalidationTime(),
        ),
        select: (data: any) => {
            console.log("The NCD Aggregated stats");
            console.log(data);
            // Step 3 - Combine the data for the page
            if (data) {
                const ncdAggStats: NCDAggregatedStatsProps = { ...data };
                return ncdAggStats;
            } else {
                return {
                    patientCountByFacility: [],
                    patientCountByServiceLocation: [],
                    ncdgetTimeSeriesData: [],
                    referralsAndFollowUpsByFacility: [],
                    diseaseByAgeGroup: [],
                    ncdPatientsByGender: []
                };
            }
        },
    }, props.queryClient);
}

function useNCDiseasewiseStats(props: {
    queryClient: QueryClient;
    minDate: Date;
    maxDate: Date;
    disease_code: string;
}) {
    /* @ts-ignore */
    return useSuspenseQuery({
        queryKey: ["getNCDDiseaseStats", props.queryClient, props.minDate, props.maxDate, props.disease_code],
        queryFn: async () => await getAPIResponse(
            getBaseUrl(),
            getUrlFromName("get-ncd-disease-stats") + `?dateFrom=${props.minDate.toISOString()}&dateTo=${props.maxDate.toISOString()}&disease_code=${props.disease_code ?? ""}`,
            "",
            "GET",
            null,
            false,
            getRevalidationTime(),
        ),
        select: (data: any) => {
            console.log("The NCD Disease stats");
            console.log(data);
            // Step 3 - Combine the data for the page
            if (data) {
                const ncdDiseaseStats: NCDDiseasewiseStatsProps = { ...data };
                return ncdDiseaseStats;
            } else {
                return {
                    totalPatients: "0",
                    ageGroup: [],
                    serviceLocationGroup: [],
                    facilityGroup: [],
                    timeSeriesData: [],
                    referralsAndFollowUps: []
                };
            }
        },
    }, props.queryClient);
}

export default memo(function NcdDbClientWrapper() {

    const {
        ncdDataMinDate,
        ncdDataMaxDate,
        ncdAggregatedSelectedFacility,
        ncdDiseaseSelected
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

    const { data: ncdStats, isError: ncdStatIsError, isLoading: ncdStatIsLoading } = useNCDLifeTimeStats({ queryClient });
    const { data: ncdAggStats, isError: ncdAggStatIsError, isLoading: ncdAggStatIsLoading } = useNCDAggregatedStats({ queryClient, minDate: ncdDataMinDate, maxDate: ncdDataMaxDate, facility_code: ncdAggregatedSelectedFacility });
    const { data: ncdDiseaseStats, isError: ncdDiseaseStatIsError, isLoading: ncdDiseaseStatIsLoading } = useNCDiseasewiseStats({ queryClient, minDate: ncdDataMinDate, maxDate: ncdDataMaxDate, disease_code: ncdDiseaseSelected });


    // const aggregatedData:NCDAggregatedDataSectionProps = {
    //     filterMaxDate: ncdDataMaxDate,
    //     filterMinDate: ncdDataMinDate,
    // }

    console.log("The NCD Lifetime stats from Page RSC");
    console.table(ncdStats);
    console.table(ncdStatIsError);
    console.table(ncdStatIsLoading);

    console.log("The NCD Aggregated stats");
    console.table(ncdAggStats);
    console.table(ncdAggStatIsError);
    console.table(ncdAggStatIsLoading);

    console.log("The NCD Disease stats");
    console.table(ncdDiseaseStats);
    console.table(ncdDiseaseStatIsError);
    console.table(ncdDiseaseStatIsLoading);

    console.log("The registration stats from Page RSC");

    return (
        <span className="transition-all flex flex-col space-y-24">
            <NCDLifetimeStatsSection key={1} {...ncdStats} />
            <NCDAggregatedDataSection key={3} sectionData={ncdAggStats} />
            <NCDDiseasewiseDataSection key={5} sectionData={ncdDiseaseStats} />
        </span>

    );
});
