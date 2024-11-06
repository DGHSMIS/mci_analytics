import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";
import { NCDLifetimeStats } from "@utils/interfaces/NCD/NCDLifetimeStatsProps";
import dynamic from "next/dynamic";
import { memo } from "react";
const CardIndicators = dynamic(() => import("@components/globals/CardIndicator/CardIndicator"), {
    ssr: true,
    loading: () => (<SkeletonCardIndicator />),
});
export const NCDLifetimeStatsSection = memo(function NCDLifetimeStatsSection({
    totalPatients,
    totalReferrals,
    totalFollowUps,
    emergencyCounts
}: NCDLifetimeStats) {
    const NCDashboardCardCommonProps: CardIndicatorsProps = {
        className: "h-fit hover:shadow-lg hover:cursor-pointer",
        iconBgVariant: "light",
        variant: "success",
        hasIcon: true,
        hasCategoryTitle: false,
        hasTitle: true,
        titleAlign: "center",
    };

    return (<><h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
        Pediatric NCD Lifetime Stats
    </h3>
        <div className="grid grid-cols-4  lg:grid-cols-4 gap-16 lg:space-x-0 mb-12">

            <CardIndicators
                {...NCDashboardCardCommonProps}
                key={10}
                title={"Total NCD patients"}
                iconName="bar-chart-square-plus"
                className='col-span-2 lg:col-span-1'
                subTitle={
                    String(totalPatients)
                }
            />
            <CardIndicators
                {...NCDashboardCardCommonProps}
                key={111}
                title={"Patients at Emergency Dept"}
                iconName="bar-chart-square-plus"
                className='col-span-2 lg:col-span-1'
                subTitle={
                    String(emergencyCounts)
                }
            />
            <CardIndicators
                {...NCDashboardCardCommonProps}
                key={1112}
                title={"Referred to UHC"}
                iconName="bar-chart-square-plus"
                className='col-span-2 lg:col-span-1'
                subTitle={String(totalReferrals)}
            />
            <CardIndicators
                {...NCDashboardCardCommonProps}
                key={11112}
                title={"Follow-up visits"}
                iconName="bar-chart-square-plus"
                className='col-span-2 lg:col-span-1'
                subTitle={String(totalFollowUps)}

            />
        </div></>)
});