"use client";
import { defaultBarLegend, defaultBottomAxisProps, defaultLeftAxisProps, defaultOtherProps } from "@charts/BarChart/BarChartDefaultProps";
import { ChartThemeDef } from "@charts/ChartThemeDef";
import { TooltipBarChartProps } from "@components/charts/BarChart/TooltipBarChart";
import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";
import SearchDateRangeFilter from "@components/publicDashboard/sectionFilterSegment/SearchDateRangeFilter";
import DropDownSingle from "@library/form/DropDownSingle";
import FormItemResponseProps from "@library/form/FormItemResponseProps";
import { AxisProps } from "@nivo/axes";
import { BarLegendProps } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "@utils/ThemeToken";
import dynamic from "next/dynamic";
import { memo } from "react";
const NCDashboardCardCommonProps: CardIndicatorsProps = {
    className: "h-fit hover:shadow-lg hover:cursor-pointer",
    iconBgVariant: "light",
    variant: "success",
    hasIcon: true,
    hasCategoryTitle: false,
    hasTitle: true,
    titleAlign: "center",
};
const BarChartMCI = dynamic(
    () => import("@charts/BarChart/BarChartMCI"), {
    ssr: true,
})
const CardIndicators = dynamic(() => import("@components/globals/CardIndicator/CardIndicator"), {
    ssr: true,
    loading: () => (<SkeletonCardIndicator />),
});
// const FacilityTypewiseRegistrationStats = dynamic(() => import("@components/publicDashboard/sections/facilityTypewiseRegistrationStats/FacilityTypewiseRegistrationStats"), {
//   ssr: false,
//   loading: () => (<SkeletonFacilityTypewiseRegistrationStats />)
// });

// const DemographyMain = dynamic(() => import("@components/publicDashboard/sections/demographySection/DemographyMain"), {
//   ssr: false,
//   loading: () => (<SectionSkeletonLoader renderContext={1} hideFilterDD={false} />)
// });

// const FacilityServiceOverview = dynamic(() => import("@components/publicDashboard/sections/facilityServiceOverview/FacilityServiceOverview"), {
//   ssr: false,
//   loading: () => (<SectionSkeletonLoader renderContext={2} hideFilterDD={true} />)
// });


// function useRegistrationStatsAPI(props: {
//   queryClient: QueryClient;
// }) {
//   /* @ts-ignore */
//   return useSuspenseQuery({
//     queryKey: ["getPublicDashboardAnalytics", props.queryClient],
//     queryFn: async () => await getAPIResponse(
//       getBaseUrl(),
//       getUrlFromName("get-facilitywise-count-stats"),
//       "",
//       "GET",
//       null,
//       false,
//       getRevalidationTime(),
//     ),
//     //https://tkdodo.eu/blog/react-query-data-transformations
//     //Tranform data
//     select: (data) => {
//       if (data) {
//         console.log("The registration stats from Page RSC");
//         console.table(data);
//         const regStats: FacilityTypeWiseStatsInterface = { ...data };
//         return regStats;
//       } else {
//         const empty: FacilityTypeWiseStatsInterface = {
//           totalCount: 0,
//           openMRSCount: 0,
//           openSRPCount: 0,
//           aaloClincCount: 0,
//           eMISCount: 0,
//         };
//         return empty;
//       }
//     },
//   }, props.queryClient);
// }


// function useEncounterStatsAPI(props: {
//   queryClient: QueryClient;
// }) {
//   /* @ts-ignore */
//   return useSuspenseQuery({
//     queryKey: ["getPublicEncounterAnalytics", props.queryClient],
//     queryFn: async () => await getAPIResponse(
//       getBaseUrl(),
//       getUrlFromName("get-facilitywise-encounter-count-stats"),
//       "",
//       "GET",
//       null,
//       false,
//       getRevalidationTime(),
//     ),
//     //https://tkdodo.eu/blog/react-query-data-transformations
//     //Tranform data
//     select: (data) => {
//       if (data) {
//         console.log("The encounter stats from Page RSC");
//         console.table(data);
//         const encounterStatsData: FacilityTypeWiseStatsInterface = { ...data };
//         return encounterStatsData;
//       } else {
//         const empty: FacilityTypeWiseStatsInterface = {
//           totalCount: 0,
//           openMRSCount: 0,
//           openSRPCount: 0,
//           aaloClincCount: 0,
//           eMISCount: 0,
//         };
//         return empty;
//       }
//     },
//   }, props.queryClient);
// }


