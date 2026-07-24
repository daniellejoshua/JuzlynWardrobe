"use client";

import { memo } from "react";
import { Outfit } from "@/data/demo-outfits";
import { OutfitCard } from "./outfit-card";

interface OutfitGridProps {
  outfits: Outfit[];
  selectedId?: string;
  onSelectOutfit?: (outfit: Outfit) => void;
  maxItems?: number;
  columns?: 3 | 5;
  selectedIds?: Set<string>;
  onToggle?: (id: string) => void;
}

export const OutfitGrid = memo(function OutfitGrid({
  outfits,
  selectedId,
  onSelectOutfit,
  maxItems = 10,
  columns = 5,
  selectedIds,
  onToggle,
}: OutfitGridProps) {
  const displayedOutfits = outfits.slice(0, maxItems);

  const gridCols =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

  return (
    <div className="w-full">
      <div className={`grid ${gridCols} gap-4 md:gap-6`}>
        {displayedOutfits.map((outfit, index) => (
          <OutfitCard
            key={outfit.id}
            outfit={outfit}
            isSelected={selectedIds ? selectedIds.has(outfit.id) : selectedId === outfit.id}
            onClick={() => onToggle ? onToggle(outfit.id) : onSelectOutfit?.(outfit)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
});
