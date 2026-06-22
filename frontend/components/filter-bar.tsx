"use client";

import { memo, useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const occasions = ["All", "Casual", "Business", "Formal"];
const seasons = ["All", "Summer", "Fall", "Winter", "Spring"];
const clothingTypes = [
  "All",
  "Top",
  "Bottom",
  "Dress",
  "Jacket",
  "Shoes",
  "Accessory",
  "Outerwear",
];

const colorPalette: { name: string; hex: string }[] = [
  { name: "navy", hex: "#001f3f" },
  { name: "white", hex: "#ffffff" },
  { name: "cream", hex: "#fffdd0" },
  { name: "beige", hex: "#f5f5dc" },
  { name: "black", hex: "#000000" },
  { name: "gold", hex: "#ffd700" },
  { name: "grey", hex: "#808080" },
  { name: "denim", hex: "#1f3a93" },
  { name: "burgundy", hex: "#800020" },
  { name: "brown", hex: "#8b4513" },
  { name: "mustard", hex: "#ffdb58" },
  { name: "charcoal", hex: "#36454f" },
  { name: "red", hex: "#ff0000" },
];

interface FilterBarProps {
  searchQuery: string;
  selectedOccasion: string;
  selectedSeason: string;
  selectedClothingType: string;
  selectedColor: string;
  outfitCount: number;
  onSearchChange: (value: string) => void;
  onOccasionChange: (value: string) => void;
  onSeasonChange: (value: string) => void;
  onClothingTypeChange: (value: string) => void;
  onColorChange: (value: string) => void;
}

function useDropdownPosition(btnRef: React.RefObject<HTMLButtonElement | null>, open: boolean) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const recalc = useCallback(() => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, [btnRef]);

  useEffect(() => {
    if (!open) return;
    recalc();
    window.addEventListener("scroll", recalc, true);
    window.addEventListener("resize", recalc);
    return () => {
      window.removeEventListener("scroll", recalc, true);
      window.removeEventListener("resize", recalc);
    };
  }, [open, recalc]);

  useEffect(() => {
    if (!open) return;
    const observer = new ResizeObserver(recalc);
    if (btnRef.current) observer.observe(btnRef.current);
    return () => observer.disconnect();
  }, [open, btnRef, recalc]);

  return pos;
}

function FilterDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pos = useDropdownPosition(btnRef, open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        btnRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
          selected !== "All"
            ? "bg-white/10 text-white border border-white/20"
            : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10"
        }`}
      >
        {selected === "All" ? label : selected}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && mounted && createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: 160,
            }}
            className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-xl z-[9999]"
          >
            <div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                    selected === opt
                      ? "text-white bg-white/10"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function ColorDropdown({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pos = useDropdownPosition(btnRef, open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        btnRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const selectedSwatch = colorPalette.find((c) => c.name === selected);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
          selected
            ? "bg-white/10 text-white border border-white/20"
            : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10"
        }`}
      >
        {selectedSwatch ? (
          <>
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedSwatch.hex }}
            />
            {selectedSwatch.name.charAt(0).toUpperCase() + selectedSwatch.name.slice(1)}
          </>
        ) : (
          "Color"
        )}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && mounted && createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: 180,
            }}
            className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-xl z-[9999]"
          >
            <div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              <button
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                  !selected
                    ? "text-white bg-white/10"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                All
              </button>
              {colorPalette.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    onChange(selected === c.name ? "" : c.name);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                    selected === c.name
                      ? "text-white bg-white/10"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export const FilterBar = memo(function FilterBar({
  searchQuery,
  selectedOccasion,
  selectedSeason,
  selectedClothingType,
  selectedColor,
  outfitCount,
  onSearchChange,
  onOccasionChange,
  onSeasonChange,
  onClothingTypeChange,
  onColorChange,
}: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search outfits..."
            className="w-full pl-8 pr-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:border-accent/50 transition-all"
          />
        </div>
        <span className="text-xs text-white/40 whitespace-nowrap tabular-nums">
          {outfitCount}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Occasion"
          options={occasions}
          selected={selectedOccasion}
          onChange={onOccasionChange}
        />
        <FilterDropdown
          label="Season"
          options={seasons}
          selected={selectedSeason}
          onChange={onSeasonChange}
        />
        <FilterDropdown
          label="Type"
          options={clothingTypes}
          selected={selectedClothingType}
          onChange={onClothingTypeChange}
        />
        <ColorDropdown selected={selectedColor} onChange={onColorChange} />
      </div>
    </motion.div>
  );
});
