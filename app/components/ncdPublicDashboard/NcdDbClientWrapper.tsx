"use client";
import { defaultBarLegend, defaultBottomAxisProps, defaultLeftAxisProps, defaultOtherProps } from "@charts/BarChart/BarChartDefaultProps";
import TooltipBarChart, { TooltipBarChartProps } from "@components/charts/BarChart/TooltipBarChart";
import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";
import { AxisProps } from "@nivo/axes";
import { BarLegendProps } from "@nivo/bar";
import { useStore } from "@store/store";
import { tokens } from "@utils/ThemeToken";
import dynamic from "next/dynamic";
import { memo, useMemo } from "react";


import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { QueryClient, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ncdDiseases } from "@utils/constants";
import { NCDAggregatedStatsProps } from "@utils/interfaces/NCD/NCDAggregatedStatsProps";
import { NCDDiseasewiseStatsProps } from "@utils/interfaces/NCD/NCDDiseasewiseStatsProps";
import { NCDLifetimeStats } from "@utils/interfaces/NCD/NCDLifetimeStats";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { NCDLifetimeStatsSection } from "./ncdLifetimeStatsSection/NCDLifetimeStatsSection";

const NCDashboardCardCommonProps: CardIndicatorsProps = {
    className: "h-fit hover:shadow-lg hover:cursor-pointer",
    iconBgVariant: "light",
    variant: "success",
    hasIcon: true,
    hasCategoryTitle: false,
    hasTitle: true,
    titleAlign: "center",
};

const NCDAggregatedDataSection = dynamic(
    () => import("@components/ncdPublicDashboard/ncdAggregatedDataSection/NCDAggregatedDataSection"), {
    ssr: false,
    loading: () => (<SkeletonCardIndicator />),
})
const NCDDiseasewiseDataSection = dynamic(
    () => import("@components/ncdPublicDashboard/ncdDiseasewiseDataSection/NCDDiseasewiseDataSection"), {
    ssr: false,
    loading: () => (<SkeletonCardIndicator />),
})


const tooltipProps = (item: any): TooltipBarChartProps => {
    return {
        line1Label: "Age Groups: ",
        line1Value: item.indexValue,
        line2Label: "Count:",
        line2Value: item.value,
    };
};

