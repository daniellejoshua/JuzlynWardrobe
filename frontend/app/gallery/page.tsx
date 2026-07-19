"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { NavBar } from "@/components/nav-bar";
import { FavoriteCard } from "@/components/favorite-card";
import { useFavorites } from "@/components/use-queries";
import { LoadingSpinner } from "@/components/loading-spinner";
export default function FavoritesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useFavorites(page)
  const favorites = data?.favorites ?? []
  const hasMore = data?.has_more ?? false

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
      <div className="relative z-10 px-6 py-6 md:px-10 md:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">
            Your Favorites
          </h2>
          <p className="text-white/60 text-sm">
            Curated outfits and styling combinations from Juzlyn
          </p>
        </motion.div>

        {/* Loading state */}
        {isLoading ? (
          <div className="py-20">
            <LoadingSpinner message="Loading favorites..." />
          </div>
        ) : favorites.length === 0 ? (
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
              <button className="px-8 py-3 rounded-lg bg-white hover:bg-white/90 text-background font-medium transition-colors">
                Go to Style Consultant
              </button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Favorites Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {favorites.map((fav, index) => (
                <FavoriteCard key={fav.id} favorite={fav} index={index} />
              ))}
            </div>
            {(hasMore || page > 1) && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors disabled:opacity-20 disabled:pointer-events-none"
                >
                  ← Prev
                </button>
                <span className="text-xs text-white/40">Page {page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors disabled:opacity-20 disabled:pointer-events-none"
                >
                  Next →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 md:px-16 py-8 md:py-10 text-white/40 text-xs mt-10">
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
