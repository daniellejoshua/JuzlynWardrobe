"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadOutfits } from "@/components/use-queries";

const clothingTypes = [
  "Top", "Bottom", "Dress", "Jacket", "Shoes", "Accessory", "Outerwear",
];

const occasions = ["Casual", "Business", "Formal"];

const categories = [
  "T-Shirt", "Blouse", "Shirt", "Sweater", "Tank Top", "Hoodie",
  "Jeans", "Trousers", "Shorts", "Skirt", "Leggings",
  "Mini Dress", "Midi Dress", "Maxi Dress",
  "Blazer", "Leather Jacket", "Denim Jacket", "Bomber", "Parka",
  "Sneakers", "Boots", "Sandals", "Heels", "Loafers",
  "Bag", "Scarf", "Belt", "Hat", "Sunglasses", "Watch",
  "Coat", "Trench", "Puffer", "Vest",
];

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
}

function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => { setMounted(true); }, []);

  const recalc = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  };

  useEffect(() => {
    if (!open) return;
    recalc();
    window.addEventListener("scroll", recalc, true);
    window.addEventListener("resize", recalc);
    return () => {
      window.removeEventListener("scroll", recalc, true);
      window.removeEventListener("resize", recalc);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !mounted) return;
    const handleClick = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node) || menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div>
      <label className="text-[10px] text-white/40 font-medium mb-1 block">{label}</label>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-1 px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-accent/50"
      >
        {value || label}
        <svg className={`w-3 h-3 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && mounted && createPortal(
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.12 }}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}
          className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-xl z-[9999]"
        >
          <div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                  value === opt
                    ? "text-white bg-white/10"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}

export function UploadDialog({ open, onClose }: UploadDialogProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [clothingType, setClothingType] = useState("Top");
  const [category, setCategory] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [occasion, setOccasion] = useState("");
  const [styleTags, setStyleTags] = useState("");
  const [customType, setCustomType] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);
  const [customOccasion, setCustomOccasion] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadOutfits();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("clothing_type", clothingType);
    fd.append("category", category || clothingType);
    if (name) fd.append("name", name);
    if (primaryColor) fd.append("primary_color", primaryColor);
    if (styleTags) fd.append("style_tags", styleTags);
    if (occasion) fd.append("occasion", occasion);

    uploadMutation.mutate(fd, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setName("");
    setClothingType("Top");
    setCategory("");
    setPrimaryColor("");
    setOccasion("");
    setStyleTags("");
    setCustomType(false);
    setCustomCategory(false);
    setCustomOccasion(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { reset(); onClose(); }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h2 className="text-base font-serif font-bold text-white">Upload Outfit</h2>
                <button
                  type="button"
                  onClick={() => { reset(); onClose(); }}
                  className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-0">
                {/* Left: Image */}
                <div className="md:w-1/2 relative h-48 md:h-96 bg-zinc-900/60">
                  {!preview ? (
                    <label className="block cursor-pointer w-full h-full">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/70 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="text-xs">Click to upload photo</span>
                      </div>
                    </label>
                  ) : (
                    <div className="relative w-full h-full">
                      <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => { setFile(null); setPreview(null); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white"
                      >
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Fields */}
                <div className="md:w-1/2 p-5 flex flex-col justify-between md:h-96">
                  <div className="flex-1 space-y-3">
                    {/* Name on top */}
                    <div>
                      <label className="text-[10px] text-white/40 font-medium mb-1 block">Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Optional label"
                        className="w-full px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-white/20 focus:outline-none focus:border-accent/50"
                      />
                    </div>

                    {/* Type + Occasion side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      {customType ? (
                        <div>
                          <label className="text-[10px] text-white/40 font-medium mb-1 block">Type</label>
                          <input
                            value={clothingType}
                            onChange={(e) => setClothingType(e.target.value)}
                            placeholder="Custom type"
                            autoFocus
                            className="w-full px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-white/20 focus:outline-none focus:border-accent/50"
                          />
                        </div>
                      ) : (
                        <Dropdown
                          label="Type"
                          options={[...clothingTypes, "Custom..."]}
                          value={clothingType}
                          onChange={(v) => {
                            if (v === "Custom...") { setCustomType(true); setClothingType(""); }
                            else setClothingType(v);
                          }}
                        />
                      )}
                      {customOccasion ? (
                        <div>
                          <label className="text-[10px] text-white/40 font-medium mb-1 block">Occasion</label>
                          <input
                            value={occasion}
                            onChange={(e) => setOccasion(e.target.value)}
                            placeholder="Custom occasion"
                            autoFocus
                            className="w-full px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-white/20 focus:outline-none focus:border-accent/50"
                          />
                        </div>
                      ) : (
                        <Dropdown
                          label="Occasion"
                          options={[...occasions, "Custom..."]}
                          value={occasion}
                          onChange={(v) => {
                            if (v === "Custom...") { setCustomOccasion(true); setOccasion(""); }
                            else setOccasion(v);
                          }}
                        />
                      )}
                    </div>

                    {/* Category + Color side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      {customCategory ? (
                        <div>
                          <label className="text-[10px] text-white/40 font-medium mb-1 block">Category</label>
                          <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Custom category"
                            autoFocus
                            className="w-full px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-white/20 focus:outline-none focus:border-accent/50"
                          />
                        </div>
                      ) : (
                        <Dropdown
                          label="Category"
                          options={[...categories, "Custom..."]}
                          value={category}
                          onChange={(v) => {
                            if (v === "Custom...") { setCustomCategory(true); setCategory(""); }
                            else setCategory(v);
                          }}
                        />
                      )}
                      <div>
                        <label className="text-[10px] text-white/40 font-medium mb-1 block">Color</label>
                        <input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          placeholder="e.g. navy, black"
                          className="w-full px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-white/20 focus:outline-none focus:border-accent/50"
                        />
                      </div>
                    </div>

                    {/* Style Tags full width */}
                    <div>
                      <label className="text-[10px] text-white/40 font-medium mb-1 block">Style Tags</label>
                      <input
                        value={styleTags}
                        onChange={(e) => setStyleTags(e.target.value)}
                        placeholder="Comma separated, e.g. floral, summer"
                        className="w-full px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-white/20 focus:outline-none focus:border-accent/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadMutation.isPending || !file}
                    className="w-full mt-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-background hover:bg-white/90"
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
