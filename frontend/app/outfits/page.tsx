"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { demoOutfits } from "@/data/demo-outfits";
import { OutfitGrid } from "@/components/outfit-grid";
import { FilterBar } from "@/components/filter-bar";
import { NavBar } from "@/components/nav-bar";

const PAGE_SIZE = 10;

export default function OutfitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedClothingType, setSelectedClothingType] = useState("All");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleSeasonChange = useCallback(
    (value: string) => {
      setSelectedSeason(value);
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
    return demoOutfits.filter((outfit) => {
      const matchesSearch =
        !searchQuery ||
        outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        outfit.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOccasion =
        selectedOccasion === "All" ||
        outfit.occasion.toLowerCase() === selectedOccasion.toLowerCase();

      const matchesSeason =
        selectedSeason === "All" ||
        outfit.season.toLowerCase() === selectedSeason.toLowerCase();

      const matchesClothingType =
        selectedClothingType === "All" ||
        outfit.clothingType.toLowerCase() ===
          selectedClothingType.toLowerCase();

      const matchesColor =
        !selectedColor ||
        outfit.colors.some(
          (c) => c.toLowerCase() === selectedColor.toLowerCase(),
        );

      return (
        matchesSearch &&
        matchesOccasion &&
        matchesSeason &&
        matchesClothingType &&
        matchesColor
      );
    });
  }, [
    searchQuery,
    selectedOccasion,
    selectedSeason,
    selectedClothingType,
    selectedColor,
  ]);

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

      {/* Navigation */}
      <NavBar currentPage="outfits" />

      {/* Main content */}
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

        {/* Filter bar (search always visible, filters collapsible) */}
        <div className="mb-6">
          <FilterBar
            searchQuery={searchQuery}
            selectedOccasion={selectedOccasion}
            selectedSeason={selectedSeason}
            selectedClothingType={selectedClothingType}
            selectedColor={selectedColor}
            outfitCount={filteredOutfits.length}
            onSearchChange={handleSearchChange}
            onOccasionChange={handleOccasionChange}
            onSeasonChange={handleSeasonChange}
            onClothingTypeChange={handleClothingTypeChange}
            onColorChange={handleColorChange}
          />
        </div>

        {/* Outfit grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {paginatedOutfits.length > 0 ? (
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
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                          currentPage === page
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
