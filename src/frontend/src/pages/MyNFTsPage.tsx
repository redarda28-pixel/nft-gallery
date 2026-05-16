import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteNFT, useMyNFTs, useUpdateNFT } from "@/hooks/useNFTs";
import type { NFT } from "@/types/nft";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import { Edit2, ImageIcon, PlusCircle, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function NFTSkeletonCard() {
  return (
    <Card className="overflow-hidden border-frame bg-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="pt-2 flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </div>
    </Card>
  );
}

// ─── Editing State ─────────────────────────────────────────────────────────────
interface EditState {
  id: bigint;
  title: string;
  description: string;
}

// ─── My NFT Card ───────────────────────────────────────────────────────────────
interface MyNFTCardProps {
  nft: NFT;
  index: number;
  isEditing: boolean;
  editState: EditState | null;
  onEditChange: (s: EditState) => void;
  onStartEdit: (nft: NFT) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onConfirmDelete: (nft: NFT) => void;
  isSaving: boolean;
}

function MyNFTCard({
  nft,
  index,
  isEditing,
  editState,
  onEditChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onConfirmDelete,
  isSaving,
}: MyNFTCardProps) {
  const imageUrl = nft.imageKey.getDirectURL();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Card
        className="overflow-hidden border-frame bg-card shadow-frame hover:shadow-gallery transition-smooth"
        data-ocid={`my-nfts.item.${index + 1}`}
      >
        {/* Thumbnail — always links to detail */}
        <Link to="/nft/$id" params={{ id: nft.id.toString() }}>
          <div className="relative overflow-hidden aspect-square bg-muted group">
            <img
              src={imageUrl}
              alt={nft.title}
              className="w-full h-full object-cover transition-smooth group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
          </div>
        </Link>

        <div className="p-4 space-y-3">
          {isEditing && editState ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
              data-ocid={`my-nfts.edit_form.${index + 1}`}
            >
              <div className="space-y-1">
                <Label
                  htmlFor={`edit-title-${nft.id}`}
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Title
                </Label>
                <Input
                  id={`edit-title-${nft.id}`}
                  value={editState.title}
                  onChange={(e) =>
                    onEditChange({ ...editState, title: e.target.value })
                  }
                  className="bg-muted/40 border-input text-foreground text-sm"
                  placeholder="NFT title"
                  data-ocid={`my-nfts.edit_title.${index + 1}`}
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor={`edit-desc-${nft.id}`}
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Description
                </Label>
                <Textarea
                  id={`edit-desc-${nft.id}`}
                  value={editState.description}
                  onChange={(e) =>
                    onEditChange({ ...editState, description: e.target.value })
                  }
                  className="bg-muted/40 border-input text-foreground text-sm resize-none"
                  rows={3}
                  placeholder="Describe this artwork…"
                  data-ocid={`my-nfts.edit_description.${index + 1}`}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={onSaveEdit}
                  disabled={isSaving}
                  className="flex-1 font-display uppercase tracking-wider text-xs"
                  data-ocid={`my-nfts.save_button.${index + 1}`}
                >
                  {isSaving ? "Saving…" : "Save"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onCancelEdit}
                  disabled={isSaving}
                  className="flex-1 font-display uppercase tracking-wider text-xs"
                  data-ocid={`my-nfts.cancel_edit_button.${index + 1}`}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="min-w-0">
                <p className="font-display font-semibold text-sm uppercase tracking-wider text-foreground truncate">
                  {nft.title}
                </p>
                {nft.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {nft.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => onStartEdit(nft)}
                  className="flex-1 gap-1.5 font-display uppercase tracking-wider text-xs"
                  data-ocid={`my-nfts.edit_button.${index + 1}`}
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => onConfirmDelete(nft)}
                  className="flex-1 gap-1.5 font-display uppercase tracking-wider text-xs"
                  data-ocid={`my-nfts.delete_button.${index + 1}`}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function MyNFTsPage() {
  const { isAuthenticated, isInitializing, login } = useInternetIdentity();

  const { data: nfts, isLoading } = useMyNFTs();
  const updateNFT = useUpdateNFT();
  const deleteNFT = useDeleteNFT();

  const [editState, setEditState] = useState<EditState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NFT | null>(null);

  function startEdit(nft: NFT) {
    setEditState({
      id: nft.id,
      title: nft.title,
      description: nft.description,
    });
  }

  function cancelEdit() {
    setEditState(null);
  }

  async function saveEdit() {
    if (!editState) return;
    try {
      await updateNFT.mutateAsync(editState);
      toast.success("NFT updated successfully");
      setEditState(null);
    } catch {
      toast.error("Failed to update NFT");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteNFT.mutateAsync(deleteTarget.id);
      toast.success("NFT deleted");
    } catch {
      toast.error("Failed to delete NFT");
    } finally {
      setDeleteTarget(null);
    }
  }

  // ─── Auth wall ───────────────────────────────────────────────────────────────
  if (!isInitializing && !isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center"
        data-ocid="my-nfts.auth_wall"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-foreground tracking-tight uppercase">
            Sign In Required
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Connect with Internet Identity to view and manage your NFT
            collection.
          </p>
        </div>
        <Button
          onClick={() => login()}
          className="font-display uppercase tracking-wider"
          data-ocid="my-nfts.login_button"
        >
          Connect with Internet Identity
        </Button>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen bg-background px-4 py-10"
      data-ocid="my-nfts.page"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10 flex items-center justify-between gap-4 flex-wrap"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight uppercase">
              My NFTs
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {nfts
                ? `${nfts.length} artwork${nfts.length !== 1 ? "s" : ""}`
                : "Your minted digital artworks"}
            </p>
          </div>
          <Link to="/mint">
            <Button
              className="font-display uppercase tracking-wider gap-2"
              data-ocid="my-nfts.mint_button"
            >
              <PlusCircle className="w-4 h-4" />
              Mint New NFT
            </Button>
          </Link>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="my-nfts.loading_state"
          >
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <NFTSkeletonCard key={k} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!nfts || nfts.length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-6 py-24 text-center"
            data-ocid="my-nfts.empty_state"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-xl font-bold text-foreground tracking-tight uppercase">
                You have no NFTs yet
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Mint your first digital artwork and start building your on-chain
                collection.
              </p>
            </div>
            <Link to="/mint">
              <Button
                className="font-display uppercase tracking-wider gap-2"
                data-ocid="my-nfts.empty_mint_button"
              >
                <PlusCircle className="w-4 h-4" />
                Mint Your First NFT
              </Button>
            </Link>
          </motion.div>
        )}

        {/* NFT Grid */}
        {!isLoading && nfts && nfts.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="my-nfts.list"
          >
            {nfts.map((nft, index) => (
              <MyNFTCard
                key={nft.id.toString()}
                nft={nft}
                index={index}
                isEditing={editState?.id === nft.id}
                editState={editState?.id === nft.id ? editState : null}
                onEditChange={setEditState}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={saveEdit}
                onConfirmDelete={setDeleteTarget}
                isSaving={updateNFT.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent
          className="bg-card border-frame"
          data-ocid="my-nfts.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground tracking-tight uppercase">
              Delete NFT
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="text-foreground font-semibold">
                &ldquo;{deleteTarget?.title}&rdquo;
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              data-ocid="my-nfts.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteNFT.isPending}
              className="font-display uppercase tracking-wider"
              data-ocid="my-nfts.confirm_button"
            >
              {deleteNFT.isPending ? "Deleting…" : "Delete NFT"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
