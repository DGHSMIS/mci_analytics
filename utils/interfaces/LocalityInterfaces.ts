export interface LocationInterface {
  [key: string]: string;
}

export interface DistrictWiseCounter {
  [key: string]: number;
}

export interface DivisionWiseCounter {
  count: number;
  districts: DistrictWiseCounter;
}

export interface AreaWiseRegistrationStatsProps {
  message?: any;
  [key: string]: DivisionWiseCounter;
}

export interface CountryInterface {
  [key: string]: string;
}

export interface DivisionInterface {
  [key: string]: string;
}

export interface DistrictInterface {
  [key: string]: string;
}

export interface UpazilaInterface {
  [key: string]: string;
}
