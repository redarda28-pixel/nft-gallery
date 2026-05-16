import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { NFT } from "@/types/nft";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

interface NFTCardProps {
  nft: NFT;
  index?: number;
  showActions?: boolean;
  onDelete?: (id: bigint) => void;
}

export function NFTCard({
  nft,
  index = 0,
  showActions = false,
  onDelete,
}: NFTCardProps) {
  const ownerStr = nft.owner.toString();
  const ownerShort = `${ownerStr.slice(0, 5)}...${ownerStr.slice(-4)}`;
  const imageUrl = nft.imageKey.getDirectURL();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card
        className="group overflow-hidden border-frame shadow-frame bg-card hover:shadow-gallery transition-smooth cursor-pointer"
        data-ocid={`nft.item.${index + 1}`}
      >
        <Link
          to="/nft/$id"
          params={{ id: nft.id.toString() }}
          className="block"
        >
          <div className="relative overflow-hidden aspect-square bg-muted">
            <img
              src={imageUrl}
              alt={nft.title}
              className="w-full h-full object-cover transition-smooth group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
          </div>
        </Link>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link
              to="/nft/$id"
              params={{ id: nft.id.toString() }}
              className="block min-w-0"
            >
              <p className="font-display font-semibold text-sm uppercase tracking-wider text-foreground truncate group-hover:text-primary transition-colors">
                {nft.title}
              </p>
            </Link>
            <Badge variant="secondary" className="text-xs shrink-0 font-mono">
              #{nft.id.toString()}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground font-mono truncate">
            {ownerShort}
          </p>

          {showActions && onDelete && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onDelete(nft.id)}
                className="text-xs text-destructive hover:text-destructive/80 transition-colors"
                data-ocid="nft.delete_button"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
