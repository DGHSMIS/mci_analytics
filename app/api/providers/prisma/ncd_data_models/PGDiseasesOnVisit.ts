import { PGDiseaseInterface } from "./PGDiseaseInterface";

export interface PGDiseasesOnVisit {
    id?: number;
    patientVisitId: number;
    conceptUuId: string;
    conceptName?: string;
    patientSymptoms: string;
    disease?: PGDiseaseInterface;
    createdAt: Date;
}