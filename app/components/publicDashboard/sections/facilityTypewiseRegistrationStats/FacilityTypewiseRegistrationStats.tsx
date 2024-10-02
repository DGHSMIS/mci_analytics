import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";
import data from "@public/fake-data/DistrictWiseDataCount.json";
import { FacilityTypeWiseStatsInterface } from "@utils/interfaces/Analytics/FacilityTypeWiseStatsInterface";
import dynamic from "next/dynamic";
import { memo } from "react";

export interface BaseDashboardStatsProps {
  sectionHeader?: string;
  countStats: FacilityTypeWiseStatsInterface;
  card1Title: string;
  card2Title: string;
  card3Title: string;
  card4Title: string;
  card5Title: string;
  commonCardProps?: CardIndicatorsProps;
}

const DashboardCardCommonProps: CardIndicatorsProps = {
  className: "h-fit hover:shadow-lg hover:cursor-pointer",
  iconBgVariant: "light",
  variant: "success",
  hasIcon: true,
  hasCategoryTitle: false,
  hasTitle: true,
  titleAlign: "center",
};

const CardIndicators = dynamic(() => import("@components/globals/CardIndicator/CardIndicator"), {
  ssr: true,
  loading: () => (<SkeletonCardIndicator />),
});

const FacilityTypewiseRegistrationStats = memo(function FacilityTypewiseRegistrationStats({
  sectionHeader,
  countStats,
  card1Title,
card2Title,
card3Title,
card4Title,
card5Title,
  commonCardProps = DashboardCardCommonProps,
}: BaseDashboardStatsProps) {
  return (
    <div>
      {sectionHeader && (
        <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
          {sectionHeader}
        </h3>
      )}
      <div className="grid grid-cols-2  lg:grid-cols-5 gap-16 lg:space-x-0 lg:space-y-0">
        <CardIndicators
          {...commonCardProps}
          key={0}
          title={card1Title}
          iconName="bar-chart-square-plus"
          className='col-span-2 lg:col-span-1'
          subTitle={
            countStats !== null
              ? countStats?.totalCount?.toLocaleString("en-IN")
              : ""
          }
        />
        <CardIndicators
          {...commonCardProps}
          key={1}
          title={card2Title}
          iconName="bar-chart-square-plus"
          className='col-span-1 lg:col-span-1'

          subTitle={
            data !== null
              ? countStats?.openMRSCount?.toLocaleString(
                  "en-IN"
                )
              : ""
          }
        />
        <CardIndicators
          {...commonCardProps}
          key={2}
          title={card3Title}
          iconName="bar-chart-square-plus"
          className='col-span-1 lg:col-span-1'

          subTitle={
            data !== null
              ? countStats?.openSRPCount?.toLocaleString(
                  "en-IN"
                )
              : ""
          }
        />
        <CardIndicators
          {...commonCardProps}
          key={3}
          iconName="bar-chart-square-plus"
          title={card4Title}
          className='col-span-1 lg:col-span-1'

          subTitle={
            data !== null
              ? countStats?.aaloClincCount?.toLocaleString("en-IN")
              : ""
          }
        />
        <CardIndicators
          {...commonCardProps}
          key={4}
          iconName="bar-chart-square-plus"
          title={card5Title}
          className='col-span-1 lg:col-span-1'
          subTitle={
            data !== null
              ? countStats?.eMISCount?.toLocaleString("en-IN")
              : ""
          }
        />
      </div>
    </div>
  );
});

export default FacilityTypewiseRegistrationStats;
