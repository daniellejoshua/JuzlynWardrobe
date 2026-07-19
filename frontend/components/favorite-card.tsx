"use client";

import { motion } from "framer-motion";

interface Favorite {
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
}

export function FavoriteCard({ favorite, index = 0 }: FavoriteCardProps) {
  const date = new Date(favorite.created_at).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/10 hover:border-white/30 transition-all duration-300"
    >
      {/* Try-on result image */}
      <div className="relative w-full aspect-[3/4]">
        <img
          src={favorite.image_url}
          alt={favorite.combo_name || "Try-on result"}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10" />
      </div>

      {/* Overlay info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-3 space-y-1.5">
        {favorite.combo_name && (
          <h3 className="font-serif font-bold text-white text-sm leading-tight">
            {favorite.combo_name}
          </h3>
        )}
        {favorite.combo_description && (
          <p className="text-[10px] text-white/60 line-clamp-1">
            {favorite.combo_description}
          </p>
        )}

        {/* Outfit thumbnails */}
        {favorite.outfits && favorite.outfits.length > 0 && (
          <div className="flex gap-1 pt-0.5">
            {favorite.outfits.slice(0, 4).map((outfit) => (
              <div
                key={outfit.id}
                className="relative w-7 h-7 rounded-md overflow-hidden border border-white/20"
              >
                <img
                  src={outfit.image_url}
                  alt={outfit.clothing_type}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {favorite.outfits.length > 4 && (
              <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-[8px] text-white/40">
                +{favorite.outfits.length - 4}
              </div>
            )}
          </div>
        )}

        <p className="text-[8px] text-white/30">{date}</p>
      </div>
    </motion.div>
  );
}
