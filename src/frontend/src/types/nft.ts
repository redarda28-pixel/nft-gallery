import type { ExternalBlob } from "@caffeineai/object-storage";
import type { Principal } from "@icp-sdk/core/principal";

export interface NFT {
  id: bigint;
  title: string;
  description: string;
  imageKey: ExternalBlob;
  owner: Principal;
  createdAt: bigint;
}

export type NFTId = bigint;
