"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Outfit } from "@/data/demo-outfits";

interface OutfitCardProps {
  outfit: Outfit;
  onClick?: () => void;
  isSelected?: boolean;
  index?: number;
}

export function OutfitCard({
  outfit,
  onClick,
  isSelected = false,
  index = 0,
}: OutfitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected ? "ring-2 ring-accent" : ""
      }`}
    >
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

      {/* Image */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={outfit.image}
          alt={outfit.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 z-20">
        {/* Top tags */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80">
            {outfit.occasion}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 text-accent">
            {outfit.season}
          </span>
        </div>

        {/* Bottom info */}
        <div className="space-y-2">
          <h3 className="text-lg font-serif font-bold text-white leading-tight group-hover:text-accent transition-colors">
            {outfit.name}
          </h3>
          <p className="text-xs text-white/60 line-clamp-2">
            {outfit.description}
          </p>

          {/* Color palette */}
          <div className="flex gap-2 pt-2">
            {outfit.colors.map((color, idx) => (
              <div
                key={idx}
                className="w-3 h-3 rounded-full border border-white/30"
                style={{
                  backgroundColor: getColorCode(color),
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hover effect - glassmorphic border */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/30 transition-all duration-300 z-[5]" />
    </motion.div>
  );
}

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
