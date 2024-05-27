import { RegistrationStatsProps } from "@api/es/analytics/patient/get-facility-type-registration-stats/route";
import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import SkeletonCardIndicator from "@components/globals/CardIndicator/SkeletonCardIndicator";
import data from "@public/fake-data/DistrictWiseDataCount.json";
import dynamic from "next/dynamic";
import { memo } from "react";

export interface BaseDashboardStatsProps {
  sectionHeader?: string;
  registrationStats: RegistrationStatsProps;
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
                                                                                            registrationStats,
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
          title="Health ID Registered"
          iconName="bar-chart-square-plus"
          className='col-span-2 lg:col-span-1'
          subTitle={
            registrationStats !== null
              ? registrationStats?.totalRegistration?.toLocaleString("en-IN")
              : ""
          }
        />
        <CardIndicators
          {...commonCardProps}
          key={1}
          title="Regs. via OpenMRS+"
          iconName="bar-chart-square-plus"
          className='col-span-1 lg:col-span-1'

          subTitle={
            data !== null
              ? registrationStats?.openMRSFacilityCount?.toLocaleString(
                  "en-IN"
                )
              : ""
          }
        />
        <CardIndicators
          {...commonCardProps}
          key={2}
          title="Regs. via OpenSRP"
          iconName="bar-chart-square-plus"
          className='col-span-1 lg:col-span-1'

          subTitle={
            data !== null
              ? registrationStats?.openSRPFacilityCount?.toLocaleString(
                  "en-IN"
                )
              : ""
          }
        />
        <CardIndicators
          {...commonCardProps}
          key={3}
          iconName="bar-chart-square-plus"
          title="Regs. via Aalo Clinic"
          className='col-span-1 lg:col-span-1'

          subTitle={
            data !== null
              ? registrationStats?.aaloClincFacilityCount?.toLocaleString("en-IN")
              : ""
          }
        />
        <CardIndicators
          {...commonCardProps}
          key={4}
          iconName="bar-chart-square-plus"
          title="Regs. via eMIS"
          className='col-span-1 lg:col-span-1'
          subTitle={
            data !== null
              ? registrationStats?.eMISFacilityCount?.toLocaleString("en-IN")
              : ""
          }
        />
      </div>
    </div>
  );
});

export default FacilityTypewiseRegistrationStats;
