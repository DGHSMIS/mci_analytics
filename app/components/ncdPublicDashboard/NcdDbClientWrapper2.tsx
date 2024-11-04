"use client";
import { defaultBarLegend, defaultBottomAxisProps, defaultLeftAxisProps, defaultOtherProps } from "@charts/BarChart/BarChartDefaultProps";
import { ChartThemeDef } from "@charts/ChartThemeDef";
import { TooltipBarChartProps } from "@components/charts/BarChart/TooltipBarChart";
import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";
import { AxisProps } from "@nivo/axes";
import { BarLegendProps, ResponsiveBar } from "@nivo/bar";
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

export default memo(function NcdDbClientWrapper2({
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
    const diseaseStats = [
        {
            disease: "Bronchial Asthma",
            Male: 400,
            Female: 450,
            Other: 26,
        },
        {
            disease: "Congenital Heart Diseases",
            Male: 150,
            Female: 160,
            Other: 11,
        },
        {
            disease: "Epilepsy",
            Male: 170,
            Female: 150,
            Other: 13,
        },
        {
            disease: "Type 1 Diabetes Mellitus",
            Male: 80,
            Female: 90,
            Other: 5,
        },
        {
            disease: "Thalassemia and iron deficiency anemia",
            Male: 40,
            Female: 50,
            Other: 2,
        },
        {
            disease: "Nephrotic Syndrome",
            Male: 20,
            Female: 30,
            Other: 1,
        },
    ];
    const facilityStats = [
        {
            name: "Tanore Community Clinic",
            totalPatients: 876,
        },
        {
            name: "Manikganj Community Clinic",
            totalPatients: 321,
        },
        {
            name: "Singair Community Clinic",
            totalPatients: 333,
        },
        {
            name: "Keraniganj Community Clinic",
            totalPatients: 111,
        },
        {
            name: "Gurudashpur Community Clinic",
            totalPatients: 22,
        },
        {
            name: "Palash Community Clinic",
            totalPatients: 11,
        },
        {
            name: "Dummy Community Clinic",
            totalPatients: 11,
        }
    ]

    const keys = [
        "Bronchial Asthma",
        "Congenital Heart Diseases",
        "Epilepsy",
        "Type 1 Diabetes Mellitus",
        "Thalassemia and iron deficiency anemia",
        "Nephrotic Syndrome",
    ];
    const data = [
        {
            facility: "Tanore CC",
            "Bronchial Asthma": 200,
            "Congenital Heart Diseases": 150,
            "Epilepsy": 100,
            "Type 1 Diabetes Mellitus": 50,
            "Thalassemia and iron deficiency anemia": 30,
            "Nephrotic Syndrome": 20,
        },
        {
            facility: "Manikganj CC",
            "Bronchial Asthma": 180,
            "Congenital Heart Diseases": 120,
            "Epilepsy": 90,
            "Type 1 Diabetes Mellitus": 40,
            "Thalassemia and iron deficiency anemia": 20,
            "Nephrotic Syndrome": 10,
        },
        {
            facility: "Singair CC",
            "Bronchial Asthma": 160,
            "Congenital Heart Diseases": 110,
            "Epilepsy": 80,
            "Type 1 Diabetes Mellitus": 30,
            "Thalassemia and iron deficiency anemia": 15,
            "Nephrotic Syndrome": 5,
        },
        {
            facility: "Keraniganj CC",
            "Bronchial Asthma": 140,
            "Congenital Heart Diseases": 100,
            "Epilepsy": 70,
            "Type 1 Diabetes Mellitus": 20,
            "Thalassemia and iron deficiency anemia": 10,
            "Nephrotic Syndrome": 5,
        },
        {
            facility: "Gurudashpur CC",
            "Bronchial Asthma": 120,
            "Congenital Heart Diseases": 90,
            "Epilepsy": 60,
            "Type 1 Diabetes Mellitus": 20,
            "Thalassemia and iron deficiency anemia": 10,
            "Nephrotic Syndrome": 5,
        }
    ];
    // Dummy data for each disease with gender counts
    const diseaseGenderData = {
        "Bronchial Asthma": {
            Male: 400,
            Female: 450,
            Other: 26,
        },
        "Congenital Heart Diseases": {
            Male: 150,
            Female: 160,
            Other: 11,
        },
        "Epilepsy": {
            Male: 170,
            Female: 150,
            Other: 13,
        },
        "Type 1 Diabetes Mellitus": {
            Male: 80,
            Female: 90,
            Other: 5,
        },
        "Thalassemia and iron deficiency anemia": {
            Male: 40,
            Female: 50,
            Other: 2,
        },
        "Nephrotic Syndrome": {
            Male: 20,
            Female: 30,
            Other: 1,
        },
    };
    return (
        <div>
            <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
                Pediatric NCD Lifetime Stats
            </h3>
            <div className="grid grid-cols-5  lg:grid-cols-5 gap-16 lg:space-x-0 mb-12">

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
                    title={"Patients admitted in UHC"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "42,100"
                    }
                />
                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={2}
                    title={"Patients at Emergency Dept"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "42,100"
                    }
                />
                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={2}
                    title={"Patients Referred to UHC"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "25"
                    }
                />
                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={2}
                    title={"Patients with follow-up visits"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "25"
                    }
                />
            </div>
            <br />
            <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
                Aggregated NCD Stats
            </h3>
            <div className="relative min-h-[1000px] w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20 hover:border-primary-400  hover:shadow-xl">
                <div className="grid grid-cols-1  lg:grid-cols-3 gap-16 lg:space-x-0 lg:space-y-0 px-24">
                    Filters for the section
                </div>



                <div className="grid grid-cols-2  lg:grid-cols-3 gap-16 lg:space-x-0 lg:space-y-0 px-24">
                    <div className="h-[320px] w-full  rounded-lg relative col-span-2 lg:col-span-2">
                        <p className="text-xl font-semibold mb-8 ">Age Distribution of patients</p>
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
                    <div className="h-[320px] w-full  rounded-lg relative col-span-2 lg:col-span-1">
                        <p className="text-xl font-semibold mb-8">Gender distribution of patients</p>
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

                </div>

                <br />
                <br />
                <div className="grid grid-cols-1  lg:grid-cols-3 gap-16 lg:space-x-0 lg:space-y-12 px-24">
                    <div className="h-[400px] w-full  rounded-lg relative col-span-2">
                        <p className="text-xl font-semibold mb-8">NCD Distribution by Facility</p>
                        <ResponsiveBar
                            data={data}
                            keys={keys}
                            indexBy="facility"
                            margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                            padding={0.3}
                            groupMode="stacked"
                            valueScale={{ type: 'linear' }}
                            indexScale={{ type: 'band', round: true }}
                            colors={{ scheme: 'paired' }}
                            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: -45,
                                legend: 'Facility',
                                legendPosition: 'middle',
                                legendOffset: 70,
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Number of Patients',
                                legendPosition: 'middle',
                                legendOffset: -50,
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                            legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 120,
                                    translateY: -50,
                                    itemsSpacing: 2,
                                    itemWidth: 200,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 0.85,
                                    symbolSize: 20,
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemOpacity: 1,
                                            },
                                        },
                                    ],
                                },
                            ]}
                            role="application"
                            ariaLabel="Disease distribution per facility"
                            barAriaLabel={(e) =>
                                `${e.id}: ${e.formattedValue} patients at ${e.indexValue}`
                            }
                        />
                    </div>
                    <div>
                        <p className="text-xl font-semibold mb-8">Referrals & Follow up</p>
                        <div className="grid grid-cols-1  lg:grid-cols-1 gap-16 px-24 lg:space-x-0 lg:space-y-0">
                            <CardIndicators
                                {...NCDashboardCardCommonProps}
                                key={0}
                                title={"Referred to UHC"}
                                iconName="bar-chart-square-plus"
                                className='col-span-2 lg:col-span-1'
                                subTitle={
                                    "219"
                                }
                            />
                            <CardIndicators
                                {...NCDashboardCardCommonProps}
                                key={0}
                                title={"Patient Follow ups"}
                                iconName="bar-chart-square-plus"
                                className='col-span-2 lg:col-span-1'
                                subTitle={
                                    "1000"
                                }
                            />
                        </div>
                    </div>
                    <div>


                    </div>
                </div>
            </div>
            <br />
            <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
                Disease wise Stats
            </h3>
            <div className="relative min-h-[1200px] w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20 hover:border-primary-400  hover:shadow-xl">
                <div className="grid grid-cols-1  lg:grid-cols-3 gap-16 lg:space-x-0 lg:space-y-0 px-24">
                    Filters for the section
                </div>

                {/* <br />
                <div className="grid grid-cols-3  lg:grid-cols-3 gap-16 lg:space-x-0 lg:space-y-0 px-24">
                    <div className="h-[800px] w-full  rounded-lg relative col-span-3 lg:col-span-3">
                    <p className="text-xl font-semibold mb-8">Diseasewise Gemder Distributions</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {Object.entries(diseaseGenderData).map(([diseaseName, genderCounts]) => (
                                <DiseaseGenderPieChart
                                    key={diseaseName}
                                    diseaseName={diseaseName}
                                    genderCounts={genderCounts}
                                />
                            ))}
                        </div>
                    </div>
                </div> */}
                <div className="grid grid-cols-1  lg:grid-cols-3 gap-16 lg:space-x-0 lg:space-y-0 px-24">
                    <div className="h-[400px] w-full rounded-lg relative col-span-1 lg:col-span-3">
                        <p className="text-xl font-semibold mb-8">Pediatric Disease Distribution</p>
                        <ResponsivePie
                            data={[
                                {
                                    "id": "Bronchial Asthma",
                                    "label": "Bronchial Asthma",
                                    "value": 20,
                                    "color": "hsl(214, 70%, 50%)"
                                },
                                {
                                    "id": "Congenital Heart Diseases",
                                    "label": "Congenital Heart Diseases",
                                    "value": 20,
                                    "color": "hsl(355, 70%, 50%)"
                                },
                                {
                                    "id": "Epilepsy",
                                    "label": "Epilepsy",
                                    "value": 10,
                                    "color": "hsl(230, 70%, 50%)"
                                },
                                {
                                    "id": "Type 1 Diabetes Mellitus",
                                    "label": "Type 1 Diabetes Mellitus",
                                    "value": 10,
                                    "color": "hsl(230, 70%, 50%)"
                                },
                                {
                                    "id": "Thalassemia and iron deficiency anemia",
                                    "label": "Thalassemia and iron deficiency anemia",
                                    "value": 20,
                                    "color": "hsl(230, 70%, 50%)"
                                },
                                {
                                    "id": "Nephrotic Syndrome",
                                    "label": "Nephrotic Syndrome",
                                    "value": 20,
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
                                        id: 'Bronchial Asthma'
                                    },
                                    id: 'dots'
                                },
                                {
                                    match: {
                                        id: 'Congenital Heart Diseases'
                                    },
                                    id: 'lines'
                                },
                                {
                                    match: {
                                        id: 'Epilepsy'
                                    },
                                    id: 'lines'
                                },
                                {
                                    match: {
                                        id: 'Type 1 Diabetes Mellitus'
                                    },
                                    id: 'lines'
                                },
                                {
                                    match: {
                                        id: 'Thalassemia and iron deficiency anemia'
                                    },
                                    id: 'lines'
                                },
                                {
                                    match: {
                                        id: 'Nephrotic Syndrome'
                                    },
                                    id: 'lines'
                                },
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
                </div>
                <div className="h-[500px] w-full  rounded-lg relative col-span-1 lg:col-span-3">
                    <p className="text-xl font-semibold mb-8 ">Genderwise Disease Stats</p>
                    <ResponsiveBar
                        data={diseaseStats}
                        keys={['Male', 'Female', 'Other']}
                        indexBy="disease"
                        margin={{ top: 50, right: 130, bottom: 150, left: 60 }}
                        padding={0.3}
                        groupMode="stacked"
                        valueScale={{ type: 'linear' }}
                        indexScale={{ type: 'band', round: true }}
                        colors={{ scheme: 'paired' }}
                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: -45,
                            legend: 'Disease',
                            legendPosition: 'middle',
                            legendOffset: 100,
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Number of Patients',
                            legendPosition: 'middle',
                            legendOffset: -50,
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        legends={[
                            {
                                dataFrom: 'keys',
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 120,
                                translateY: -50,
                                itemsSpacing: 2,
                                itemWidth: 100,
                                itemHeight: 20,
                                itemDirection: 'left-to-right',
                                itemOpacity: 0.85,
                                symbolSize: 20,
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemOpacity: 1,
                                        },
                                    },
                                ],
                            },
                        ]}
                        role="application"
                        ariaLabel="Disease-wise patient distribution"
                        barAriaLabel={(e) =>
                            `${e.id}: ${e.formattedValue} patients for ${e.indexValue}`
                        }
                    /></div>


            </div>

        </div>

    );
});


const DiseaseGenderPieChart = ({ diseaseName, genderCounts }: any) => {
    // Transform the genderCounts object into an array suitable for the pie chart
    const data = Object.entries(genderCounts).map(([gender, count]) => ({
        id: gender,
        label: gender,
        value: count,
    }));

    return (
        <div style={{ flex: '1 0 300px', margin: '20px' }}>
            <p className="text-lg font-semibold mb-8">{diseaseName}</p>
            <div style={{ height: '300px' }}>
                <ResponsivePie
                    data={data}
                    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: 'paired' }}
                    borderWidth={1}
                    borderColor={{
                        from: 'color',
                        modifiers: [['darker', 0.2]],
                    }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                        from: 'color',
                        modifiers: [['darker', 2]],
                    }}
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            translateY: 40,
                            itemWidth: 80,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            symbolSize: 18,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </div>
        </div>
    );
};
