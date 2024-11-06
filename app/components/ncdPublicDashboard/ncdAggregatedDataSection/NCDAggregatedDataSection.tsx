import { MCISpinner } from "@components/MCISpinner";
import { defaultBarLegend, defaultBottomAxisProps, defaultLeftAxisProps, defaultOtherProps } from "@components/charts/BarChart/BarChartDefaultProps";
import { TooltipBarChartProps } from "@components/charts/BarChart/TooltipBarChart";
import { ChartThemeDef } from "@components/charts/ChartThemeDef";
import SearchDateRangeFilter from "@components/publicDashboard/sectionFilterSegment/SearchDateRangeFilter";
import DropDownMulti from "@library/form/DropDownMulti";
import FormItemResponseProps from "@library/form/FormItemResponseProps";
import { AxisProps } from "@nivo/axes";
import { BarLegendProps } from "@nivo/bar";
import { tokens } from "@utils/ThemeToken";
import { ncdDiseases } from "@utils/constants";
import { NCDAggregatedStatsProps } from "@utils/interfaces/NCD/NCDAggregatedStatsProps";
import dynamic from "next/dynamic";
import { memo, Suspense, useMemo } from "react";
import { cn } from "tailwind-cn";


const BarChartMCI = dynamic(
    () => import("@charts/BarChart/BarChartMCI"), {
    ssr: true,
})

const NCDLineGraph = dynamic(
    () => import("@charts/LineChart/NCDLineChart"), {
    ssr: true,
})
const DonutChartMCI = dynamic(
    () => import("@charts/DonutChart/DonutChartMCI"), {
    ssr: true,
})
const TooltipBarChart = dynamic(
    () => import("@charts/BarChart/TooltipBarChart"), {
    ssr: true,
})

const tooltipProps = (item: any): TooltipBarChartProps => {
    return {
        line1Label: "Age Groups: ",
        line1Value: item.indexValue,
        line2Label: "Count:",
        line2Value: item.value,
    };
};

