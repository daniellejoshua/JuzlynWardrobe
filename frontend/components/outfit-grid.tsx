"use client";

import { Outfit } from "@/data/demo-outfits";
import { OutfitCard } from "./outfit-card";

interface OutfitGridProps {
  outfits: Outfit[];
  selectedId?: string;
  onSelectOutfit?: (outfit: Outfit) => void;
  maxItems?: number;
}

export function OutfitGrid({
  outfits,
  selectedId,
  onSelectOutfit,
  maxItems = 10,
}: OutfitGridProps) {
  const displayedOutfits = outfits.slice(0, maxItems);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {displayedOutfits.map((outfit, index) => (
          <OutfitCard
            key={outfit.id}
            outfit={outfit}
            isSelected={selectedId === outfit.id}
            onClick={() => onSelectOutfit?.(outfit)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
