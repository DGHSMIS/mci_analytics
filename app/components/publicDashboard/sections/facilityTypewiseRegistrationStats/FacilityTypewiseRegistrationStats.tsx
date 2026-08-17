import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";
import data from "@public/fake-data/DistrictWiseDataCount.json";
import { FacilityTypeWiseStatsInterface } from "@utils/interfaces/Analytics/PublicDashboard/FacilityTypeWiseStatsInterface";
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
  card6Title?: string;
  card6Value?: number | string | null;
  card7Title?: string;
  card7Value?: number | string | null;
  commonCardProps?: CardIndicatorsProps;
}

const DashboardCardCommonProps: CardIndicatorsProps = {
  className: "h-full hover:shadow-lg hover:cursor-pointer",
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
  card6Title,
  card6Value,
  card7Title,
  card7Value,
  commonCardProps = DashboardCardCommonProps,
}: BaseDashboardStatsProps) {
  return (
    <div>
      {sectionHeader && (
        <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
          {sectionHeader}
        </h3>
      )}
      <div className={`grid gap-12 xl:gap-16 lg:space-x-0 lg:space-y-0 ${card7Title ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7" : card6Title ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6" : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"}`}>
        <CardIndicators
          {...commonCardProps}
          key={0}
          title={card1Title}
          iconName={card1Title.toLowerCase().includes("clinical") ? "activity-heart" : "activity"}
          className='col-span-2 sm:col-span-1 xl:col-span-1'
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
          iconName="clipboard-check"
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
          iconName="shield-tick"
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
          iconName="building-01"
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
          iconName="database-01"
          title={card5Title}
          className='col-span-1 lg:col-span-1'
          subTitle={
            data !== null
              ? countStats?.eMISCount?.toLocaleString("en-IN")
              : ""
          }
        />
        {card6Title && (card6Value !== undefined || countStats?.eAppointmentCount !== undefined) && (
          <CardIndicators
            {...commonCardProps}
            key={5}
            iconName="calendar"
            title={card6Title}
            className='col-span-1 lg:col-span-1'
            subTitle={
              (card6Value ?? countStats?.eAppointmentCount) !== null && (card6Value ?? countStats?.eAppointmentCount) !== undefined
                ? Number(card6Value ?? countStats?.eAppointmentCount).toLocaleString("en-IN")
                : ""
            }
          />
        )}
        {card7Title && (card7Value !== undefined || countStats?.governmentOutdoorDispensaryCount !== undefined) && (
          <CardIndicators
            {...commonCardProps}
            key={6}
            iconName="medical-cross"
            title={card7Title}
            className='col-span-1 lg:col-span-1'
            subTitle={
              (card7Value ?? countStats?.governmentOutdoorDispensaryCount) !== null && (card7Value ?? countStats?.governmentOutdoorDispensaryCount) !== undefined
                ? Number(card7Value ?? countStats?.governmentOutdoorDispensaryCount).toLocaleString("en-IN")
                : ""
            }
          />
        )}
      </div>
    </div>
  );
});

export default FacilityTypewiseRegistrationStats;
