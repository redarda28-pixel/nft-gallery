import { NFTCard } from "@/components/NFTCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNFTs } from "@/hooks/useNFTs";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  ImageOff,
  LayoutGrid,
  LayoutList,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SKELETON_KEYS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
];

type ViewMode = "grid" | "list";

export default function GalleryPage() {
  const { data: nfts, isLoading } = useNFTs();
  const { isAuthenticated, login } = useInternetIdentity();
  const isLoggedIn = isAuthenticated;
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");

  const trimmed = search.trim();
  const filtered = trimmed
    ? (nfts ?? []).filter((nft) =>
        nft.owner.toString().toLowerCase().includes(trimmed.toLowerCase()),
      )
    : (nfts ?? []);

  const totalCount = nfts?.length ?? 0;
  const filteredCount = filtered.length;
  const isSearchActive = trimmed.length > 0;

  return (
    <div className="space-y-0">
      {/* Page Header */}
      <div
        className="relative overflow-hidden border-b border-border bg-card"
        data-ocid="gallery.header"
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(var(--primary) / 0.3) 0%, transparent 60%), radial-gradient(circle at 80% 20%, oklch(var(--accent) / 0.2) 0%, transparent 50%)",
          }}
        />
        <div className="relative px-6 py-8 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start justify-between gap-4 flex-wrap"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-display">
                  Digital Gallery
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-foreground">
                Explore New Arrivals
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-body">
                Unique digital art — minted on-chain, owned forever
              </p>
            </div>
            {!isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  onClick={login}
                  className="shrink-0"
                  data-ocid="gallery.login_button"
                >
                  Connect &amp; Mint
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 md:px-10 py-3 border-b border-border bg-card/60 sticky top-14 z-10 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by owner principal…"
              className="w-full h-9 pl-9 pr-8 rounded-lg bg-muted/40 border border-input text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              data-ocid="gallery.search_input"
            />
            {isSearchActive && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
                data-ocid="gallery.search_clear_button"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Count + view toggle row */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <span className="text-sm font-mono text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-4 w-16 inline-block" />
              ) : isSearchActive ? (
                <>
                  <span className="text-foreground font-semibold">
                    {filteredCount}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    / {totalCount} NFTs
                  </span>
                </>
              ) : (
                <>
                  <span className="text-foreground font-semibold">
                    {totalCount}
                  </span>{" "}
                  {totalCount === 1 ? "item" : "items"}
                </>
              )}
            </span>
            {!isLoading && totalCount > 0 && !isSearchActive && (
              <Badge variant="secondary" className="text-xs">
                All Works
              </Badge>
            )}

            {/* View toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
                data-ocid="gallery.grid_toggle"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List view"
                data-ocid="gallery.list_toggle"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <section className="px-6 md:px-10 py-8" data-ocid="gallery.section">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              }
              data-ocid="gallery.loading_state"
            >
              {SKELETON_KEYS.map((k) => (
                <div key={k} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </motion.div>
          ) : !nfts?.length ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="gallery.empty_state"
            >
              <div className="relative mb-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(var(--primary) / 0.15) 0%, transparent 70%)",
                    border: "1px solid oklch(var(--primary) / 0.3)",
                  }}
                >
                  <ImageOff className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-foreground mb-2">
                No Artworks Yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                The gallery is waiting for its first masterpiece. Be the first
                to mint an NFT and claim your place in this collection.
              </p>
              {isLoggedIn ? (
                <Button asChild data-ocid="gallery.mint_cta_button">
                  <Link to="/mint">Mint Your First NFT</Link>
                </Button>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Button
                    onClick={login}
                    data-ocid="gallery.empty_login_button"
                  >
                    Connect to Mint
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Login with Internet Identity to get started
                  </p>
                </div>
              )}
            </motion.div>
          ) : isSearchActive && filteredCount === 0 ? (
            <motion.div
              key="search-empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="gallery.search_empty_state"
            >
              <div className="relative mb-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(var(--accent) / 0.12) 0%, transparent 70%)",
                    border: "1px solid oklch(var(--accent) / 0.3)",
                  }}
                >
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-foreground mb-2">
                لا توجد NFTs لهذا المالك
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                No NFTs found for owner matching{" "}
                <span className="font-mono text-foreground break-all">
                  &ldquo;{trimmed}&rdquo;
                </span>
                .
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                data-ocid="gallery.search_clear_link"
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              }
              data-ocid="gallery.list"
            >
              {filtered.map((nft, i) => (
                <NFTCard key={nft.id.toString()} nft={nft} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
