"use client";
import { defaultBarLegend, defaultBottomAxisProps, defaultLeftAxisProps, defaultOtherProps } from "@charts/BarChart/BarChartDefaultProps";
import TooltipBarChart, { TooltipBarChartProps } from "@components/charts/BarChart/TooltipBarChart";
import { ChartThemeDef } from "@components/charts/ChartThemeDef";
import ChartTitle from "@components/charts/ChartTitle";
import DonutChartMCI from "@components/charts/DonutChart/DonutChartMCI";
import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";
import { MCISpinner } from "@components/MCISpinner";
import TablePagyCustom from "@components/table/TablePagyCustom";
import { AxisProps } from "@nivo/axes";
import { BarLegendProps } from "@nivo/bar";
import { Datum, LegendProps } from "@nivo/legends";
import { ResponsiveLine, Serie } from "@nivo/line";
import { tokens } from "@utils/ThemeToken";
import { timeFormat } from "d3-time-format";
import { MRT_ExpandedState } from "material-react-table";
import dynamic from "next/dynamic";
import { memo, Suspense, useMemo, useState } from "react";
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

interface NcdPublicDashboardProps {

}




const tooltipProps = (item: any): TooltipBarChartProps => {
    return {
        line1Label: "Age Groups: ",
        line1Value: item.indexValue,
        line2Label: "Count:",
        line2Value: item.value,
    };
};



