import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteNFT, useNFT, useUpdateNFT } from "@/hooks/useNFTs";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Edit2,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function DetailPage() {
  const { id } = useParams({ strict: false });
  const nftId = id ? BigInt(id) : undefined;
  const { data: nft, isLoading } = useNFT(nftId);
  const { identity } = useInternetIdentity();
  const updateNFT = useUpdateNFT();
  const deleteNFT = useDeleteNFT();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOwner =
    identity && nft
      ? identity.getPrincipal().toText() === nft.owner.toString()
      : false;

  const handleEditOpen = () => {
    if (!nft) return;
    setEditTitle(nft.title);
    setEditDesc(nft.description);
    setEditing(true);
  };

  const handleEditCancel = () => {
    setEditing(false);
  };

  const handleEditSave = async () => {
    if (!nft) return;
    try {
      await updateNFT.mutateAsync({
        id: nft.id,
        title: editTitle.trim(),
        description: editDesc.trim(),
      });
      toast.success("NFT updated successfully");
      setEditing(false);
    } catch {
      toast.error("Failed to update NFT");
    }
  };

  const handleDelete = async () => {
    if (!nft) return;
    try {
      await deleteNFT.mutateAsync(nft.id);
      toast.success("NFT deleted");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to delete NFT");
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto" data-ocid="detail.loading_state">
        <Skeleton className="h-7 w-28 mb-8" />
        <div className="grid lg:grid-cols-[1fr_420px] gap-10">
          <Skeleton className="aspect-square rounded-xl w-full" />
          <div className="space-y-5 pt-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Not-found state ────────────────────────────────────────────────────────
  if (!nft) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
        data-ocid="detail.error_state"
      >
        <div className="text-6xl mb-5 select-none">🔍</div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-3 tracking-tight uppercase">
          Artwork Not Found
        </h2>
        <p className="text-muted-foreground text-base mb-8 max-w-sm">
          This piece doesn't exist or was removed from the collection.
        </p>
        <Link to="/">
          <Button
            variant="outline"
            className="gap-2"
            data-ocid="detail.back_button"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Gallery
          </Button>
        </Link>
      </motion.div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const ownerStr = nft.owner.toString();
  const shortOwner = `${ownerStr.slice(0, 8)}…${ownerStr.slice(-6)}`;
  const createdDate = new Date(
    Number(nft.createdAt) / 1_000_000,
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const imageUrl = nft.imageKey.getDirectURL();

  // ── Main view ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto" data-ocid="detail.page">
      {/* Back navigation */}
      <div className="mb-8">
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground transition-smooth -ml-2"
            data-ocid="detail.back_link"
          >
            <ArrowLeft className="h-4 w-4" />
            Gallery
          </Button>
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
        {/* ── Left: full-bleed image ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative rounded-xl overflow-hidden shadow-gallery"
        >
          <img
            src={imageUrl}
            alt={nft.title}
            className="w-full aspect-square object-cover"
          />
          {/* subtle gradient overlay at bottom for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4">
            <Badge
              variant="secondary"
              className="font-mono text-xs px-3 py-1 backdrop-blur-sm bg-black/40 border-border text-foreground"
            >
              NFT #{nft.id.toString()}
            </Badge>
          </div>
        </motion.div>

        {/* ── Right: metadata + actions ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="space-y-6"
        >
          {/* Title block */}
          {!editing && (
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Original Artwork
              </p>
              <h1 className="font-display text-3xl lg:text-4xl font-bold uppercase tracking-tight text-foreground leading-tight">
                {nft.title}
              </h1>
            </div>
          )}

          {/* Description block */}
          {!editing && (
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Description
              </p>
              <p className="text-foreground/80 leading-relaxed text-sm">
                {nft.description || "No description provided."}
              </p>
            </div>
          )}

          {/* Inline edit form */}
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border-frame bg-card p-5 space-y-4"
              data-ocid="detail.edit_form"
            >
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Edit Artwork
              </p>
              <div className="space-y-1">
                <Label
                  htmlFor="edit-title"
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                >
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-display font-bold uppercase tracking-tight"
                  data-ocid="detail.title_input"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="edit-desc"
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                >
                  Description
                </Label>
                <Textarea
                  id="edit-desc"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={4}
                  className="resize-none text-sm leading-relaxed"
                  data-ocid="detail.description_input"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <Button
                  onClick={handleEditSave}
                  disabled={updateNFT.isPending || !editTitle.trim()}
                  className="flex-1 gap-2"
                  data-ocid="detail.save_button"
                >
                  <Save className="h-4 w-4" />
                  {updateNFT.isPending ? "Saving…" : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEditCancel}
                  className="gap-2"
                  data-ocid="detail.cancel_button"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Provenance card */}
          <div className="rounded-xl border-frame bg-card p-4 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Provenance
            </p>
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Owner</p>
                <p className="font-mono text-xs text-foreground break-all leading-relaxed">
                  {shortOwner}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Minted</p>
                <p className="text-xs text-foreground">{createdDate}</p>
              </div>
            </div>
          </div>

          {/* Owner actions */}
          {isOwner && !editing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
              data-ocid="detail.owner_actions"
            >
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Your Artwork
              </p>
              <Button
                onClick={handleEditOpen}
                variant="outline"
                className="w-full gap-2 transition-smooth"
                data-ocid="detail.edit_button"
              >
                <Edit2 className="h-4 w-4" /> Edit Artwork
              </Button>

              {!confirmDelete ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                  onClick={() => setConfirmDelete(true)}
                  data-ocid="detail.delete_button"
                >
                  <Trash2 className="h-4 w-4" /> Delete NFT
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 space-y-3"
                  data-ocid="detail.delete_confirm_dialog"
                >
                  <p className="text-sm text-foreground font-medium">
                    Are you sure you want to delete this NFT?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="destructive"
                      className="flex-1 gap-2"
                      onClick={handleDelete}
                      disabled={deleteNFT.isPending}
                      data-ocid="detail.confirm_button"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deleteNFT.isPending ? "Deleting…" : "Yes, Delete"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setConfirmDelete(false)}
                      data-ocid="detail.cancel_button"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
