"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Outfit } from "@/data/demo-outfits";

interface OutfitCardProps {
  outfit: Outfit;
  onClick?: () => void;
  isSelected?: boolean;
  index?: number;
  compact?: boolean;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

export const OutfitCard = memo(function OutfitCard({
  outfit,
  onClick,
  isSelected = false,
  index = 0,
  compact = false,
  showRemoveButton = false,
  onRemove,
}: OutfitCardProps) {
  const colors = outfit.primary_color
    ? outfit.primary_color.split(",").map((c) => c.trim())
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected
          ? "ring-2 ring-white scale-[1.02]"
          : "hover:scale-[1.02]"
      }`}
    >
      {/* Selected badge - checkmark */}
      {isSelected && (
        <div className="absolute top-2 left-2 z-30 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-lg">
          <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Remove button */}
      {showRemoveButton && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 z-30 w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

      {/* Image */}
      <div className={`relative w-full overflow-hidden ${compact ? "h-36" : "h-56"}`}>
        <Image
          src={outfit.image_url}
          alt={outfit.clothing_type}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card content */}
      <div className={`absolute inset-0 flex flex-col justify-between z-20 ${compact ? "p-3" : "p-4"}`}>
        {/* Top tags */}
        {outfit.occasion && (
          <div className="flex gap-1.5 flex-wrap">
            <span className={`rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 ${compact ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1"}`}>
              {outfit.occasion}
            </span>
          </div>
        )}

        {/* Bottom info */}
        <div className={compact ? "space-y-1" : "space-y-2"}>
          <h3 className={`font-serif font-bold text-white leading-tight group-hover:text-accent transition-colors ${compact ? "text-sm" : "text-lg"}`}>
            {outfit.name}
          </h3>
          {!compact && (
            <p className="text-xs text-white/60 line-clamp-2">
              {outfit.category}
            </p>
          )}
          {/* Color palette */}
          {colors.length > 0 && (
            <div className="flex gap-1.5 pt-1">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className={`rounded-full border border-white/30 ${compact ? "w-2 h-2" : "w-3 h-3"}`}
                  style={{ backgroundColor: getColorCode(color) }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hover effect - glassmorphic border */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/30 transition-all duration-300 z-[5]" />
    </motion.div>
  );
});

function getColorCode(colorName: string): string {
  const colors: Record<string, string> = {
    navy: "#001f3f",
    white: "#ffffff",
    cream: "#fffdd0",
    beige: "#f5f5dc",
    black: "#000000",
    gold: "#ffd700",
    grey: "#808080",
    denim: "#1f3a93",
    burgundy: "#800020",
    brown: "#8b4513",
    mustard: "#ffdb58",
    charcoal: "#36454f",
    red: "#ff0000",
  };
  return colors[colorName.toLowerCase()] || "#cccccc";
}
