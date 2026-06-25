"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { demoOutfits } from "@/data/demo-outfits";
import { OutfitGrid } from "@/components/outfit-grid";
import { NavBar } from "@/components/nav-bar";

export default function FavoritesPage() {
  // For demo, show all outfits as favorites
  const favoriteOutfits = demoOutfits;

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-y-auto">
      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(184, 134, 11, 0.2) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 70%, rgba(184, 134, 11, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(100, 150, 200, 0.1) 0%, transparent 60%),
            linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)
          `,
        }}
      />

      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <NavBar currentPage="gallery" />

      {/* Main content */}
      <div className="relative z-10 px-8 py-12 md:px-16 md:py-20 lg:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
            Your Favorites
          </h2>
          <p className="text-white/60 text-lg">
            Curated outfits and styling combinations from Juzlyn
          </p>
        </motion.div>

        {/* Favorites Grid - 5 columns x 2 rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <OutfitGrid outfits={favoriteOutfits} maxItems={10} />
        </motion.div>

        {/* Empty state message */}
        {favoriteOutfits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-20"
          >
            <p className="text-white/60 text-lg mb-6">
              No favorites saved yet. Start by selecting outfits in the Style
              Consultant.
            </p>
            <Link href="/wardrobe">
              <button className="px-8 py-3 rounded-lg bg-accent hover:bg-accent/90 text-background font-medium transition-colors">
                Go to Style Consultant
              </button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 md:px-16 py-12 md:py-16 text-white/40 text-sm mt-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <p>
            &copy; 2026 Your Wardrobe with Juzlyn. AI Fashion Styling Assistant.
          </p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-accent transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Pinterest
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Contact
            </a>
          </div>
        </motion.div>
      </footer>
    </main>
  );
}