// function useDivisionWiseDataAPI(props: {
//   queryClient: QueryClient;
//   minDate: Date;
//   maxDate: Date;
//   regStatsData: FacilityTypeWiseStatsInterface;
// }) {
//   /* @ts-ignore */
//   return useSuspenseQuery({
//     queryKey: ["getDivisionWiseData", props.queryClient, props.minDate, props.maxDate],
//     queryFn: async () => await fetchDivisionWiseData(
//       props.minDate,
//       props.maxDate,
//     ),
//     select: (data) => {
//       // Step 3 - Combine the data for the page
//       if (data) {
//         return {
//           ...props.regStatsData,
//           dailyRegistration: {},
//           divisionWiseData: { ...data },
//         };
//       } else {
//         return {
//           ...props.regStatsData,
//           dailyRegistration: {},
//           divisionWiseData: {},
//         };
//       }
//     },
//   }, props.queryClient);
// }


interface NcdPublicDashboardProps {

}
const leftAxisProps: AxisProps<any> = {
    ...defaultLeftAxisProps,
    legend: "No. Patients Served",
    legendOffset: -40,
};

const bottomAxisProps: AxisProps<any> = {
    ...defaultBottomAxisProps,
    legend: "Age Groups of patients under 18 years",
    legendOffset: 50,
};
const barLegend: BarLegendProps[] = [...defaultBarLegend];

const tooltipProps = (item: any): TooltipBarChartProps => {
    return {
        line1Label: "No. Patients Served",
        line1Value: item.indexValue,
        line2Label: "Age Groups of patients under 18 years",
        line2Value: item.value,
    };
};

