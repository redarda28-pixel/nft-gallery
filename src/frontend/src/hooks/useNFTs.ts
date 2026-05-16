import { createActor } from "@/backend";
import type { NFT } from "@/types/nft";
import { useActor } from "@caffeineai/core-infrastructure";
import { ExternalBlob } from "@caffeineai/object-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useNFTs() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NFT[]>({
    queryKey: ["nfts"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).listAllNFTs() as Promise<NFT[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyNFTs() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NFT[]>({
    queryKey: ["my-nfts"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).listMyNFTs() as Promise<NFT[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNFT(id: bigint | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NFT | null>({
    queryKey: ["nft", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await (actor as any).getNFT(id)) as
        | { __kind__: "Some"; value: NFT }
        | { __kind__: "None" };
      return result.__kind__ === "Some" ? result.value : null;
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useMintNFT() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      imageFile: File;
    }) => {
      if (!actor) throw new Error("Not connected");
      const bytes = new Uint8Array(await params.imageFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).mintNFT(
        params.title,
        params.description,
        blob,
      ) as Promise<bigint>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfts"] });
      queryClient.invalidateQueries({ queryKey: ["my-nfts"] });
    },
  });
}

export function useUpdateNFT() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      title: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).updateNFT(
        params.id,
        params.title,
        params.description,
      );
    },
    onSuccess: (
      _data: unknown,
      vars: { id: bigint; title: string; description: string },
    ) => {
      queryClient.invalidateQueries({ queryKey: ["nft", vars.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ["my-nfts"] });
      queryClient.invalidateQueries({ queryKey: ["nfts"] });
    },
  });
}

export function useDeleteNFT() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).deleteNFT(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfts"] });
      queryClient.invalidateQueries({ queryKey: ["my-nfts"] });
    },
  });
}
