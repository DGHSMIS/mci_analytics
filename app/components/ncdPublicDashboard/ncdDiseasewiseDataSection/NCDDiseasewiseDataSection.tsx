import { MCISpinner } from "@components/MCISpinner";
import { defaultBarLegend, defaultBottomAxisProps, defaultLeftAxisProps, defaultOtherProps } from "@components/charts/BarChart/BarChartDefaultProps";
import { TooltipBarChartProps } from "@components/charts/BarChart/TooltipBarChart";
import { ChartThemeDef } from "@components/charts/ChartThemeDef";
import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";
import SearchDateRangeFilter from "@components/publicDashboard/sectionFilterSegment/SearchDateRangeFilter";
import FormItemResponseProps from "@library/form/FormItemResponseProps";
import { AxisProps } from "@nivo/axes";
import { BarLegendProps } from "@nivo/bar";
import { tokens } from "@utils/ThemeToken";
import { NCDDiseasewiseStatsProps } from "@utils/interfaces/NCD/NCDDiseasewiseStatsProps";
import dynamic from "next/dynamic";
import { memo, Suspense, useMemo } from "react";
import { cn } from "tailwind-cn";
// import { NCDLineGraph } from "../NcdDbClientWrapper";

const NCDLineGraph = dynamic(
    () => import("@charts/LineChart/NCDLineChart"), {
    ssr: true,
})
const CardIndicators = dynamic(() => import("@components/globals/CardIndicator/CardIndicator"), {
    ssr: true,
    loading: () => (<SkeletonCardIndicator />),
});

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
const DropDownSingle = dynamic(
    () => import("@library/form/DropDownSingle"), {
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
    }
};


export interface NCDDiseasewiseDataSectionProps {
    sectionData: NCDDiseasewiseStatsProps;
}
function NCDDiseasewiseDataSection({ sectionData }: NCDDiseasewiseDataSectionProps) {
    const colorsTheme: any = tokens();

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
        return {
            leftAxisProps,
            bottomAxisProps,
            barLegendProps,
            otherPropVals,
        };
    }, []);
    return (<div className="relative h-full w-full items-start justify-center space-y-40 rounded-lg border border-slate-200 bg-white p-20 hover:border-primary-400  hover:shadow-xl">
        <div className="mx-auto mt-16 grid max-w-7xl gap-20 sm:grid-cols-3 lg:h-36 lg:grid-cols-3 lg:gap-40 lg:pb-20">
            <div
                className={cn(
                    "flex justify-end items-end lg:col-span-2 col-span-3"
                )}
            >
                <SearchDateRangeFilter renderContext={3} />
            </div>
            <div>
                <DropDownSingle size="sm" label="Filter Disease" items={[{
                    "id": 1,
                    "name": "Bronchial Asthma"
                }]} index={null} onChange={function (value: FormItemResponseProps): void {
                    throw new Error("Function not implemented.");
                }} />
            </div>
        </div>

        <div className="grid grid-cols-2  lg:grid-cols-4 gap-16 lg:space-x-0 px-24 align-middle">
            <div className="w-full rounded-lg col-span-4 lg:col-span-2 mt-24">

                <CardIndicators
                    {...NCDashboardCardCommonProps}
                    key={10}
                    title={"Total Bronchial Asthma Patients"}
                    iconName="bar-chart-square-plus"
                    className=' md:pl-24 col-span-2 lg:col-span-1'
                    subTitle={
                        sectionData.totalPatients
                    }
                />
                <div className="h-[400px] w-full col-span-4 lg:col-span-2 rounded-lg md:mt-24 md:pl-24">
                    <Suspense fallback={<MCISpinner />}>
                        <DonutChartMCI key={'323'} data={sectionData.serviceLocationGroup} chartTitle="Bronchial Asthma Service Location"
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
                                chartTitle="Bronchial Asthma by Age Group"
                                originalData={sectionData.ageGroup}
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
            {/* <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">

            </div> */}
            <div className="w-full rounded-lg col-span-4 lg:col-span-2 mt-24">
                <div className="h-full w-full rounded-lg md:mt-24 md:pl-24">
                    <div className="h-[500px] w-full rounded-lg">
                        <Suspense fallback={<MCISpinner />}>
                            <BarChartMCI
                                chartTitle="Bronchial Asthma by Facility"
                                originalData={sectionData.facilityGroup}
                                indexBy="facility_name"
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
            {/* <div className="w-full rounded-lg col-span-2 lg:col-span-2 mt-24">
                <div className="h-full w-full rounded-lg md:mt-24 md:pl-24">
                    <FacilityWiseAggregatedNCDRegistrationData key={'3231233'} title="Bronchial Asthma  Facilitywise Stats" />
                </div>
            </div> */}
            <div className="w-full rounded-lg col-span-4 lg:col-span-2 mt-24">
                <div className="h-[600px] w-full rounded-lg md:mt-24 md:pl-24">
                    {/* <FacilityWiseAggregatedReferralFollowupData key={'3233'} /> */}
                    <Suspense fallback={<MCISpinner />}>
                        <BarChartMCI
                            chartTitle="Bronchial Asthma Facility wise Referrals & Follow-up"
                            originalData={sectionData.referralsAndFollowUps}
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
                <div className="h-[800px] w-full rounded-lg md:mt-24 md:pl-2">
                    {/* <Button clicked={() => setShowLineChart((_prev: boolean) => !_prev)} variant="primary" size="lg" /> */}
                    <Suspense fallback={<MCISpinner />}>
                        <NCDLineGraph data={sectionData.timeSeriesData} />
                    </Suspense>
                </div>
            </div>
        </div>
    </div>)
};

export default memo(NCDDiseasewiseDataSection);