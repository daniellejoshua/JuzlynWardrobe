"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { NavBar } from "@/components/nav-bar";
import { FavoriteCard, type Favorite } from "@/components/favorite-card";
import { useFavorites, useDeleteFavorite } from "@/components/use-queries";
import { LoadingSpinner } from "@/components/loading-spinner";
import { toast } from "sonner";

export default function FavoritesPage() {
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { data, isLoading } = useFavorites(page)
  const deleteMutation = useDeleteFavorite(page)
  const favorites: Favorite[] = data?.favorites ?? []
  const hasMore = data?.has_more ?? false

  useEffect(() => {
    if (showDeleteDialog) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showDeleteDialog]);

  const toggleFavorite = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDelete = async () => {
    const ids = Array.from(selectedIds)
    try {
      await deleteMutation.mutateAsync(ids)
      setSelectedIds(new Set())
      setShowDeleteDialog(false)
      toast.success(`${ids.length} favorite${ids.length !== 1 ? "s" : ""} deleted`)
    } catch {
      toast.error("Failed to delete favorites")
    }
  }

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

        {/* Delete selected toast (fixed bottom center) */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 px-5 py-3 rounded-2xl bg-zinc-900/90 backdrop-blur-lg border border-white/10 shadow-2xl"
            >
              <span className="text-sm text-white/70 whitespace-nowrap">
                {selectedIds.size} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs text-white/50 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-xs text-white px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <FavoriteCard
                  key={fav.id}
                  favorite={fav}
                  index={index}
                  isSelected={selectedIds.has(fav.id)}
                  onToggle={toggleFavorite}
                />
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

      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {showDeleteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteDialog(false)} />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                {/* Trash icon */}
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-white mb-1">
                    Delete Favorites
                  </h3>
                  <p className="text-sm text-white/60">
                    Are you sure you want to delete {selectedIds.size} favorite{selectedIds.size !== 1 ? "s" : ""}? This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => setShowDeleteDialog(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm text-white/70 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