export interface NCDAggregatedDataSectionProps {
    sectionData: NCDAggregatedStatsProps;
}
function  NCDAggregatedDataSection({
    sectionData
}: NCDAggregatedDataSectionProps) {
    const barChartkeys = ncdDiseases;
    console.log("NCDAggregatedDataSection");
    console.log(sectionData);
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
    return (<div className="relative h-full w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20 hover:border-primary-400  hover:shadow-xl">
        <div className="mx-auto mt-16 grid max-w-7xl gap-20 sm:grid-cols-4 lg:h-36 lg:grid-cols-3 lg:gap-40 lg:pb-20">
            <div
                className={cn(
                    "flex justify-end items-end lg:col-span-2 col-span-4"
                )}
            >
                <SearchDateRangeFilter renderContext={3} />
            </div>
            <div>
                <DropDownMulti size="sm" label="Filter by Facilities" items={[{
                    "id": 1,
                    "name": "Aalo Clinic,Karail",
                    isChecked: false
                }, {
                    "id": 2,
                    "name": "National Asthma Center",
                    isChecked: false
                }]} onChange={function (value: FormItemResponseProps): void {
                    throw new Error("Function not implemented.");
                }} />

            </div>
        </div>



        <div className="grid grid-cols-2  lg:grid-cols-4 gap-16 lg:space-x-0 px-24 align-middle">

            <div className="w-full rounded-lg col-span-4 lg:col-span-4 mt-24">
                <div className="h-[600px] w-full rounded-lg md:mt-24 md:pl-24">
                    <Suspense fallback={<MCISpinner />}>
                        <BarChartMCI
                            chartTitle="Facility wise NCD Registrations"
                            originalData={sectionData.patientCountByFacility}
                            indexBy="facilityItems"
                            groupModeState="grouped"
                            keys={barChartkeys}
                            // colors={(bar: any) => String(bar.data.color)}
                            axisLeft={{
                                ...leftAxisProps,
                                tickRotation: 0,
                            }}
                            axisBottom={{ ...bottomAxisProps, tickRotation: -25, legend: "" }}
                            legend={[...barLegendProps]}
                            otherProps={{
                                ...otherPropVals,
                                layout: "vertical",
                                margin: { top: 100, right: 250, bottom: 150, left: 60 },
                                legend: "Facility",
                                // tooltip: (point:any) => (
                                //     <TooltipBarChart {...{
                                //         line1Label: "",
                                //         line1Value: point.,
                                //         line2Label: "Count:",
                                //         line2Value: point.line2Value,
                                //     }} />
                                // ),
                            }}
                            {...ChartThemeDef({
                                colors: colorsTheme,
                            })}
                            onClicked={(barEvent: any) => {
                                console.log("Event Fired");

                            }}
                        />
                         {/* <BarChartMCI
                            chartTitle="Vendor Stats"
                            originalData={[
                                {
                                    "vendor": "Crystal Tech. Bangladesh Ltd.",
                                    "Total HIDs": 3394,
                                    "Last 3 Months HIDs": 700,
                                    "Encounters": 140,
                                    "Total Deployments": 64
                                },
                                // {
                                //     "vendor": "mpower Social Enterprises Ltd.",
                                //     "Total HIDs": 0,
                                //     "Last 3 Months HIDs": 0,
                                //     "Encounters": 0,
                                //     "Total Deployments": 0
                                // },
                                {
                                    "vendor": "Bindo Logic",
                                    "Total HIDs": 719,
                                    "Last 3 Months HIDs": 330,
                                    "Encounters": 0,
                                    "Total Deployments": 11
                                },
                                {
                                    "vendor": "CMED Health Limited",
                                    "Total HIDs": 78,
                                    "Last 3 Months HIDs": 0,
                                    "Encounters": 73,
                                    "Total Deployments": 6
                                },
                                {
                                    "vendor": "Flora Telecom Ltd.",
                                    "Total HIDs": 502,
                                    "Last 3 Months HIDs": 148,
                                    "Encounters": 0,
                                    "Total Deployments": 6
                                },
                                // {
                                //     "vendor": "Sterling Multi-Technologies Limited",
                                //     "Total HIDs": 7,
                                //     "Last 3 Months HIDs": 0,
                                //     "Encounters": 0,
                                //     "Total Deployments": 1
                                // },
                                // {
                                //     "vendor": "HiSP",
                                //     "Total HIDs": 0,
                                //     "Last 3 Months HIDs": 0,
                                //     "Encounters": 0,
                                //     "Total Deployments": 0
                                // },
                                // {
                                //     "vendor": "Mazedatech Ltd.",
                                //     "Total HIDs": 0,
                                //     "Last 3 Months HIDs": 0,
                                //     "Encounters": 0,
                                //     "Total Deployments": 0
                                // },
                                // {
                                //     "vendor": "FHI 360",
                                //     "Total HIDs": 0,
                                //     "Last 3 Months HIDs": 0,
                                //     "Encounters": 0,
                                //     "Total Deployments": 0
                                // },
                                // {
                                //     "vendor": "BUHS",
                                //     "Total HIDs": 0,
                                //     "Last 3 Months HIDs": 0,
                                //     "Encounters": 0,
                                //     "Total Deployments": 0
                                // },
                                // {
                                //     "vendor": "Skipper International",
                                //     "Total HIDs": 0,
                                //     "Last 3 Months HIDs": 0,
                                //     "Encounters": 0,
                                //     "Total Deployments": 0
                                // },


                            ]}
                            indexBy="vendor"
                            groupModeState="grouped"
                            keys={["Total HIDs", "Last 3 Months HIDs"]}
                            // colors={(bar: any) => String(bar.data.color)}
                            axisLeft={{
                                ...leftAxisProps,
                                tickRotation: 0,
                                legend: "HID Created",
                            }}
                            colors={{ scheme: "category10" }}
                            axisBottom={{ ...bottomAxisProps, tickRotation: -0, legend: "" }}
                            legend={[...barLegendProps]}
                            otherProps={{
                                ...otherPropVals,

                                layout: "vertical",
                                margin: { top: 0, right: 200, bottom: 150, left: 200 },
                                legend: "Facility",
                                theme: {
                                    axis: {
                                        ticks: {
                                            text: {
                                                fontSize: 18, // Font size for axis ticks
                                                fontWeight: 600, // Font weight for axis legend labels
                                            }
                                        },
                                        legend: {
                                            text: {
                                                fontSize: 18, // Font size for axis legend labels
                                                fontWeight: 600, // Font weight for axis legend labels
                                            }
                                        }
                                    },
                                    labels: {
                                        text: {
                                            fontSize: 18, // Font size for bar labels
                                            fontWeight: 600, // Font weight for axis legend labels
                                        }
                                    },
                                    legends: {
                                        text: {
                                            fontSize: 16, // Font size for legends
                                            fontWeight: 400, // Font weight for axis legend labels
                                        }
                                    }
                                }
                                // tooltip: (point:any) => (
                                //     <TooltipBarChart {...{
                                //         line1Label: "",
                                //         line1Value: point.,
                                //         line2Label: "Count:",
                                //         line2Value: point.line2Value,
                                //     }} />
                                // ),
                            }}
                            // {...ChartThemeDef({
                            //     colors: colorsTheme,
                            // })}
                            onClicked={(barEvent: any) => {
                                console.log("Event Fired");

                            }}
                        /> */}
                    </Suspense>
                    {/* <FacilityWiseAggregatedNCDRegistrationData key={'3231233'} /> */}
                </div>
            </div>

            <div className="h-[400px] w-full  rounded-lg col-span-4 lg:col-span-2">
                <Suspense fallback={<MCISpinner />}>
                    <DonutChartMCI data={sectionData.patientCountByServiceLocation} chartTitle="Service Location Overview"
                        colorScheme="red_yellow_green"
                    />
                </Suspense>
            </div>
            <div className="h-[400px] w-full  rounded-lg col-span-4 lg:col-span-2">
                <Suspense fallback={<MCISpinner />}>
                    <DonutChartMCI data={sectionData.ncdPatientsByGender} chartTitle="Gender Distribution"
                        colorScheme="nivo"
                    />
                </Suspense>
            </div>


            <div className="w-full rounded-lg col-span-4 lg:col-span-2 mt-24">
                <div className="h-[600px] w-full rounded-lg md:mt-24 md:pl-24">
                    {/* <FacilityWiseAggregatedReferralFollowupData key={'3233'} /> */}
                    <Suspense fallback={<MCISpinner />}>
                        <BarChartMCI
                            chartTitle="Facility wise Referrals & Follow-up"
                            originalData={sectionData.referralsAndFollowUpsByFacility}
                            indexBy="facility_name"
                            groupModeState="grouped"
                            keys={["Referrals", "Follow Ups"]}
                            // colors={(bar: any) => String(bar.data.color)}
                            axisLeft={{
                                ...leftAxisProps,
                                tickRotation: 0,
                            }}
                            axisBottom={{ ...bottomAxisProps, tickRotation: -25, legend: "" }}
                            legend={[...barLegendProps]}
                            otherProps={{
                                ...otherPropVals,
                                layout: "vertical",
                                margin: { top: 100, right: 250, bottom: 150, left: 60 },
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
            </div>
            <div className="w-full rounded-lg col-span-4 lg:col-span-2 mt-24">
                <div className="h-[600px] w-full rounded-lg md:mt-24 md:pl-24">
                    {/* <FacilityWiseAggregatedReferralFollowupData key={'3233'} /> */}
                    <Suspense fallback={<MCISpinner />}>
                        <BarChartMCI
                            chartTitle="Disease by Age Group"
                            originalData={sectionData.diseaseByAgeGroup}
                            indexBy="ageRange"
                            groupModeState="stacked"
                            keys={barChartkeys}
                            // colors={(bar: any) => String(bar.data.color)}
                            axisLeft={{
                                ...leftAxisProps,
                                tickRotation: 0,
                                tickPadding: -10,
                                legend: "Count",
                            }}
                            axisBottom={{ ...bottomAxisProps, tickRotation: -25, legend: "" }}
                            legend={[...barLegendProps]}
                            otherProps={{
                                ...otherPropVals,
                                layout: "vertical",
                                margin: { top: 100, right: 250, bottom: 150, left: 60 },
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
            </div>
            <div className="w-full rounded-lg col-span-4 lg:col-span-4 mt-24">
                <div className="h-[800px] w-full rounded-lg md:mt-24 md:pl-2">
                    {/* <Button clicked={() => setShowLineChart((_prev: boolean) => !_prev)} variant="primary" size="lg" /> */}
                    <Suspense fallback={<MCISpinner />}>
                        {/* <NCDLineGraph data={sectionData.ncdgetTimeSeriesData} /> */}
                        <NCDLineGraph data={sectionData.ncdgetTimeSeriesData} />
                    </Suspense>
                </div>
            </div>

            {/* <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">
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
            </div> */}


        </div>

    </div>)
};

export default memo(NCDAggregatedDataSection);