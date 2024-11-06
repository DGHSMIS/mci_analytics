import { NCDByAgeGroupProps, NCDDonutChartProps, NCDFollowUpReferralProps, NCDTimeSeriesChartProps, PatientCountByFacility } from "@utils/interfaces/NCD/NCDAggregatedStatsProps";

export interface NCDDiseasewiseStatsProps {
    totalPatients: string;
    ageGroup: NCDByAgeGroupProps[];
    serviceLocationGroup: NCDDonutChartProps[];
    facilityGroup: PatientCountByFacility[];
    timeSeriesData: NCDTimeSeriesChartProps[];
    referralsAndFollowUps: NCDFollowUpReferralProps[];
}