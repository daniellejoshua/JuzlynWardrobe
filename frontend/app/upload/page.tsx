"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/CustomSelect";
import { NavBar } from "@/components/nav-bar";

export default function UploadPage() {
  const [formData, setFormData] = useState({
    file: null as File | null,
    clothingType: "",
    category: "",
    primaryColor: "",
    styleTags: "",
    occasion: "",
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  const clothingTypes = [
    "Top",
    "Bottom",
    "Dress",
    "Jacket",
    "Shoes",
    "Accessory",
    "Outerwear",
  ];
  const categories = [
    "Casual",
    "Business",
    "Formal",
    "Athletic",
    "Vintage",
    "Bohemian",
  ];
  const occasions = [
    "Work",
    "Weekend",
    "Evening",
    "Casual",
    "Formal",
    "Party",
    "Outdoor",
  ];

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

      <NavBar currentPage="upload" />

      {/* Main content */}
      <div className="relative z-10 px-4 md:px-16 py-4 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
              Add to Your Wardrobe
            </h1>
          </div>

          {!preview ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-12"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                required
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full cursor-pointer"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-dashed border-accent/40 flex items-center justify-center hover:border-accent hover:bg-accent/5 transition-all">
                      <svg
                        className="w-10 h-10 text-accent/60 group-hover:text-accent transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-white font-medium text-lg mb-2">
                      Click to upload an image
                    </p>
                    <p className="text-white/40 text-sm">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </motion.div>
                </div>
              </label>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 md:p-6"
            >
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                  {/* Form Fields */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="lg:w-2/5 flex flex-col gap-4"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <CustomSelect
                          name="clothingType"
                          value={formData.clothingType}
                          onChange={handleInputChange}
                          options={clothingTypes}
                          label="Clothing Type"
                          required
                          placeholder="Select type"
                        />

                        <CustomSelect
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          options={categories}
                          label="Category"
                          required
                          placeholder="Select category"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Primary Color
                        </label>
                        <input
                          type="text"
                          name="primaryColor"
                          value={formData.primaryColor}
                          onChange={handleInputChange}
                          placeholder="e.g. Stripes, Blue, Floral"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/8 transition-all"
                        />
                      </div>

                      <CustomSelect
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleInputChange}
                        options={occasions}
                        label="Best Occasion"
                        placeholder="Select occasion"
                      />

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Style Tags
                        </label>
                        <textarea
                          name="styleTags"
                          value={formData.styleTags}
                          onChange={handleInputChange}
                          placeholder="E.g., elegant, minimalist, vintage, bold"
                          rows={2}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/8 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Button Group */}
                    <div className="flex gap-3 mt-auto">
                      <Link href="/" className="flex-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10 backdrop-blur px-6 py-2.5"
                        >
                          Cancel
                        </Button>
                      </Link>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-2.5 bg-white hover:bg-white/90 text-background font-medium rounded-lg transition-all"
                      >
                        Add to Wardrobe
                      </button>
                    </div>
                  </motion.div>

                  {/* Image Preview */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="lg:w-3/5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="block w-full rounded-2xl overflow-hidden border border-white/10 hover:border-accent/50 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="relative w-full">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-auto max-h-[70vh] object-contain"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">
                            Click to change
                          </span>
                        </div>
                      </div>
                    </label>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
