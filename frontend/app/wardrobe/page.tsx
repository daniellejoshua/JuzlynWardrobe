"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { OutfitCard } from "@/components/outfit-card";
import { NavBar } from "@/components/nav-bar";
import { FilterBar } from "@/components/filter-bar";
import { Outfit } from "@/data/demo-outfits";
import { getOutfits, generateCombinations, getModels, tryOnCombo } from "@/lib/api";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Model {
  id: string;
  name: string;
  version: string | null;
  storage_path: string;
  file_size: number;
  uploaded_at: string;
}
const OUTFITS_PER_PAGE = 6;

interface GeneratedCombo {
  id: string;
  name: string;
  description: string;
  items: Outfit[];
}

type ComboTheme = { name: string; desc: string };

const themeMap: Record<string, ComboTheme[]> = {
  business: [
    { name: "The Boardroom", desc: "Sharp and polished for important meetings." },
    { name: "9 to 5 Refined", desc: "Professional comfort that lasts all day." },
    { name: "Power Lunch", desc: "Confident and commanding without trying too hard." },
  ],
  casual: [
    { name: "Weekend Ease", desc: "Relaxed layers for doing absolutely nothing." },
    { name: "Street Ready", desc: "Bold enough for the sidewalk, easy enough for coffee." },
    { name: "Errand Run", desc: "Comfortable, quick, and still looking good." },
  ],
  formal: [
    { name: "Evening Elegance", desc: "Sophisticated and timeless for a night out." },
    { name: "Date Night", desc: "Polished charm that does the talking." },
    { name: "Black Tie Adjacent", desc: "Formal enough to impress, relaxed enough to enjoy." },
  ],
};

const defaultThemes: ComboTheme[] = [
  { name: "Smart Casual", desc: "A clean balance of comfort and style." },
  { name: "Day to Night", desc: "Transitions effortlessly from desk to dinner." },
  { name: "Weekend Mix", desc: "Laid-back pieces that still feel intentional." },
];

function getThemes(selected: Outfit[]): ComboTheme[] {
  const counts: Record<string, number> = {};
  for (const o of selected) {
    if (o.occasion) {
      counts[o.occasion] = (counts[o.occasion] || 0) + 1;
    }
  }
  let best = "";
  let bestCount = 0;
  for (const [occ, count] of Object.entries(counts)) {
    if (count > bestCount) {
      best = occ;
      bestCount = count;
    }
  }
  return themeMap[best] || defaultThemes;
}

function simulateCombinations(
  selectedIds: string[],
  allOutfits: Outfit[],
): GeneratedCombo[] {
  const selected = allOutfits.filter((o) => selectedIds.includes(o.id));
  const pool = allOutfits.filter((o) => !selectedIds.includes(o.id));
  const themes = getThemes(selected);

  const usedInPool = new Set<string>();

  return themes.map((theme, i) => {
    const items = [...selected];
    const needed = Math.max(0, 3 - items.length);

    if (needed > 0) {
      const occasion = selected[0]?.occasion || "casual";

      const compatible = pool.filter(
        (o) =>
          !usedInPool.has(o.id) &&
          o.occasion === occasion,
      );

      const fallback = pool.filter((o) => !usedInPool.has(o.id));

      for (let j = 0; j < needed; j++) {
        const source = compatible[j] || fallback[j] || pool[j % pool.length];
        if (source && !usedInPool.has(source.id)) {
          items.push(source);
          usedInPool.add(source.id);
        }
      }
    }

    return {
      id: `combo-${i}`,
      name: theme.name,
      description: theme.desc,
      items,
    };
  });
}

export default function WardrobePage() {
  const [allOutfits, setAllOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [combinations, setCombinations] = useState<GeneratedCombo[] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [currentComboIndex, setCurrentComboIndex] = useState(0);

  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnResults, setTryOnResults] = useState<Record<number, string>>({});
  const [directTryOnLoading, setDirectTryOnLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [selectedClothingType, setSelectedClothingType] = useState("All");
  const [selectedColor, setSelectedColor] = useState("");


useEffect(() => {
  getOutfits()
    .then((data) => setAllOutfits(data.outfits))
    .catch(() => {})
    .finally(() => setLoading(false));
  getModels()
    .then((data) => setModels(data.models || data))
    .catch(() => {})
    .finally(() => setModelsLoading(false));
}, []);




  const [outfitPage, setOutfitPage] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);

  const resetPage = useCallback(() => setOutfitPage(0), []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    resetPage();
  }, [resetPage]);

  const handleOccasionChange = useCallback((value: string) => {
    setSelectedOccasion(value);
    resetPage();
  }, [resetPage]);

  const handleClothingTypeChange = useCallback((value: string) => {
    setSelectedClothingType(value);
    resetPage();
  }, [resetPage]);

  const handleColorChange = useCallback((value: string) => {
    setSelectedColor(value);
    resetPage();
  }, [resetPage]);

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
  }, [searchQuery, selectedOccasion, selectedClothingType, selectedColor,allOutfits]);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(filteredOutfits.length / OUTFITS_PER_PAGE)),
    [filteredOutfits.length],
  );

  const paginatedOutfits = useMemo(
    () =>
      filteredOutfits.slice(
        outfitPage * OUTFITS_PER_PAGE,
        (outfitPage + 1) * OUTFITS_PER_PAGE,
      ),
    [filteredOutfits, outfitPage],
  );

  useEffect(() => {
    if (outfitPage >= pageCount) {
      setOutfitPage(Math.max(0, pageCount - 1));
    }
  }, [outfitPage, pageCount]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setCombinations(null);
  }, []);

  const removeSelection = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    setCombinations(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setCombinations(null);
  }, []);

