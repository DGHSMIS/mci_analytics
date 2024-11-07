import { PGDiseasesOnVisit } from "./PGDiseasesOnVisit";

export interface PGPatientVisitInterface {
    id?: number;
    patientId: number;
    healthId?: string;
    patientName: string;
    visitId: number;
    dateOfVisit: Date;
    dob: Date;
    gender: 'Male' | 'Female' | 'Other';
    facilityCode: string;
    serviceLocation: 'IPD' | 'OPD' | 'Emergency';
    isReferredToHigherFacility: boolean;
    diseaseRef?: PGDiseasesOnVisit[];
    isFollowUp: boolean;
    createdAt: Date;
}