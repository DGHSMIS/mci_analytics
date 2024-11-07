export interface PGNCDPayloadLoggerInterface {
    id?: number;
    payload: string;
    providerId: number;
    facilityCode: string;
    accessToken: string;
    createdAt: Date;
}