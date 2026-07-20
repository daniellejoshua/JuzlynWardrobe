"use client";

import { motion } from "framer-motion";

export interface Favorite {
  id: string;
  image_url: string;
  storage_path: string;
  combo_name?: string;
  combo_description?: string;
  created_at: string;
  outfit_ids: number[];
  outfits?: Array<{
    id: number;
    image_url: string;
    clothing_type: string;
    name?: string;
  }>;
}

interface FavoriteCardProps {
  favorite: Favorite;
  index?: number;
  isSelected?: boolean;
  onToggle?: (id: string) => void;
}

const clothingTypeLabels: Record<string, string> = {
  tops: "Top",
  bottoms: "Bottom",
  shoes: "Shoes",
  dress: "Dress",
  outerwear: "Outerwear",
  accessories: "Accessory",
};

export function FavoriteCard({ favorite, index = 0, isSelected, onToggle }: FavoriteCardProps) {
  const date = new Date(favorite.created_at).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      viewport={{ once: true }}
      className={`group relative rounded-2xl overflow-hidden bg-zinc-900/60 border transition-all duration-300 ${
        isSelected ? "border-red-500/60 ring-1 ring-red-500/40" : "border-white/10 hover:border-white/30"
      }`}
    >
      {/* Try-on result image */}
      <div className="relative w-full aspect-[3/4]">
        <img
          src={favorite.image_url}
          alt={favorite.combo_name || "Try-on result"}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none z-10" />
      </div>

      {/* Heart toggle */}
      {onToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(favorite.id);
          }}
          className="absolute top-2.5 right-2.5 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 transition-all ${
              isSelected ? "fill-none text-white/70" : "fill-red-500 text-red-500 scale-110"
            }`}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      )}

      {/* Overlay info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
        {favorite.combo_name && (
          <h3 className="font-serif font-bold text-white text-sm leading-tight">
            {favorite.combo_name}
          </h3>
        )}
        {favorite.combo_description && (
          <p className="text-[10px] text-white/50 line-clamp-1 leading-relaxed mt-0.5">
            {favorite.combo_description}
          </p>
        )}

        {/* Outfit pieces */}
        {favorite.outfits && favorite.outfits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {favorite.outfits.slice(0, 4).map((outfit) => (
              <div key={outfit.id} className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-md overflow-hidden border border-white/10 shrink-0">
                  <img
                    src={outfit.image_url}
                    alt={outfit.clothing_type}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[8px] text-white/40 uppercase tracking-wider">
                  {outfit.name || clothingTypeLabels[outfit.clothing_type] || outfit.clothing_type}
                </span>
              </div>
            ))}
            {favorite.outfits.length > 4 && (
              <div className="flex items-center text-[8px] text-white/30">
                +{favorite.outfits.length - 4}
              </div>
            )}
          </div>
        )}

        <p className="text-[7px] text-white/25 mt-1">{date}</p>
      </div>
    </motion.div>
  );
}
