
export interface PGPatientVisitInterface {
    id?: number;
    patientId: number;
    patientName: string;
    dateOfVisit: Date;
    dob: Date;
    gender: 'Male' | 'Female' | 'Other';
    facilityId: number;
    serviceLocation: 'IPD' | 'OPD' | 'Emergency';
    diseaseId: number;
    isReferredToHigherFacility: boolean;
    isFollowUp: boolean;
    createdAt: Date;
}