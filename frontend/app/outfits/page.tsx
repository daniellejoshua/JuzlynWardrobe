"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import type { Outfit } from "@/data/demo-outfits";
import { OutfitGrid } from "@/components/outfit-grid";
import { FilterBar } from "@/components/filter-bar";
import { NavBar } from "@/components/nav-bar";
import { UploadDialog } from "@/components/upload-dialog";
import { useOutfits, useDeleteOutfits } from "@/components/use-queries";
import { toast } from "sonner"
import next from "next";
import { arrayBuffer } from "stream/consumers";
const PAGE_SIZE = 10;

export default function OutfitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [selectedClothingType, setSelectedClothingType] = useState("All");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const { data, isLoading, error } = useOutfits();
  const allOutfits: Outfit[] = data?.outfits ?? [];


  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showdeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteMutation = useDeleteOutfits()



  const toggleOutfit = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else
        next.add(id)
      return next
    })
  }


  const handleDelete = async () => {
    const ids = Array.from(selectedIds)
    try {
      await deleteMutation.mutateAsync(ids)
      setSelectedIds(new Set())
      setShowDeleteDialog(false)
      toast.success(`${ids.length} outfit ${ids.length !== 1 ? "s" : ""} deleted`)
    } catch {
      toast.error("Failed to Delete Outfits")
    }
  }






  const goToFirstPage = useCallback(() => setCurrentPage(1), []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      goToFirstPage();
    },
    [goToFirstPage],
  );

  const handleOccasionChange = useCallback(
    (value: string) => {
      setSelectedOccasion(value);
      goToFirstPage();
    },
    [goToFirstPage],
  );

  const handleClothingTypeChange = useCallback(
    (value: string) => {
      setSelectedClothingType(value);
      goToFirstPage();
    },
    [goToFirstPage],
  );

  const handleColorChange = useCallback(
    (value: string) => {
      setSelectedColor(value);
      goToFirstPage();
    },
    [goToFirstPage],
  );

  const filteredOutfits = useMemo(() => {
    return allOutfits.filter((outfit) => {
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        outfit.clothing_type.toLowerCase().includes(search) ||
        outfit.category.toLowerCase().includes(search) ||
        outfit.style_tags?.some((t) => t.toLowerCase().includes(search)) ||
        (outfit.occasion && outfit.occasion.toLowerCase().includes(search));

      const matchesOccasion =
        selectedOccasion === "All" ||
        outfit.occasion?.toLowerCase() === selectedOccasion.toLowerCase();

      const matchesClothingType =
        selectedClothingType === "All" ||
        outfit.clothing_type.toLowerCase() ===
        selectedClothingType.toLowerCase();

      const matchesColor =
        !selectedColor ||
        (outfit.primary_color &&
          outfit.primary_color
            .split(",")
            .map((c) => c.trim())
            .some((c) => c.toLowerCase() === selectedColor.toLowerCase()));

      return (
        matchesSearch &&
        matchesOccasion &&
        matchesClothingType &&
        matchesColor
      );
    });
  }, [searchQuery, selectedOccasion, selectedClothingType, selectedColor, allOutfits]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOutfits.length / PAGE_SIZE),
  );
  const paginatedOutfits = filteredOutfits.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handlePrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

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

      <div className="absolute inset-0 backdrop-blur-3xl" />

      <NavBar currentPage="outfits" />

      <div className="relative z-10 px-6 py-6 md:px-12 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-5"
        >
          <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
            All Outfits
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Browse your complete wardrobe collection
          </p>
        </motion.div>

        <div className="flex items-start gap-3 mb-6">
          <div className="flex-1 min-w-0">
            <FilterBar
              searchQuery={searchQuery}
              selectedOccasion={selectedOccasion}
              selectedClothingType={selectedClothingType}
              selectedColor={selectedColor}
              onSearchChange={handleSearchChange}
              onOccasionChange={handleOccasionChange}
              onClothingTypeChange={handleClothingTypeChange}
              onColorChange={handleColorChange}
            />
          </div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onClick={() => setShowUpload(true)}
            className="px-5 py-2.5 bg-white hover:bg-white/90 text-background font-medium rounded-lg text-sm transition-all shrink-0 mt-3"
          >
            + Add Outfit
          </motion.button>
        </div>

        <UploadDialog open={showUpload} onClose={() => setShowUpload(false)} />

        {/* Outfit grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-white/60">Loading outfits...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-red-400">Failed to load outfits</p>
            </motion.div>
          ) : paginatedOutfits.length > 0 ? (
            <>
              <OutfitGrid
                outfits={paginatedOutfits}
                columns={3}
              />
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${currentPage === page
                          ? "bg-white text-background"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-16"
            >
              <p className="text-white/60 text-base mb-1">
                No outfits match your filters
              </p>
              <p className="text-white/30 text-xs">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 md:px-12 py-8 md:py-10 text-white/40 text-xs mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p>
            &copy; 2026 Your Wardrobe with Juzlyn. AI Fashion Styling Assistant.
          </p>
          <div className="flex gap-6">
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
