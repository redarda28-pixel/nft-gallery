import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Nft {
    id: NftId;
    title: string;
    owner: Principal;
    createdAt: Time;
    description: string;
    imageKey: ExternalBlob;
}
export type NftId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteNFT(id: NftId): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getNFT(id: NftId): Promise<Nft | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllNFTs(): Promise<Array<Nft>>;
    listMyNFTs(): Promise<Array<Nft>>;
    mintNFT(title: string, description: string, imageKey: ExternalBlob): Promise<NftId>;
    updateNFT(id: NftId, title: string, description: string): Promise<void>;
}