export default memo(function NcdDbClientWrapper({
}: NcdPublicDashboardProps) {
    const colorsTheme: any = tokens();
    //   const {
    //     demographyMinDate,
    //     demographyMaxDate,
    //   } = useStore();

    //   const queryClient = useQueryClient();
    //   const defaultQueryOptions = queryClient.getDefaultOptions();
    //   queryClient.setDefaultOptions({
    //     queries: {
    //       ...defaultQueryOptions.queries,
    //       refetchOnMount: true,
    //       refetchOnWindowFocus: true,
    //       refetchOnReconnect: true,
    //     },
    //   });


    //   // Step 1 - Getting the data for the Dashboard page, directly on the server site
    //   const { data: regStatsData, isError: regStatIsError, isLoading: regStatIsLoading } = useRegistrationStatsAPI({ queryClient });

    //   // Step 2 - Getting the encounter stats for the Dashboard page, directly on the server site
    //   const { data: encounterStatsData, isError: encounterStatIsError, isLoading: encounterStatIsLoading } = useEncounterStatsAPI({ queryClient });

    //   // Step 3 - Get Division/District wise data
    //   const { data: dvWiseData, isError: dvWiseError, isPending: dvWisePending, isLoading: dvWiseLoading } = useDivisionWiseDataAPI({
    //     queryClient,
    //     minDate: demographyMinDate,
    //     maxDate: demographyMaxDate,
    //     regStatsData: regStatsData,
    //   });

    console.log("The registration stats from Page RSC");

    return (
        <div>
            <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
                Lifetime NCD Stats
            </h3>
            <div className="grid grid-cols-4  lg:grid-cols-4 gap-16 lg:space-x-0 mb-12">

                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={0}
                    title={"Total NCD patients"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "42,100"
                    }
                />
                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={1}
                    title={"Total Referrals to higher level of care"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "42,100"
                    }
                />
                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={2}
                    title={"Total Follow up visits"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "42,100"
                    }
                />
                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={2}
                    title={"Total Facilities Monitored"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "25"
                    }
                />
            </div>
            <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
                NCD Data Insights
            </h3>
            <div className="relative min-h-[400px] w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20 hover:border-primary-400  hover:shadow-xl">
            <h3 className="mb-0 text-base font-semibold uppercase text-slate-600">
                        Filter Data
                    </h3>
                <div className="mt-40 h-full h-min-[500px] flex w-full flex-col justify-center space-y-48 px-24 2xl:container">
                    <div className="min-h-full h-full items-end gap-16 space-y-16 sm:grid sm:grid-cols-3 sm:space-y-0 md:grid-cols-4 xl:grid-cols-4">
                        <SearchDateRangeFilter renderContext={3} />
                        <DropDownSingle
                            filterPlaceholder="Diseases"
                            isFilterable={true}
                            items={[]}
                            size="sm"
                            label={"Select Division"}
                            index={0}
                            isDisabled={false}
                            isRequired={false}
                            onChange={function (value: FormItemResponseProps): void {
                                console.log(value.data);
                            }}
                        />

                        <DropDownSingle
                            filterPlaceholder="Facility"
                            isFilterable={true}
                            items={[]}
                            size="sm"
                            label={"Select Facility"}
                            index={0}
                            isDisabled={false}
                            isRequired={false}
                            onChange={function (value: FormItemResponseProps): void {
                                console.log(value.data);
                            }}
                        />

                        <DropDownSingle
                            filterPlaceholder="Service Location"
                            isFilterable={true}
                            items={[]}
                            size="sm"
                            label={"Select Service Location"}
                            index={0}
                            isDisabled={false}
                            isRequired={false}
                            onChange={function (value: FormItemResponseProps): void {
                                console.log(value.data);
                            }}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2  lg:grid-cols-4 gap-16 px-24 lg:space-x-0 lg:space-y-0">
                    <CardIndicators
                        {...NCDashboardCardCommonProps}
                        key={0}
                        title={"Bronchial Asthma"}
                        iconName="bar-chart-square-plus"
                        className='col-span-2 lg:col-span-1'
                        subTitle={
                            "1000"
                        }
                    />
                    <CardIndicators
                        {...NCDashboardCardCommonProps}
                        key={0}
                        title={"Congenital Heart Diseases"}
                        iconName="bar-chart-square-plus"
                        className='col-span-2 lg:col-span-1'
                        subTitle={
                            "1000"
                        }
                    />
                    <CardIndicators
                        {...NCDashboardCardCommonProps}
                        key={0}
                        title={"Epilepsy"}
                        iconName="bar-chart-square-plus"
                        className='col-span-2 lg:col-span-1'
                        subTitle={
                            "1000"
                        }
                    />
                    <CardIndicators
                        {...NCDashboardCardCommonProps}
                        key={0}
                        title={"Type 1 Diabetes Mellitus"}
                        iconName="bar-chart-square-plus"
                        className='col-span-2 lg:col-span-1'
                        subTitle={
                            "1000"
                        }
                    />
                    <CardIndicators
                        {...NCDashboardCardCommonProps}
                        key={0}
                        title={"Thalassemia and iron deficiency anemia"}
                        iconName="bar-chart-square-plus"
                        className='col-span-2 lg:col-span-1'
                        subTitle={
                            "1000"
                        }
                    />
                    <CardIndicators
                        {...NCDashboardCardCommonProps}
                        key={0}
                        title={"Nephrotic Syndrome"}
                        iconName="bar-chart-square-plus"
                        className='col-span-2 lg:col-span-1'
                        subTitle={
                            "1000"
                        }
                    />
                    <CardIndicators
                        {...NCDashboardCardCommonProps}
                        key={0}
                        title={"Referral to higher level of care"}
                        iconName="bar-chart-square-plus"
                        className='col-span-2 lg:col-span-1'
                        subTitle={
                            "1000"
                        }
                    />
                    <CardIndicators
                        {...NCDashboardCardCommonProps}
                        key={0}
                        title={"Follow-up visits"}
                        iconName="bar-chart-square-plus"
                        className='col-span-2 lg:col-span-1'
                        subTitle={
                            "1000"
                        }
                    />
                </div>
                <h3 className="mb-0 text-base font-semibold uppercase text-slate-600 ">
                        Chart Representation of NCD Stats
                    </h3>
                <div className="grid grid-cols-2  lg:grid-cols-2 gap-16 lg:space-x-0 lg:space-y-0 px-24">
                    <div className="h-[320px] w-full  rounded-lg relative">
                        <BarChartMCI
                            chartTitle="Registration Age Distribution Trends"
                            originalData={[
                                {
                                    "ageRange": "0-3",
                                    "count": 192,
                                },
                                {
                                    "ageRange": "4-7",
                                    "count": 107,
                                },
                                {
                                    "ageRange": "8-11",
                                    "count": 107,
                                },
                                {
                                    "ageRange": "12-15",
                                    "count": 142,
                                },
                                {
                                    "ageRange": "16-18",
                                    "count": 10,
                                },
                            ]}
                            indexBy="ageRange"
                            groupModeState="grouped"
                            keys={["count"]}
                            colors={{ scheme: 'dark2' }}
                            axisLeft={leftAxisProps}
                            axisBottom={bottomAxisProps}
                            legend={barLegend}
                            otherProps={{
                                ...defaultOtherProps,
                                tooltipProps: tooltipProps,
                                layout: "vertical",
                                valueScale: { type: "linear" },
                                margin: {
                                    top: 50,
                                    right: 60,
                                    bottom: 70,
                                    left: 60,
                                },
                            }}
                            {...ChartThemeDef({
                                colors: colorsTheme
                            })}

                        />
                    </div>
                    <div className="h-[320px] w-full  rounded-lg relative">
                        <ResponsivePie
                            data={[
                                {
                                    "id": "Male",
                                    "label": "Male",
                                    "value": 468,
                                    "color": "hsl(214, 70%, 50%)"
                                },
                                {
                                    "id": "Female",
                                    "label": "Female",
                                    "value": 364,
                                    "color": "hsl(355, 70%, 50%)"
                                },
                                {
                                    "id": "Others",
                                    "label": "Others",
                                    "value": 30,
                                    "color": "hsl(230, 70%, 50%)"
                                },
                            ]}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            borderWidth={1}
                            borderColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        0.2
                                    ]
                                ]
                            }}
                            arcLinkLabelsSkipAngle={10}
                            arcLinkLabelsTextColor="#333333"
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        2
                                    ]
                                ]
                            }}
                            defs={[
                                {
                                    id: 'dots',
                                    type: 'patternDots',
                                    background: 'inherit',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    size: 4,
                                    padding: 1,
                                    stagger: true
                                },
                                {
                                    id: 'lines',
                                    type: 'patternLines',
                                    background: 'inherit',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    rotation: -45,
                                    lineWidth: 6,
                                    spacing: 10
                                }
                            ]}
                            fill={[
                                {
                                    match: {
                                        id: 'Male'
                                    },
                                    id: 'dots'
                                },
                                {
                                    match: {
                                        id: 'Female'
                                    },
                                    id: 'lines'
                                },
                                {
                                    match: {
                                        id: 'Others'
                                    },
                                    id: 'lines'
                                }
                            ]}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    justify: false,
                                    translateX: 0,
                                    translateY: 56,
                                    itemsSpacing: 0,
                                    itemWidth: 100,
                                    itemHeight: 18,
                                    itemTextColor: '#999',
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 1,
                                    symbolSize: 18,
                                    symbolShape: 'circle',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000'
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </div>
                    <div className="h-[320px] w-full  rounded-lg relative">
                        <BarChartMCI
                            chartTitle="Registration Age Distribution Trends"
                            originalData={[
                                {
                                    "ageRange": "0-3",
                                    "count": 192,
                                },
                                {
                                    "ageRange": "4-7",
                                    "count": 107,
                                },
                                {
                                    "ageRange": "8-11",
                                    "count": 107,
                                },
                                {
                                    "ageRange": "12-15",
                                    "count": 142,
                                },
                                {
                                    "ageRange": "16-18",
                                    "count": 10,
                                },
                            ]}
                            indexBy="ageRange"
                            groupModeState="grouped"
                            keys={["count"]}
                            colors={{ scheme: 'accent' }}
                            axisLeft={leftAxisProps}
                            axisBottom={bottomAxisProps}
                            legend={barLegend}
                            otherProps={{
                                ...defaultOtherProps,
                                tooltipProps: tooltipProps,
                                layout: "vertical",
                                valueScale: { type: "linear" },
                                margin: {
                                    top: 50,
                                    right: 60,
                                    bottom: 70,
                                    left: 60,
                                },
                            }}
                            {...ChartThemeDef({
                                colors: colorsTheme,
                            })}
                        />
                    </div>
                </div>
            </div>
        </div>

    );
});