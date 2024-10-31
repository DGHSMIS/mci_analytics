export interface PGNCDPayloadLoggerInterface {
    id?: number;
    payload: string;
    providerId: number;
    facilityId: number;
    accessToken: string;
    createdAt: Date;
}