function useNCDLifeTimeStats(props: {
    queryClient: QueryClient;
}) {
    /* @ts-ignore */
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
        select: (data:any) => {
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
    /* @ts-ignore */
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
        select: (data:any) => {
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
        select: (data:any) => {
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

    const barChartkeys = ncdDiseases;

    const { leftAxisProps, bottomAxisProps, otherPropVals, barLegendProps } = useMemo(() => {
        const leftAxisProps: AxisProps<any> = {
            ...defaultLeftAxisProps,
            legend: "Patients Served",
            legendOffset: -40,
        };

        const bottomAxisProps: AxisProps<any> = {
            ...defaultBottomAxisProps,
            legend: "Patient Age Groups",
            legendOffset: 40,
        };

        const otherPropVals = {
            ...defaultOtherProps,
            isInteractive: true,
            legend: "NCD Disease Distribution",
            tooltip: (item: any) => (
                <TooltipBarChart {...tooltipProps(item)} />
            ),
        };
        const barLegendProps: BarLegendProps[] = [...defaultBarLegend];
        barLegendProps[0].direction = "column";

        return {
            leftAxisProps,
            bottomAxisProps,
            barLegendProps,
            otherPropVals,
        };
    }, []);

    const colorsTheme: any = tokens();

    console.log("The registration stats from Page RSC");


    return (
        <>
            <NCDLifetimeStatsSection key={1} {...ncdStats} />
            <h3 key={2}  className="mb-12 text-base font-semibold uppercase text-slate-600">
                Aggregated NCD Stats
            </h3>
            <NCDAggregatedDataSection  key={3}  sectionData={ncdAggStats} />
            <br />
            <h3  key={4} className="mb-12 text-base font-semibold uppercase text-slate-600">
                Disease Focused Analytics
            </h3>
            <NCDDiseasewiseDataSection  key={5} sectionData={ncdDiseaseStats}/>
        </>

    );
});



// export function NCDLineGraph({ data = [
//     {
//         "id": "Bronchial Asthma",
//         "color": "hsl(200, 70%, 50%)",
//         "hidden": false,
//         "data": [
//             { "x": "2024-03-31", "y": 200 },
//             { "x": "2024-04-01", "y": 120 },
//             { "x": "2024-04-02", "y": 530 },
//             { "x": "2024-04-03", "y": 450 },
//             { "x": "2024-04-04", "y": 380 },
//             { "x": "2024-04-05", "y": 310 },
//             { "x": "2024-04-06", "y": 490 },
//             { "x": "2024-04-07", "y": 270 },
//             { "x": "2024-04-08", "y": 220 },
//             { "x": "2024-04-09", "y": 360 }
//         ]
//     },
//     {
//         "id": "Congenital Heart Diseases",
//         "color": "hsl(200, 70%, 50%)",
//         "hidden": false,
//         "data": [
//             { "x": "2024-03-31", "y": 100 },
//             { "x": "2024-04-01", "y": 420 },
//             { "x": "2024-04-02", "y": 130 },
//             { "x": "2024-04-03", "y": 210 },
//             { "x": "2024-04-04", "y": 340 },
//             { "x": "2024-04-05", "y": 180 },
//             { "x": "2024-04-06", "y": 300 },
//             { "x": "2024-04-07", "y": 410 },
//             { "x": "2024-04-08", "y": 270 },
//             { "x": "2024-04-09", "y": 320 }
//         ]
//     },
//     {
//         "id": "Epilepsy",
//         "color": "hsl(200, 70%, 50%)",
//         "hidden": false,
//         "data": [
//             { "x": "2024-03-31", "y": 300 },
//             { "x": "2024-04-01", "y": 20 },
//             { "x": "2024-04-02", "y": 320 },
//             { "x": "2024-04-03", "y": 100 },
//             { "x": "2024-04-04", "y": 150 },
//             { "x": "2024-04-05", "y": 400 },
//             { "x": "2024-04-06", "y": 230 },
//             { "x": "2024-04-07", "y": 350 },
//             { "x": "2024-04-08", "y": 180 },
//             { "x": "2024-04-09", "y": 260 }
//         ]
//     },
//     {
//         "id": "Type 1 Diabetes Mellitus",
//         "color": "hsl(200, 70%, 50%)",
//         "hidden": false,
//         "data": [
//             { "x": "2024-03-31", "y": 400 },
//             { "x": "2024-04-01", "y": 220 },
//             { "x": "2024-04-02", "y": 320 },
//             { "x": "2024-04-03", "y": 290 },
//             { "x": "2024-04-04", "y": 370 },
//             { "x": "2024-04-05", "y": 440 },
//             { "x": "2024-04-06", "y": 310 },
//             { "x": "2024-04-07", "y": 250 },
//             { "x": "2024-04-08", "y": 390 },
//             { "x": "2024-04-09", "y": 350 }
//         ]
//     },
//     {
//         "id": "Thalassemia and iron deficiency anemia",
//         "color": "hsl(200, 70%, 50%)",
//         "hidden": false,
//         "data": [
//             { "x": "2024-03-31", "y": 200 },
//             { "x": "2024-04-01", "y": 140 },
//             { "x": "2024-04-02", "y": 155 },
//             { "x": "2024-04-03", "y": 180 },
//             { "x": "2024-04-04", "y": 130 },
//             { "x": "2024-04-05", "y": 170 },
//             { "x": "2024-04-06", "y": 220 },
//             { "x": "2024-04-07", "y": 200 },
//             { "x": "2024-04-08", "y": 140 },
//             { "x": "2024-04-09", "y": 190 }
//         ]
//     },
//     {
//         "id": "Nephrotic Syndrome",
//         "color": "hsl(200, 70%, 50%)",
//         "hidden": false,
//         "data": [
//             { "x": "2024-03-31", "y": 36 },
//             { "x": "2024-04-01", "y": 270 },
//             { "x": "2024-04-02", "y": 212 },
//             { "x": "2024-04-03", "y": 180 },
//             { "x": "2024-04-04", "y": 250 },
//             { "x": "2024-04-05", "y": 310 },
//             { "x": "2024-04-06", "y": 400 },
//             { "x": "2024-04-07", "y": 150 },
//             { "x": "2024-04-08", "y": 220 },
//             { "x": "2024-04-09", "y": 300 }
//         ]
//     }
// ] }: any) {

//     const timeSeriesData: Serie[] = data;
//     const [filteredData, setFilteredData] = useState(timeSeriesData);
//     const handleLegendClick = (legend: Datum) => {

//         // Toggle visibility of the clicked legend's data
//         console.log("The Full data");
//         console.log(filteredData);

//         //Check if any legend is already hidden & if so, make it visible
//         let isAnyHidden = false;
//         filteredData.forEach((dataset: Serie) => {
//             let data = dataset;
//             if (data.hidden) {
//                 isAnyHidden = true;
//             }
//         });
//         console.log("Is any hidden", isAnyHidden);
//         let isFound = false;

//         let considerMakingAllItemsVisible = false;
//         let currentVisibleItemId: String | Number | null = null;
//         if (isAnyHidden) {
//             filteredData.forEach((dataset: Serie) => {
//                 console.log("Checking if all items should be visible");
//                 console.log("The legend ID", legend.id);
//                 console.log("The dataset ID", dataset.id);
//                 console.log("The dataset", dataset);
//                 console.log("The dataset is hidden", dataset.hidden);
//                 if (dataset.id === legend.id && !dataset.hidden && !considerMakingAllItemsVisible) {
//                     console.log("Making all items visible");
//                     considerMakingAllItemsVisible = true
//                     currentVisibleItemId = dataset.id;
//                 }
//             });
//         }

//         //If we are making all items visible, we need to make all items visible
//         //clicking on the same legend should not hide the data
//         if (considerMakingAllItemsVisible) {
//             console.log("Here 0");

//             if (currentVisibleItemId == legend.id) {
//                 console.log("Here 1");
//                 const updatedData = filteredData.map((dataset: Serie) => {
//                     return { ...dataset, hidden: false };
//                 });
//                 setFilteredData(updatedData);
//             } else {
//                 const updatedData = filteredData.map((dataset: Serie) => {
//                     console.log("Here 2");
//                     if (currentVisibleItemId == legend.id) {
//                         return { ...dataset, hidden: false };
//                     } else {
//                         return { ...dataset, hidden: true };
//                     }
//                 });
//                 setFilteredData(updatedData);
//             }
//         }
//         else {
//             console.log("Here 3");

//             const updatedData = filteredData.map((dataset: Serie) => {
//                 console.log("The clicked legend");
//                 console.log(legend);
//                 console.log("The dataset");
//                 console.log(dataset);
//                 let data = dataset;
//                 console.log("Filtering, checking if any data is hidden", isAnyHidden);
//                 console.log("Filtering - Some items are hidden but we need to check if all items should be visible");
//                 if (data.id === legend.id) {
//                     isFound = true;
//                     return { ...data, hidden: false };
//                 }
//                 return { ...data, hidden: true };

//             });

//             // console.log("The updated data");
//             // console.log(updatedData);
//             setFilteredData(updatedData);
//         }





//     };
//     const visibleData = filteredData.filter((dataset) => {
//         if (dataset.hidden) {
//             dataset.data = []
//         } else {
//             timeSeriesData.filter((data) => {
//                 if (data.id == dataset.id) {
//                     dataset.data = data.data;
//                 }
//             });
//         }

//         console.log("The dataset being rendered");
//         console.log(dataset);
//         return dataset;
//     });


//     const defaultBarLegend: BarLegendProps[] = [
//         {
//             dataFrom: "keys",
//             anchor: "bottom-right",
//             direction: "column",
//             justify: false,
//             translateX: 120,
//             translateY: 0,
//             itemsSpacing: 2,
//             itemWidth: 100,
//             itemHeight: 20,
//             itemDirection: "left-to-right",
//             itemOpacity: 0.85,
//             symbolSize: 20,
//         },
//     ];

//     const formatTime = timeFormat("%Y-%m-%d");
//     const axisBottom: AxisProps = {
//         tickSize: 4,
//         tickPadding: 20,
//         tickRotation: 0,
//         format: (value) => formatTime(new Date(value)),
//         legendOffset: 72,
//         legendPosition: "middle",
//     }
//     const legendProps: LegendProps[] = [{
//         toggleSerie: true,
//         anchor: "bottom",
//         direction: "column",
//         justify: false,
//         translateX: 0,
//         translateY: 160,
//         itemsSpacing: 2,
//         itemDirection: "left-to-right",
//         itemWidth: 300,
//         itemHeight: 20,
//         symbolSize: 12,
//         symbolShape: "square",
//         symbolBorderColor: "rgba(0, 0, 0, .15)",
//         symbolBorderWidth: 1,
//         // onClick: (datatum) => handleLegendClick(datatum),
//         itemOpacity: 1,
//         effects: [
//             {
//                 on: "hover",
//                 style: {
//                     itemBackground: "rgba(0, 0, 0, .03)",
//                     itemOpacity: 1,
//                 },
//             },
//         ],
//     }]
//     return (
//         <>
//             <ChartTitle
//                 title={"Datewise Disease Detection"}
//                 // size="lg"
//                 align="left"
//                 classNames="mb-12 text-slate-600 text-sm uppercase"
//             />
//             <ResponsiveLine animate
//                 margin={{ top: 20, right: 20, bottom: 200, left: 60 }}
//                 legends={legendProps}
//                 axisBottom={{
//                     format: '%b %d',
//                     legend: 'time scale',
//                     legendOffset: -12,
//                     tickValues: 'every 1 days'
//                 }}
//                 // axisBottom={axisBottom}
//                 axisLeft={{
//                     legend: 'Diseasewise Count',
//                     legendOffset: -40
//                 }}
//                 // curve="cardinal"
//                 data={visibleData}
//                 enablePointLabel
//                 enableTouchCrosshair
//                 //   height={400}
//                 //   initialHiddenIds={[
//                 //     'cognac'
//                 //   ]}
//                 isInteractive={true}
//                 pointBorderColor={{
//                     from: 'color',
//                     modifiers: [
//                         [
//                             'darker',
//                             0.3
//                         ]
//                     ]
//                 }}
//                 pointBorderWidth={1}
//                 pointSize={8}
//                 pointSymbol={function noRefCheck() { return <></> }}
//                 useMesh={true}
//                 //   width={900}
//                 xFormat="time:%Y-%m-%d"
//                 xScale={{
//                     format: '%Y-%m-%d',
//                     precision: 'day',
//                     type: 'time',
//                     useUTC: false
//                 }}
//                 onClick={(point) => {
//                     console.log("Point Clicked");
//                     console.log(point);
//                 }}
//                 tooltip={({ point }) => {
//                     return (
//                         <div
//                             className={"rounded bg-slate-100 p-12 text-primary-900 backdrop:rounded"}
//                         >
//                             <div className="text-base">
//                                 <strong className="font-bold">Disease: &nbsp;</strong>
//                                 {point.id.split(".")[0]}
//                                 <div className="capitalize">
//                                     <strong className="font-bold">Count: &nbsp;</strong>
//                                     {point.data.yFormatted}
//                                 </div>
//                             </div>
//                         </div>
//                     )
//                 }}
//                 yScale={{
//                     type: 'linear'
//                 }} />
//         </>
//     )
// }