const handleGenerate = useCallback(async()=>{
  Object.values(tryOnResults).forEach(URL.revokeObjectURL);
  setTryOnResults({});
  setGenLoading(true);
  try{
    const data = await generateCombinations(selectedIds, selectedModelId ?? undefined)
    const result: GeneratedCombo[] = data.combinations.map(
        (combo: { name: string; description: string; items: number[] }, i: number) => ({
          id: `combo-${i}`,
          name: combo.name,
          description: combo.description,
          items: combo.items
            .map((idx: number) => allOutfits[idx])
            .filter(Boolean),
        }),
      );
      setCombinations(result)
      setCurrentComboIndex(0)
      setShowResults(true)
  }
  catch{

  }
  finally{
    setGenLoading(false)
  }

},[selectedIds,selectedModelId,allOutfits,tryOnResults])



  const handleTryOn = useCallback(async () => {
    if (!selectedModelId || currentComboIndex === undefined) return;
    const model = models.find((m) => m.id === selectedModelId);
    if (!model) return;
    setTryOnLoading(true);
    try {
      const combo = combinations![currentComboIndex];
      const outfitIds = combo.items.map((item) => item.id);
      const blob = await tryOnCombo(model.storage_path, outfitIds);
      const url = URL.createObjectURL(blob);
      setTryOnResults((prev) => ({ ...prev, [currentComboIndex]: url }));
    } catch {
      // silent
    } finally {
      setTryOnLoading(false);
    }
  }, [selectedModelId, models, combinations, currentComboIndex]);

  const handleDirectTryOn = useCallback(async () => {
    if (!selectedModelId || selectedIds.length === 0) return;
    const model = models.find((m) => m.id === selectedModelId);
    if (!model) return;
    setDirectTryOnLoading(true);
    try {
      const blob = await tryOnCombo(model.storage_path, selectedIds);
      const url = URL.createObjectURL(blob);
      setFullscreenImage(url);
    } catch {
      // silent
    } finally {
      setDirectTryOnLoading(false);
    }
  }, [selectedModelId, models, selectedIds]);



  const closeResults = useCallback(() => {
    setShowResults(false);
    Object.values(tryOnResults).forEach(URL.revokeObjectURL);
    setTryOnResults({});
  }, [tryOnResults]);

  const handlePrevCombo = useCallback(() => {
    setCurrentComboIndex((p) => Math.max(0, p - 1));
  }, []);

  const handleNextCombo = useCallback(() => {
    setCurrentComboIndex((p) => Math.min(combinations ? combinations.length - 1 : 0, p + 1));
  }, [combinations]);

  const handlePrevPage = useCallback(() => {
    setOutfitPage((p) => Math.max(0, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setOutfitPage((p) => Math.min(pageCount - 1, p + 1));
  }, [pageCount]);

  const closeFullscreen = useCallback(() => {
    setFullscreenImage((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreenImage) closeFullscreen();
        else closeResults();
      }
    };
    if (showResults || fullscreenImage) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showResults, closeResults, fullscreenImage, closeFullscreen]);

  useEffect(() => {
    return () => {
      Object.values(tryOnResults).forEach(URL.revokeObjectURL);
    };
  }, [tryOnResults]);

  const selectionCount = selectedIds.length;
  const anyLoading = genLoading || directTryOnLoading;
  const canGenerate = selectionCount > 0 && selectedModelId !== null && !anyLoading;
  const currentCombo = combinations?.[currentComboIndex];

  const CLOTHING_KIND: Record<string, string> = {
    Top: "top",
    Jacket: "top",
    Outerwear: "top",
    Dress: "top",
    Bottom: "bottom",
  };
  const selectedKinds = selectedIds
    .map((id) => allOutfits.find((o) => o.id === id))
    .filter(Boolean)
    .map((o) => CLOTHING_KIND[o!.clothing_type])
    .filter(Boolean);
  const topCount = selectedKinds.filter((k) => k === "top").length;
  const bottomCount = selectedKinds.filter((k) => k === "bottom").length;
  const canDirectTryOn = canGenerate && selectedIds.length <= 2 && !(topCount >= 2 || bottomCount >= 2);

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-y-auto">
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

      <NavBar currentPage="wardrobe" />

      <div className="relative z-10 px-6 py-6 md:px-12 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
            Style Consultant
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Select outfits and a model photo, then generate combination suggestions.
          </p>
        </motion.div>

        {/* Side-by-side layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ─── LEFT PANEL: Filters + Paginated Outfits ─── */}
          <div className="lg:w-2/5 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              <FilterBar
                searchQuery={searchQuery}
                selectedOccasion={selectedOccasion}
                selectedClothingType={selectedClothingType}
                selectedColor={selectedColor}
                outfitCount={filteredOutfits.length}
                onSearchChange={handleSearchChange}
                onOccasionChange={handleOccasionChange}
                onClothingTypeChange={handleClothingTypeChange}
                onColorChange={handleColorChange}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
                <div className="grid grid-cols-2 gap-3">
                {loading ? (
                  <div className="col-span-2 text-center py-8">
                    <LoadingSpinner message="Loading outfits..." />
                  </div>
                ) : (
                  paginatedOutfits.map((outfit) => {
                    const isSelected = selectedIds.includes(outfit.id);
                    return (
                      <OutfitCard
                        key={outfit.id}
                        outfit={outfit}
                        compact
                        isSelected={isSelected}
                        showRemoveButton={isSelected}
                        onRemove={() => removeSelection(outfit.id)}
                        onClick={() => toggleSelection(outfit.id)}
                        index={0}
                      />
                    );
                  })
                )}
              </div>
            </motion.div>

            {/* Outfit pagination */}
            <div className="flex items-center justify-center gap-4 pb-2">
              <button
                onClick={handlePrevPage}
                disabled={outfitPage === 0}
                className="text-xs text-white/40 hover:text-white/70 transition-colors disabled:opacity-20 disabled:pointer-events-none"
              >
                ← Prev
              </button>
              <span className="text-xs text-white/40">
                Page {outfitPage + 1} of {pageCount}
              </span>
              <button
                onClick={handleNextPage}
                disabled={outfitPage === pageCount - 1}
                className="text-xs text-white/40 hover:text-white/70 transition-colors disabled:opacity-20 disabled:pointer-events-none"
              >
                Next →
              </button>
            </div>
          </div>

          {/* ─── RIGHT PANEL: Selection + Model ─── */}
          <div className="lg:w-3/5 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4"
            >
              {/* Selected Outfits */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/60">
                  {selectionCount === 0
                    ? "Nothing selected"
                    : `Selected (${selectionCount})`}
                </span>
                {selectionCount > 0 && (
                  <button
                    onClick={clearSelection}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {selectionCount > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedIds.map((id) => {
                    const outfit = allOutfits.find((o) => o.id === id);
                    if (!outfit) return null;
                    return (
                      <div key={id} className="w-24">
                        <OutfitCard
                          outfit={outfit}
                          compact
                          showRemoveButton
                          onRemove={() => removeSelection(id)}
                          onClick={() => toggleSelection(id)}
                          index={0}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-white/30 mb-3">
                  Click outfits on the left to build your selection.
                </p>
              )}

              {/* ── Model Selector ── */}
              <div className="border-t border-white/10 pt-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/60">
                    {selectedModelId ? "Model" : "Select a model"}
                  </span>
                  {selectedModelId && (
                    <button
                      onClick={() => setSelectedModelId(null)}
                      className="text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {modelsLoading ? (
                  <LoadingSpinner size="sm" message="Loading models..." />
                ) : models.length === 0 ? (
                  <p className="text-xs text-white/30">
                    No models yet.{" "}
                    <a href="/models" className="text-accent hover:underline">
                      Upload a person photo
                    </a>
                  </p>
                ) : (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {models.map((model) => {
                      const isSelected = selectedModelId === model.id;
                      const imgUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
                        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/model-photos/${model.storage_path}`
                        : "";
                      return (
                        <button
                          key={model.id}
                          onClick={() => setSelectedModelId(isSelected ? null : model.id)}
                          className={`flex-shrink-0 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                            isSelected
                              ? "border-white ring-1 ring-white/20"
                              : "border-transparent hover:border-white/30"
                          }`}
                        >
                          <div className="relative aspect-[3/4]">
                            <Image
                              src={imgUrl}
                              alt={model.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {isSelected && (
                            <div className="py-1 text-[10px] text-white font-medium text-center bg-white/10 truncate">
                              {model.name}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                    canGenerate
                      ? "bg-white text-background hover:bg-white/90"
                      : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                  }`}
                >
                  {!selectedModelId
                    ? "Select a model and outfits to begin"
                    : selectionCount === 0
                      ? "Select outfits to continue"
                      : `Generate ${selectionCount > 1 ? "Combinations" : "a Combination"}`}
                </button>

                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">or</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                  onClick={handleDirectTryOn}
                  disabled={!canDirectTryOn}
                  className={`w-full py-2 rounded-lg text-xs font-medium transition-all border ${
                    !canDirectTryOn
                      ? "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                      : "border-white/15 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/30"
                  }`}
                >
                  {directTryOnLoading
                    ? "Running try-on..."
                    : genLoading
                      ? "Wait for generation..."
                      : topCount >= 2 || bottomCount >= 2
                        ? "Select one top + one bottom"
                        : selectedIds.length === 1
                          ? "Try On Selected"
                          : selectedIds.length === 2
                            ? "Try On Combo"
                            : "Select items to try on"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── RESULTS DIALOG ─── */}
      <AnimatePresence>
        {showResults && combinations && currentCombo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeResults}
            />
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-xl rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
            >
              {/* Dialog header */}
              <div className="flex items-center justify-between px-3 pt-3 pb-1">
                <span className="text-[11px] text-white/40">
                  {currentComboIndex + 1} / {combinations.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevCombo}
                    disabled={currentComboIndex === 0}
                    className="text-[11px] text-white/40 hover:text-white/70 transition-colors disabled:opacity-20 disabled:pointer-events-none"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={handleNextCombo}
                    disabled={currentComboIndex === combinations.length - 1}
                    className="text-[11px] text-white/40 hover:text-white/70 transition-colors disabled:opacity-20 disabled:pointer-events-none"
                  >
                    Next →
                  </button>
                  <button
                    onClick={closeResults}
                    className="ml-1 text-white/30 hover:text-white/70 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dialog body */}
              <div className="flex flex-col md:flex-row">
                {/* Hero image */}
                <div
                  className="md:w-1/2 relative h-48 md:h-72 cursor-pointer bg-zinc-900/60"
                  onClick={() => {
                    if (tryOnResults[currentComboIndex]) {
                      setFullscreenImage(tryOnResults[currentComboIndex]);
                    }
                  }}
                >
                  {tryOnResults[currentComboIndex] && (
                    <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </div>
                  )}
                  <Image
                    src={tryOnResults[currentComboIndex] || currentCombo.items[0].image_url}
                    alt={currentCombo.name}
                    fill
                    className={tryOnResults[currentComboIndex] ? "object-contain" : "object-cover"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="text-sm font-serif font-bold text-white mb-0.5">
                      {currentCombo.name}
                    </h4>
                    <p className="text-[10px] text-white/60 leading-relaxed">
                      {currentCombo.description}
                    </p>
                  </div>

                  {/* Try-on loading overlay */}
                  {tryOnLoading && (
                    <LoadingSpinner variant="overlay" message="Applying..." />
                  )}
                </div>

                {/* Items needed */}
                <div className="md:w-1/2 p-3">
                  <span className="text-[9px] font-semibold text-white/30 uppercase tracking-wider mb-2 block">
                    Items Needed
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {currentCombo.items.map((item) => (
                      <OutfitCard
                        key={item.id}
                        outfit={item}
                        compact
                        index={0}
                      />
                    ))}
                  </div>

                  {/* Try-on button */}
                  <button
                    onClick={handleTryOn}
                    disabled={tryOnLoading}
                    className={`w-full mt-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      tryOnLoading
                        ? "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                        : tryOnResults[currentComboIndex]
                          ? "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20"
                          : "bg-white text-background hover:bg-white/90"
                    }`}
                  >
                    {tryOnLoading
                      ? "Applying..."
                      : tryOnResults[currentComboIndex]
                        ? "Try-on applied"
                        : "Try On This Look"}
                  </button>

                  {/* Regenerate */}
                  <div className="flex justify-center mt-2 pt-2 border-t border-white/10">
                    <button
                      onClick={handleGenerate}
                      className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── GENERATING OVERLAY ─── */}
      <AnimatePresence>
        {genLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSpinner variant="fullscreen" message="Generating combinations..." />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DIRECT TRY-ON OVERLAY ─── */}
      <AnimatePresence>
        {directTryOnLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSpinner variant="fullscreen" message="Running try-on..." />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FULLSCREEN IMAGE VIEWER ─── */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeFullscreen}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl"
              style={{ height: "85vh" }}
            >
              <img
                src={fullscreenImage}
                alt="Try-on result"
                className="w-full h-full object-contain rounded-xl"
              />
              <button
                onClick={closeFullscreen}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 md:px-12 py-8 md:py-10 text-white/40 text-xs mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p>&copy; 2026 Your Wardrobe with Juzlyn. AI Fashion Styling Assistant.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </motion.div>
      </footer>
    </main>
  );
}
