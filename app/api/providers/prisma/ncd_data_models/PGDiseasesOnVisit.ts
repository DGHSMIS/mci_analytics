export interface PGDiseasesOnVisit {
    id?: number;
    patientVisitId: number;
    conceptUuId: string;
    conceptName?: string;
    patientSymptoms: string;
    createdAt: Date;
}