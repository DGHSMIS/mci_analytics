
export interface NCDDonutChartProps {
    "id": string,
    "label": string,
    "value": number
}

interface TimeSeriesXAndYPair {
    x: string;
    y: number;
}
export interface NCDTimeSeriesChartProps {
    "id": string;
    "data": TimeSeriesXAndYPair[];
}

export interface NCDFollowUpReferralProps {
        "facility_name": string;
        [key: string]: string;
}

export interface NCDByAgeGroupProps {
        "age_range": string;
        [key: string]: string;
}

export interface PatientCountByFacility {
        "facilityItems": string;
        [key: string]: string;
}
export interface NCDAggregatedStatsProps {
    patientCountByServiceLocation: NCDDonutChartProps[];
    ncdgetTimeSeriesData: NCDTimeSeriesChartProps[] | [];
    referralsAndFollowUpsByFacility: NCDFollowUpReferralProps[];
    diseaseByAgeGroup: NCDByAgeGroupProps[];
    ncdPatientsByGender: NCDDonutChartProps[];
    patientCountByFacility: PatientCountByFacility[];
}

// [key: string]: string;