export default memo(function NcdDbClientWrapper({
}: NcdPublicDashboardProps) {


    const barChartkeys = [
        "Bronchial Asthma",
        "Congenital Heart Diseases",
        "Epilepsy",
        "Type 1 Diabetes Mellitus",
        "Thalassemia and iron deficiency anemia",
        "Nephrotic Syndrome",
    ];

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
        <div>
            <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
                Pediatric NCD Lifetime Stats
            </h3>
            <div className="grid grid-cols-5  lg:grid-cols-5 gap-16 lg:space-x-0 mb-12">

                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={10}
                    title={"Total NCD patients"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "42,100"
                    }
                />
                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={11}
                    title={"Patients admitted in UHC"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "42,100"
                    }
                />
                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={111}
                    title={"Patients at Emergency Dept"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "42,100"
                    }
                />
                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={1112}
                    title={"Patients Referred to UHC"}
                    iconName="bar-chart-square-plus"
                    className='col-span-2 lg:col-span-1'
                    subTitle={
                        "25"
                    }
                />
                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={11112}
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
            <div className="relative h-full w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20 hover:border-primary-400  hover:shadow-xl">
                <div className="grid grid-cols-1  lg:grid-cols-3 gap-16 lg:space-x-0 lg:space-y-0 px-24">
                    Filters for the section (Filter by Date Range & Facility)
                </div>



                <div className="grid grid-cols-2  lg:grid-cols-4 gap-16 lg:space-x-0 px-24 align-middle">
                    <div className="h-[400px] w-full rounded-lg col-span-2 lg:col-span-2">
                        <Suspense fallback={<MCISpinner />}>
                            <BarChartMCI
                                chartTitle="Disease by Age Group"
                                originalData={[
                                    {
                                        "ageRange": "0-5",
                                        "Bronchial Asthma": 100,
                                        "Congenital Heart Diseases": 50,
                                        "Epilepsy": 5000,
                                        "Type 1 Diabetes Mellitus": 20,
                                        "Thalassemia and iron deficiency anemia": 10,
                                        "Nephrotic Syndrome": 5,
                                    },
                                    {
                                        "ageRange": "6-9",
                                        "Bronchial Asthma": 150,
                                        "Congenital Heart Diseases": 100,
                                        "Epilepsy": 60,
                                        "Type 1 Diabetes Mellitus": 30,
                                        "Thalassemia and iron deficiency anemia": 15,
                                        "Nephrotic Syndrome": 10,
                                    },
                                    {
                                        "ageRange": "10-14",
                                        "Bronchial Asthma": 200,
                                        "Congenital Heart Diseases": 150,
                                        "Epilepsy": 100,
                                        "Type 1 Diabetes Mellitus": 50,
                                        "Thalassemia and iron deficiency anemia": 30,
                                        "Nephrotic Syndrome": 20,
                                    },
                                    {
                                        "ageRange": "14-18",
                                        "Bronchial Asthma": 250,
                                        "Congenital Heart Diseases": 200,
                                        "Epilepsy": 150,
                                        "Type 1 Diabetes Mellitus": 80,
                                        "Thalassemia and iron deficiency anemia": 40,
                                        "Nephrotic Syndrome": 20,
                                    },
                                ]}
                                indexBy="ageRange"
                                groupModeState="stacked"
                                keys={barChartkeys}
                                // colors={(bar: any) => String(bar.data.color)}
                                axisLeft={{
                                    ...leftAxisProps,
                                }}
                                axisBottom={bottomAxisProps}
                                legend={[...barLegendProps]}
                                otherProps={{
                                    ...otherPropVals,
                                    layout: "vertical",
                                    margin: { top: 100, right: 250, bottom: 50, left: 60 },
                                }}
                                {...ChartThemeDef({
                                    colors: colorsTheme,
                                })}
                                onClicked={(barEvent: any) => {
                                    console.log("Event Fired");

                                }}
                            />
                        </Suspense>
                    </div>
                    <div className="h-full w-full  rounded-lg col-span-2 lg:col-span-2">
                        <Suspense fallback={<MCISpinner />}>
                            <DonutChartMCI data={[
                                {
                                    "id": "Male",
                                    "label": "Male",
                                    "value": 468,
                                    "color": "hsl(123 100% 29%)"
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
                            ]} chartTitle="Gender Distribution"
                                colorScheme="nivo"
                            />
                        </Suspense>
                    </div>

                    <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">
                        <div className="h-full w-full rounded-lg md:mt-24 md:pl-24">
                            <FacilityWiseAggregatedNCDRegistrationData key={'3231233'} />
                        </div>
                    </div>
                    <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">
                        <div className="h-full w-full rounded-lg md:mt-24 md:pl-24">
                            <FacilityWiseAggregatedReferralFollowupData key={'3233'} />
                        </div>
                    </div>
                    <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">
                        <div className="h-[800px] w-full rounded-lg md:mt-24 md:pl-2">
                            {/* <Button clicked={() => setShowLineChart((_prev: boolean) => !_prev)} variant="primary" size="lg" /> */}
                            <Suspense fallback={<MCISpinner />}>
                                <NCDLineGraph />
                            </Suspense>
                        </div>
                    </div>
                    <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">
                        <div className="h-full w-full rounded-lg md:mt-24 md:pl-24">
                            <Suspense fallback={<MCISpinner />}>
                                <DonutChartMCI key={'323'} data={[
                                    {
                                        "id": "IPD",
                                        "label": "IPD",
                                        "value": 200,
                                    },
                                    {
                                        "id": "OPD",
                                        "label": "OPD",
                                        "value": 600,
                                    },
                                    {
                                        "id": "Emergency",
                                        "label": "Emergency",
                                        "value": 70,
                                    },
                                ]} chartTitle="Service Location Overview"
                                    colorScheme="red_yellow_green"
                                    showTotalCount={true}
                                />
                            </Suspense>
                        </div>
                    </div>


                </div>

            </div>
            <br />
            <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
                Disease Focused Analytics
            </h3>
            <div className="relative h-full w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20 hover:border-primary-400  hover:shadow-xl">
                <div className="grid grid-cols-1  lg:grid-cols-3 gap-16 lg:space-x-0 lg:space-y-0 px-24">
                    Filters for the section (By Disease & Date Range)
                </div>
                <div className="grid grid-cols-2  lg:grid-cols-4 gap-16 lg:space-x-0 px-24 align-middle">
                    <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">
                        <div className="h-full w-full rounded-lg md:mt-24 md:pl-24">
                            <div className="h-[500px] w-full rounded-lg col-span-2 lg:col-span-2">
                                <Suspense fallback={<MCISpinner />}>
                                    <BarChartMCI
                                        chartTitle="Bronchial Asthma by Age Group"
                                        originalData={[
                                            {
                                                "ageRange": "0-3",
                                                "Bronchial Asthma": 100
                                            },
                                            {
                                                "ageRange": "4-6",
                                                "Bronchial Asthma": 150
                                            },
                                            {
                                                "ageRange": "7-10",
                                                "Bronchial Asthma": 200
                                            },
                                            {
                                                "ageRange": "11-14",
                                                "Bronchial Asthma": 250
                                            },
                                            {
                                                "ageRange": "15-18",
                                                "Bronchial Asthma": 150
                                            },
                                        ]}
                                        indexBy="ageRange"
                                        groupModeState="stacked"
                                        keys={['Bronchial Asthma']}
                                        // colors={(bar: any) => String(bar.data.color)}
                                        axisLeft={{
                                            ...leftAxisProps,
                                        }}
                                        axisBottom={bottomAxisProps}
                                        legend={[...barLegendProps]}
                                        otherProps={{
                                            ...otherPropVals,
                                            layout: "vertical",
                                            itemWidth: 200,
                                            margin: { top: 100, right: 250, bottom: 100, left: 60 },
                                        }}
                                        {...ChartThemeDef({
                                            colors: colorsTheme,
                                        })}
                                        colors={{ scheme: "purpleRed_green" }}
                                        onClicked={(barEvent: any) => {
                                            console.log("Event Fired");

                                        }}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                    <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">
                        <div className="h-full w-full rounded-lg md:mt-24 md:pl-24">
                            <Suspense fallback={<MCISpinner />}>
                                <DonutChartMCI key={'323'} data={[
                                    {
                                        "id": "IPD",
                                        "label": "IPD",
                                        "value": 200,
                                    },
                                    {
                                        "id": "OPD",
                                        "label": "OPD",
                                        "value": 600,
                                    },
                                    {
                                        "id": "Emergency",
                                        "label": "Emergency",
                                        "value": 70,
                                    },
                                ]} chartTitle="Bronchial Asthma Service Location"
                                    colorScheme="red_yellow_green"
                                    showTotalCount={true}
                                />
                            </Suspense>
                        </div>
                    </div>
                    <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">
                        <div className="h-full w-full rounded-lg md:mt-24 md:pl-24">
                            <div className="h-[500px] w-full rounded-lg col-span-2 lg:col-span-2">
                                <Suspense fallback={<MCISpinner />}>
                                    <BarChartMCI
                                        chartTitle="Bronchial Asthma by Division"
                                        originalData={[
                                            {
                                                "ageRange": "Dhaka",
                                                "Bronchial Asthma": 100
                                            },
                                            {
                                                "ageRange": "Chittagong",
                                                "Bronchial Asthma": 150
                                            },
                                            {
                                                "ageRange": "Khulna",
                                                "Bronchial Asthma": 200
                                            },
                                            {
                                                "ageRange": "Sylhet",
                                                "Bronchial Asthma": 250
                                            },
                                            {
                                                "ageRange": "Rajshahi",
                                                "Bronchial Asthma": 150
                                            },
                                            {
                                                "ageRange": "Barisal",
                                                "Bronchial Asthma": 150
                                            },
                                            {
                                                "ageRange": "Mymensingh",
                                                "Bronchial Asthma": 150
                                            },
                                        ]}
                                        indexBy="ageRange"
                                        groupModeState="stacked"
                                        keys={['Bronchial Asthma']}
                                        // colors={(bar: any) => String(bar.data.color)}
                                        axisLeft={{
                                            ...leftAxisProps,
                                        }}
                                        axisBottom={bottomAxisProps}
                                        legend={[...barLegendProps]}
                                        otherProps={{
                                            ...otherPropVals,
                                            layout: "vertical",
                                            itemWidth: 200,
                                            margin: { top: 100, right: 250, bottom: 100, left: 60 },
                                        }}
                                        {...ChartThemeDef({
                                            colors: colorsTheme,
                                        })}
                                        colors={{ scheme: "purpleRed_green" }}
                                        onClicked={(barEvent: any) => {
                                            console.log("Event Fired");

                                        }}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                    <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">
                        <div className="h-full w-full rounded-lg md:mt-24 md:pl-24">
                            <FacilityWiseAggregatedNCDRegistrationData key={'3231233'} title="Bronchial Asthma  Facilitywise Stats" />
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
});


const FacilityWiseAggregatedNCDRegistrationData = ({ title = "Facility wise NCD Registrations" }) => {
    //Table
    const [tableExpanded, setTableExpanded] = useState<MRT_ExpandedState>({});
    return (
        <>
            <ChartTitle
                title={title}
                // size="lg"
                align="left"
                classNames="mb-12 text-slate-600 text-sm uppercase"
            />
            <Suspense fallback={<MCISpinner />}>
                <TablePagyCustom
                    key={1231231}
                    expandAggregated={tableExpanded}
                    // grouping={[]}
                    grouping={[]}
                    groupingChange={(e: any) => []}
                    density="compact"
                    enablePagination={false}
                    rawData={[
                        { "id": 2, "facility_name": "Aalo Clinic,Karail", "district_name": "Dhaka", "reg_count": "63" }, { "id": 9, "facility_name": "National Asthma Center", "district_name": "Dhaka", "reg_count": "158" }, { "id": 22, "facility_name": "Kanaipur Union Health Sub Center", "district_name": "Faridpur", "reg_count": "1" }, { "id": 39, "facility_name": "Nandina Union Health Sub Center", "district_name": "Jamalpur", "reg_count": "14" }]}

                    // rawData={[{ "id": 1, "division_name": "Barisal", "district_name": "Barisal (Aggregated total)", "reg_count": 245 }, { "id": 2, "division_name": "Barisal", "district_name": "Barguna", "reg_count": "63" }, { "id": 3, "division_name": "Barisal", "district_name": "Barisal", "reg_count": "165" }, { "id": 4, "division_name": "Barisal", "district_name": "Bhola", "reg_count": "1" }, { "id": 5, "division_name": "Barisal", "district_name": "Jhalokati", "reg_count": "13" }, { "id": 6, "division_name": "Barisal", "district_name": "Patuakhali", "reg_count": "1" }, { "id": 7, "division_name": "Barisal", "district_name": "Pirojpur", "reg_count": "2" }, { "id": 8, "division_name": "Chittagong", "district_name": "Chittagong (Aggregated total)", "reg_count": 297 }, { "id": 9, "division_name": "Chittagong", "district_name": "Bandarban", "reg_count": "158" }, { "id": 10, "division_name": "Chittagong", "district_name": "Brahamanbaria", "reg_count": "0" }, { "id": 11, "division_name": "Chittagong", "district_name": "Chandpur", "reg_count": "2" }, { "id": 12, "division_name": "Chittagong", "district_name": "Chittagong", "reg_count": "19" }, { "id": 13, "division_name": "Chittagong", "district_name": "Comilla", "reg_count": "82" }, { "id": 14, "division_name": "Chittagong", "district_name": "Cox'S Bazar", "reg_count": "27" }, { "id": 15, "division_name": "Chittagong", "district_name": "Feni", "reg_count": "1" }, { "id": 16, "division_name": "Chittagong", "district_name": "Khagrachhari", "reg_count": "8" }, { "id": 17, "division_name": "Chittagong", "district_name": "Lakshmipur", "reg_count": "0" }, { "id": 18, "division_name": "Chittagong", "district_name": "Noakhali", "reg_count": "0" }, { "id": 19, "division_name": "Chittagong", "district_name": "Rangamati", "reg_count": "0" }, { "id": 20, "division_name": "Dhaka", "district_name": "Dhaka (Aggregated total)", "reg_count": 588 }, { "id": 21, "division_name": "Dhaka", "district_name": "Dhaka", "reg_count": "444" }, { "id": 22, "division_name": "Dhaka", "district_name": "Faridpur", "reg_count": "1" }, { "id": 23, "division_name": "Dhaka", "district_name": "Gazipur", "reg_count": "59" }, { "id": 24, "division_name": "Dhaka", "district_name": "Gopalganj", "reg_count": "4" }, { "id": 25, "division_name": "Dhaka", "district_name": "Jamalpur", "reg_count": "0" }, { "id": 26, "division_name": "Dhaka", "district_name": "Kishoreganj", "reg_count": "0" }, { "id": 27, "division_name": "Dhaka", "district_name": "Madaripur", "reg_count": "0" }, { "id": 28, "division_name": "Dhaka", "district_name": "Manikganj", "reg_count": "1" }, { "id": 29, "division_name": "Dhaka", "district_name": "Munshiganj", "reg_count": "7" }, { "id": 30, "division_name": "Dhaka", "district_name": "Mymensingh", "reg_count": "0" }, { "id": 31, "division_name": "Dhaka", "district_name": "Narayanganj", "reg_count": "71" }, { "id": 32, "division_name": "Dhaka", "district_name": "Narsingdi", "reg_count": "0" }, { "id": 33, "division_name": "Dhaka", "district_name": "Netrakona", "reg_count": "0" }, { "id": 34, "division_name": "Dhaka", "district_name": "Rajbari", "reg_count": "0" }, { "id": 35, "division_name": "Dhaka", "district_name": "Shariatpur", "reg_count": "0" }, { "id": 36, "division_name": "Dhaka", "district_name": "Sherpur", "reg_count": "0" }, { "id": 37, "division_name": "Dhaka", "district_name": "Tangail", "reg_count": "1" }, { "id": 38, "division_name": "Khulna", "district_name": "Khulna (Aggregated total)", "reg_count": 76 }, { "id": 39, "division_name": "Khulna", "district_name": "Bagerhat", "reg_count": "14" }, { "id": 40, "division_name": "Khulna", "district_name": "Chuadanga", "reg_count": "0" }, { "id": 41, "division_name": "Khulna", "district_name": "Jessore", "reg_count": "1" }]}
                    setExpandedAggregatedState={(e: MRT_ExpandedState) => {
                        setTableExpanded(e);
                    }}
                    columnHeadersLabel={
                        [
                            {
                                accessorKey: "facility_name",
                                header: "Facility Name",
                                maxSize: 400,
                                enableResizing: true,
                                // GroupedCell: ({ row }) => {
                                //     console.log("The row");
                                //     console.log(row);
                                //     return row ? <AggregatedCell row={row} /> : <> </>;
                                // },
                            },
                            {
                                accessorKey: "district_name",
                                header: "District",
                                maxSize: 200,
                                enableResizing: true,
                            },
                            {
                                accessorKey: "reg_count",
                                header: "NCD Encounter",
                                maxSize: 200,
                                enableResizing: true,
                            },
                        ]
                        //     [
                        //     {
                        //         accessorKey: "division_name",
                        //         header: "Division",
                        //         maxSize: 180,
                        //         enableResizing: true,
                        //         GroupedCell: ({ row }) => {
                        //             console.log("The row");
                        //             console.log(row);
                        //             return row ? <AggregatedCell row={row} /> : <> </>;
                        //         },
                        //     },
                        //     {
                        //         accessorKey: "district_name",
                        //         header: "District",
                        //         maxSize: 400,
                        //         enableResizing: true,
                        //     },
                        //     {
                        //         accessorKey: "reg_count",
                        //         header: "Total Registrations",
                        //         maxSize: 200,
                        //         enableResizing: true,
                        //     },
                        // ]
                    }
                />
            </Suspense> </>)
}



const FacilityWiseAggregatedReferralFollowupData = () => {
    //Table
    const [tableExpanded, setTableExpanded] = useState<MRT_ExpandedState>({});
    return (
        <>
            <ChartTitle
                title={"Facility wise Referrals & Follow ups"}
                // size="lg"
                align="left"
                classNames="mb-12 text-slate-600 text-sm uppercase"
            />
            <Suspense fallback={<MCISpinner />}>
                <TablePagyCustom
                    key={232323}
                    expandAggregated={tableExpanded}
                    // grouping={[]}
                    grouping={[]}
                    groupingChange={(e: any) => []}
                    density="compact"
                    enablePagination={false}
                    rawData={[
                        {
                            "id": 2,
                            "facility_name": "Aalo Clinic,Karail",
                            "district_name": "Dhaka",
                            "referral_count": "63",
                            "fwup_count": "63"
                        },
                        {
                            "id": 9,
                            "facility_name": "National Asthma Center",
                            "district_name": "Dhaka",
                            "referral_count": "158",
                            "fwup_count": "158"
                        },
                        {
                            "id": 22,
                            "facility_name": "Kanaipur Union Health Sub Center",
                            "district_name": "Faridpur",
                            "referral_count": "1",
                            "fwup_count": "1"
                        },
                        {
                            "id": 39,
                            "facility_name": "Nandina Union Health Sub Center",
                            "district_name": "Jamalpur",
                            "referral_count": "14",
                            "fwup_count": "14"
                        }
                    ]}

                    // rawData={[{ "id": 1, "division_name": "Barisal", "district_name": "Barisal (Aggregated total)", "reg_count": 245 }, { "id": 2, "division_name": "Barisal", "district_name": "Barguna", "reg_count": "63" }, { "id": 3, "division_name": "Barisal", "district_name": "Barisal", "reg_count": "165" }, { "id": 4, "division_name": "Barisal", "district_name": "Bhola", "reg_count": "1" }, { "id": 5, "division_name": "Barisal", "district_name": "Jhalokati", "reg_count": "13" }, { "id": 6, "division_name": "Barisal", "district_name": "Patuakhali", "reg_count": "1" }, { "id": 7, "division_name": "Barisal", "district_name": "Pirojpur", "reg_count": "2" }, { "id": 8, "division_name": "Chittagong", "district_name": "Chittagong (Aggregated total)", "reg_count": 297 }, { "id": 9, "division_name": "Chittagong", "district_name": "Bandarban", "reg_count": "158" }, { "id": 10, "division_name": "Chittagong", "district_name": "Brahamanbaria", "reg_count": "0" }, { "id": 11, "division_name": "Chittagong", "district_name": "Chandpur", "reg_count": "2" }, { "id": 12, "division_name": "Chittagong", "district_name": "Chittagong", "reg_count": "19" }, { "id": 13, "division_name": "Chittagong", "district_name": "Comilla", "reg_count": "82" }, { "id": 14, "division_name": "Chittagong", "district_name": "Cox'S Bazar", "reg_count": "27" }, { "id": 15, "division_name": "Chittagong", "district_name": "Feni", "reg_count": "1" }, { "id": 16, "division_name": "Chittagong", "district_name": "Khagrachhari", "reg_count": "8" }, { "id": 17, "division_name": "Chittagong", "district_name": "Lakshmipur", "reg_count": "0" }, { "id": 18, "division_name": "Chittagong", "district_name": "Noakhali", "reg_count": "0" }, { "id": 19, "division_name": "Chittagong", "district_name": "Rangamati", "reg_count": "0" }, { "id": 20, "division_name": "Dhaka", "district_name": "Dhaka (Aggregated total)", "reg_count": 588 }, { "id": 21, "division_name": "Dhaka", "district_name": "Dhaka", "reg_count": "444" }, { "id": 22, "division_name": "Dhaka", "district_name": "Faridpur", "reg_count": "1" }, { "id": 23, "division_name": "Dhaka", "district_name": "Gazipur", "reg_count": "59" }, { "id": 24, "division_name": "Dhaka", "district_name": "Gopalganj", "reg_count": "4" }, { "id": 25, "division_name": "Dhaka", "district_name": "Jamalpur", "reg_count": "0" }, { "id": 26, "division_name": "Dhaka", "district_name": "Kishoreganj", "reg_count": "0" }, { "id": 27, "division_name": "Dhaka", "district_name": "Madaripur", "reg_count": "0" }, { "id": 28, "division_name": "Dhaka", "district_name": "Manikganj", "reg_count": "1" }, { "id": 29, "division_name": "Dhaka", "district_name": "Munshiganj", "reg_count": "7" }, { "id": 30, "division_name": "Dhaka", "district_name": "Mymensingh", "reg_count": "0" }, { "id": 31, "division_name": "Dhaka", "district_name": "Narayanganj", "reg_count": "71" }, { "id": 32, "division_name": "Dhaka", "district_name": "Narsingdi", "reg_count": "0" }, { "id": 33, "division_name": "Dhaka", "district_name": "Netrakona", "reg_count": "0" }, { "id": 34, "division_name": "Dhaka", "district_name": "Rajbari", "reg_count": "0" }, { "id": 35, "division_name": "Dhaka", "district_name": "Shariatpur", "reg_count": "0" }, { "id": 36, "division_name": "Dhaka", "district_name": "Sherpur", "reg_count": "0" }, { "id": 37, "division_name": "Dhaka", "district_name": "Tangail", "reg_count": "1" }, { "id": 38, "division_name": "Khulna", "district_name": "Khulna (Aggregated total)", "reg_count": 76 }, { "id": 39, "division_name": "Khulna", "district_name": "Bagerhat", "reg_count": "14" }, { "id": 40, "division_name": "Khulna", "district_name": "Chuadanga", "reg_count": "0" }, { "id": 41, "division_name": "Khulna", "district_name": "Jessore", "reg_count": "1" }]}
                    setExpandedAggregatedState={(e: MRT_ExpandedState) => {
                        setTableExpanded(e);
                    }}
                    columnHeadersLabel={
                        [
                            {
                                accessorKey: "facility_name",
                                header: "Facility Name",
                                maxSize: 300,
                                enableResizing: true,
                                // GroupedCell: ({ row }) => {
                                //     console.log("The row");
                                //     console.log(row);
                                //     return row ? <AggregatedCell row={row} /> : <> </>;
                                // },
                            },
                            {
                                accessorKey: "district_name",
                                header: "District",
                                maxSize: 150,
                                enableResizing: true,
                            },
                            {
                                accessorKey: "referral_count",
                                header: "Referral Count",
                                maxSize: 150,
                                enableResizing: true,
                            },
                            {
                                accessorKey: "fwup_count",
                                header: "Follow-up Count",
                                maxSize: 150,
                                enableResizing: true,
                            },
                        ]
                        //     [
                        //     {
                        //         accessorKey: "division_name",
                        //         header: "Division",
                        //         maxSize: 180,
                        //         enableResizing: true,
                        //         GroupedCell: ({ row }) => {
                        //             console.log("The row");
                        //             console.log(row);
                        //             return row ? <AggregatedCell row={row} /> : <> </>;
                        //         },
                        //     },
                        //     {
                        //         accessorKey: "district_name",
                        //         header: "District",
                        //         maxSize: 400,
                        //         enableResizing: true,
                        //     },
                        //     {
                        //         accessorKey: "reg_count",
                        //         header: "Total Registrations",
                        //         maxSize: 200,
                        //         enableResizing: true,
                        //     },
                        // ]
                    }
                />
            </Suspense> </>)
}

const AggregatedCell = memo(function AggregatedCell({ row }: any) {
    const aggregatedDataRow: any[] = row.subRows;
    let total = 0;
    if (aggregatedDataRow) {
        aggregatedDataRow.forEach((item: any) => {
            total += item.original.reg_count;
        });
        total = aggregatedDataRow.length
            ? aggregatedDataRow[0].original?.reg_count?.toLocaleString()
            : 0;
    }
    return (
        <div>
            <b>{row.original["district_name"]}</b>
            <br />
            Registrations: ({total.toLocaleString()})
        </div>
    );
});


function NCDLineGraph() {

    const timeSeriesData: Serie[] = [
        {
            "id": "Bronchial Asthma",
            "color": "hsl(200, 70%, 50%)",
            "hidden": false,
            "data": [
                { "x": "2024-03-31", "y": 200 },
                { "x": "2024-04-01", "y": 120 },
                { "x": "2024-04-02", "y": 530 },
                { "x": "2024-04-03", "y": 450 },
                { "x": "2024-04-04", "y": 380 },
                { "x": "2024-04-05", "y": 310 },
                { "x": "2024-04-06", "y": 490 },
                { "x": "2024-04-07", "y": 270 },
                { "x": "2024-04-08", "y": 220 },
                { "x": "2024-04-09", "y": 360 }
            ]
        },
        {
            "id": "Congenital Heart Diseases",
            "color": "hsl(200, 70%, 50%)",
            "hidden": false,
            "data": [
                { "x": "2024-03-31", "y": 100 },
                { "x": "2024-04-01", "y": 420 },
                { "x": "2024-04-02", "y": 130 },
                { "x": "2024-04-03", "y": 210 },
                { "x": "2024-04-04", "y": 340 },
                { "x": "2024-04-05", "y": 180 },
                { "x": "2024-04-06", "y": 300 },
                { "x": "2024-04-07", "y": 410 },
                { "x": "2024-04-08", "y": 270 },
                { "x": "2024-04-09", "y": 320 }
            ]
        },
        {
            "id": "Epilepsy",
            "color": "hsl(200, 70%, 50%)",
            "hidden": false,
            "data": [
                { "x": "2024-03-31", "y": 300 },
                { "x": "2024-04-01", "y": 20 },
                { "x": "2024-04-02", "y": 320 },
                { "x": "2024-04-03", "y": 100 },
                { "x": "2024-04-04", "y": 150 },
                { "x": "2024-04-05", "y": 400 },
                { "x": "2024-04-06", "y": 230 },
                { "x": "2024-04-07", "y": 350 },
                { "x": "2024-04-08", "y": 180 },
                { "x": "2024-04-09", "y": 260 }
            ]
        },
        {
            "id": "Type 1 Diabetes Mellitus",
            "color": "hsl(200, 70%, 50%)",
            "hidden": false,
            "data": [
                { "x": "2024-03-31", "y": 400 },
                { "x": "2024-04-01", "y": 220 },
                { "x": "2024-04-02", "y": 320 },
                { "x": "2024-04-03", "y": 290 },
                { "x": "2024-04-04", "y": 370 },
                { "x": "2024-04-05", "y": 440 },
                { "x": "2024-04-06", "y": 310 },
                { "x": "2024-04-07", "y": 250 },
                { "x": "2024-04-08", "y": 390 },
                { "x": "2024-04-09", "y": 350 }
            ]
        },
        {
            "id": "Thalassemia and iron deficiency anemia",
            "color": "hsl(200, 70%, 50%)",
            "hidden": false,
            "data": [
                { "x": "2024-03-31", "y": 200 },
                { "x": "2024-04-01", "y": 140 },
                { "x": "2024-04-02", "y": 155 },
                { "x": "2024-04-03", "y": 180 },
                { "x": "2024-04-04", "y": 130 },
                { "x": "2024-04-05", "y": 170 },
                { "x": "2024-04-06", "y": 220 },
                { "x": "2024-04-07", "y": 200 },
                { "x": "2024-04-08", "y": 140 },
                { "x": "2024-04-09", "y": 190 }
            ]
        },
        {
            "id": "Nephrotic Syndrome",
            "color": "hsl(200, 70%, 50%)",
            "hidden": false,
            "data": [
                { "x": "2024-03-31", "y": 36 },
                { "x": "2024-04-01", "y": 270 },
                { "x": "2024-04-02", "y": 212 },
                { "x": "2024-04-03", "y": 180 },
                { "x": "2024-04-04", "y": 250 },
                { "x": "2024-04-05", "y": 310 },
                { "x": "2024-04-06", "y": 400 },
                { "x": "2024-04-07", "y": 150 },
                { "x": "2024-04-08", "y": 220 },
                { "x": "2024-04-09", "y": 300 }
            ]
        }
    ];
    const [filteredData, setFilteredData] = useState(timeSeriesData);
    const handleLegendClick = (legend: Datum) => {

        // Toggle visibility of the clicked legend's data
        console.log("The Full data");
        console.log(filteredData);

        //Check if any legend is already hidden & if so, make it visible
        let isAnyHidden = false;
        filteredData.forEach((dataset: Serie) => {
            let data = dataset;
            if (data.hidden) {
                isAnyHidden = true;
            }
        });
        console.log("Is any hidden", isAnyHidden);
        let isFound = false;

        let considerMakingAllItemsVisible = false;
        let currentVisibleItemId: String | Number | null = null;
        if (isAnyHidden) {
            filteredData.forEach((dataset: Serie) => {
                console.log("Checking if all items should be visible");
                console.log("The legend ID", legend.id);
                console.log("The dataset ID", dataset.id);
                console.log("The dataset", dataset);
                console.log("The dataset is hidden", dataset.hidden);
                if (dataset.id === legend.id && !dataset.hidden && !considerMakingAllItemsVisible) {
                    console.log("Making all items visible");
                    considerMakingAllItemsVisible = true
                    currentVisibleItemId = dataset.id;
                }
            });
        }

        //If we are making all items visible, we need to make all items visible
        //clicking on the same legend should not hide the data
        if (considerMakingAllItemsVisible) {
            console.log("Here 0");

            if (currentVisibleItemId == legend.id) {
                console.log("Here 1");
                const updatedData = filteredData.map((dataset: Serie) => {
                    return { ...dataset, hidden: false };
                });
                setFilteredData(updatedData);
            } else {
                const updatedData = filteredData.map((dataset: Serie) => {
                    console.log("Here 2");
                    if (currentVisibleItemId == legend.id) {
                        return { ...dataset, hidden: false };
                    } else {
                        return { ...dataset, hidden: true };
                    }
                });
                setFilteredData(updatedData);
            }
        }
        else {
            console.log("Here 3");

            const updatedData = filteredData.map((dataset: Serie) => {
                console.log("The clicked legend");
                console.log(legend);
                console.log("The dataset");
                console.log(dataset);
                let data = dataset;
                console.log("Filtering, checking if any data is hidden", isAnyHidden);
                console.log("Filtering - Some items are hidden but we need to check if all items should be visible");
                if (data.id === legend.id) {
                    isFound = true;
                    return { ...data, hidden: false };
                }
                return { ...data, hidden: true };

            });

            // console.log("The updated data");
            // console.log(updatedData);
            setFilteredData(updatedData);
        }





    };
    const visibleData = filteredData.filter((dataset) => {
        if (dataset.hidden) {
            dataset.data = []
        } else {
            timeSeriesData.filter((data) => {
                if (data.id == dataset.id) {
                    dataset.data = data.data;
                }
            });
        }

        console.log("The dataset being rendered");
        console.log(dataset);
        return dataset;
    });


    const defaultBarLegend: BarLegendProps[] = [
        {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
        },
    ];

    const formatTime = timeFormat("%Y-%m-%d");
    const axisBottom: AxisProps = {
        tickSize: 4,
        tickPadding: 20,
        tickRotation: 0,
        format: (value) => formatTime(new Date(value)),
        legendOffset: 72,
        legendPosition: "middle",
    }
    const legendProps: LegendProps[] = [{
        toggleSerie: true,
        anchor: "bottom",
        direction: "column",
        justify: false,
        translateX: -160,
        translateY: 160,
        itemsSpacing: 2,
        itemDirection: "left-to-right",
        itemWidth: 300,
        itemHeight: 20,
        symbolSize: 12,
        symbolShape: "square",
        symbolBorderColor: "rgba(0, 0, 0, .15)",
        symbolBorderWidth: 1,
        // onClick: (datatum) => handleLegendClick(datatum),
        itemOpacity: 1,
        effects: [
            {
                on: "hover",
                style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                },
            },
        ],
    }]
    return (
        <>
            <ChartTitle
                title={"Datewise Disease Detection"}
                // size="lg"
                align="left"
                classNames="mb-12 text-slate-600 text-sm uppercase"
            />
            <ResponsiveLine animate
                margin={{ top: 20, right: 20, bottom: 200, left: 60 }}
                legends={legendProps}
                axisBottom={{
                    format: '%b %d',
                    legend: 'time scale',
                    legendOffset: -12,
                    tickValues: 'every 1 days'
                }}
                // axisBottom={axisBottom}
                axisLeft={{
                    legend: 'Diseasewise Count',
                    legendOffset: -40
                }}
                // curve="cardinal"
                data={visibleData}
                enablePointLabel
                enableTouchCrosshair
                //   height={400}
                //   initialHiddenIds={[
                //     'cognac'
                //   ]}
                isInteractive={true}
                pointBorderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.3
                        ]
                    ]
                }}
                pointBorderWidth={1}
                pointSize={8}
                pointSymbol={function noRefCheck() { return <></> }}
                useMesh={true}
                //   width={900}
                xFormat="time:%Y-%m-%d"
                xScale={{
                    format: '%Y-%m-%d',
                    precision: 'day',
                    type: 'time',
                    useUTC: false
                }}
                onClick={(point) => {
                    console.log("Point Clicked");
                    console.log(point);
                }}
                tooltip={({ point }) => {
                    return (
                        <div
                            className={"rounded bg-slate-100 p-12 text-primary-900 backdrop:rounded"}
                        >
                            <div className="text-base">
                                <strong className="font-bold">Disease: &nbsp;</strong>
                                {point.id.split(".")[0]}
                                <div className="capitalize">
                                    <strong className="font-bold">Count: &nbsp;</strong>
                                    {point.data.yFormatted}
                                </div>
                            </div>
                        </div>
                    )
                }}
                yScale={{
                    type: 'linear'
                }} />
        </>
    )
}