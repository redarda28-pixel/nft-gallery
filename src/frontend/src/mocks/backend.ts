import type { backendInterface, Nft, NftId, UserRole, _ImmutableObjectStorageCreateCertificateResult, _ImmutableObjectStorageRefillResult } from "../backend";
import { ExternalBlob } from "../backend";

const sampleNfts: Nft[] = [
  {
    id: BigInt(1),
    title: "Aeterna #14",
    owner: { toText: () => "aaaaa-aa", _isPrincipal: true } as any,
    createdAt: BigInt(Date.now() * 1000000),
    description: "A swirling purple vortex of digital energy captured in motion.",
    imageKey: ExternalBlob.fromURL("https://picsum.photos/seed/nft1/400/400"),
  },
  {
    id: BigInt(2),
    title: "NFT Artwork",
    owner: { toText: () => "bbbbb-bb", _isPrincipal: true } as any,
    createdAt: BigInt(Date.now() * 1000000),
    description: "Digital portrait in flowing blues and teals.",
    imageKey: ExternalBlob.fromURL("https://picsum.photos/seed/nft2/400/400"),
  },
  {
    id: BigInt(3),
    title: "Conceptual",
    owner: { toText: () => "ccccc-cc", _isPrincipal: true } as any,
    createdAt: BigInt(Date.now() * 1000000),
    description: "Abstract black and white sculptural form.",
    imageKey: ExternalBlob.fromURL("https://picsum.photos/seed/nft3/400/400"),
  },
  {
    id: BigInt(4),
    title: "Aeterna #15",
    owner: { toText: () => "aaaaa-aa", _isPrincipal: true } as any,
    createdAt: BigInt(Date.now() * 1000000),
    description: "Pastel sky portrait series, part of the Aeterna collection.",
    imageKey: ExternalBlob.fromURL("https://picsum.photos/seed/nft4/400/400"),
  },
  {
    id: BigInt(5),
    title: "Digital Ruins",
    owner: { toText: () => "ddddd-dd", _isPrincipal: true } as any,
    createdAt: BigInt(Date.now() * 1000000),
    description: "Painterly brushstroke portrait against atmospheric background.",
    imageKey: ExternalBlob.fromURL("https://picsum.photos/seed/nft5/400/400"),
  },
  {
    id: BigInt(6),
    title: "Quantum Shadows",
    owner: { toText: () => "eeeee-ee", _isPrincipal: true } as any,
    createdAt: BigInt(Date.now() * 1000000),
    description: "Layered monochrome terrain — landscape studies in black.",
    imageKey: ExternalBlob.fromURL("https://picsum.photos/seed/nft6/400/400"),
  },
];

export const mockBackend: backendInterface = {
  _immutableObjectStorageBlobsAreLive: async (_hashes) => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async (_blobs) => undefined,
  _immutableObjectStorageCreateCertificate: async (_blobHash) =>
    ({ method: "", blob_hash: "" } as _ImmutableObjectStorageCreateCertificateResult),
  _immutableObjectStorageRefillCashier: async (_info) =>
    ({} as _ImmutableObjectStorageRefillResult),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,
  assignCallerUserRole: async (_user, _role) => undefined,
  deleteNFT: async (_id) => undefined,
  getCallerUserRole: async () => "guest" as unknown as UserRole,
  getNFT: async (id) => sampleNfts.find((n) => n.id === id) ?? null,
  isCallerAdmin: async () => false,
  listAllNFTs: async () => sampleNfts,
  listMyNFTs: async () => [],
  mintNFT: async (_title, _description, _imageKey) => BigInt(7),
  updateNFT: async (_id, _title, _description) => undefined,
};
