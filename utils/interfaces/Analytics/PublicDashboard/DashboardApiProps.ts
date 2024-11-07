import { AreaWiseRegistrationStatsProps } from "@utils/interfaces/DataModels/LocalityInterfaces";

export interface DashboardApiProps {
  totalRegistration: number;
  dailyRegistration: Record<string, never>;
  openMRSFacilityCount: number;
  openSRPFacilityCount: number;
  eMISFacilityCount: number;
  divisionWiseData: AreaWiseRegistrationStatsProps;
}
