import CustomSpinner from "@components/globals/loaders/CustomSpinner";
import SectionSkeletonLoader from "@components/publicDashboard/sections/DefaultSectionTemplate/SectionSkeletonLoader";
import { AreaWiseRegistrationStatsProps } from "@utils/interfaces/DataModels/LocalityInterfaces";
import dynamic from "next/dynamic";
import { memo } from "react";

// import ChartRenderingSection from "@components/publicDashboard/sections/demographySection/subSections/ChartRenderingSection";

export interface DemographyMainProps {
  sectionHeader: string;
  divisionWiseRegistrationCount: AreaWiseRegistrationStatsProps;
}

const DefaultSectionTemplate = dynamic(
  () => import("@components/publicDashboard/sections/DefaultSectionTemplate/DefaultSectionTemplate"),
  {
    ssr: true,
    loading: () => (<SectionSkeletonLoader renderContext={1} hideFilterDD={true} />)
  });

const ChartRenderingSection = dynamic(
  () =>
    import(
      "@components/publicDashboard/sections/demographySection/subSections/ChartRenderingSection"
    ),
  {
    ssr: false,
    loading: () => (
      <CustomSpinner containerClassName="min-h-[400px] flex items-center justify-center" />
    ),
  }
);

export default memo(function DemographyMain({
  sectionHeader,
  divisionWiseRegistrationCount,
}: DemographyMainProps) {
  return (
    <DefaultSectionTemplate renderContext={1} sectionHeader={sectionHeader}>
      <ChartRenderingSection
        divisionWiseRegistrationCount={divisionWiseRegistrationCount}
      />
    </DefaultSectionTemplate>
  );
});
