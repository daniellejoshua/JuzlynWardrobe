"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { NavBar } from "@/components/nav-bar";
import { Form } from "react-hook-form";

interface Model {
  id: string;
  name: string;
  version: string | null;
  storage_path: string;
  file_size: number;
  uploaded_at: string;
}

export default function ModelsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  
  
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [uploadName, setUploadName] = useState("");
  const [uploadVersion, setUploadVersion] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadName) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file",uploadFile)
      fd.append("name",uploadName)
      if (uploadVersion) fd.append("version",uploadVersion)
      const res = await fetch(`${API_URL}/models/upload`,{method:"POST",body:fd})
      const model:Model = await res.json()
      setModels((prev)=>[...prev,model]);
      setShowDialog(false);
      resetUploadForm();
    } catch {
      // handle error
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadName("");
    setUploadVersion("");
    setUploadFile(null);
    setPreview(null);
  };

      // TODO: Implement API call
      // const fd = new FormData();
      // fd.append("file", uploadFile);
      // fd.append("name", uploadName);
      // if (uploadVersion) fd.append("version", uploadVersion);
      // const res = await fetch(`${API_URL}/models/upload`, { method: "POST", body: fd });
      // const model = await res.json();
      // setModels((prev) => [...prev, model]);
  const getImageUrl = (storage_path: string) => {
    const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if(!supabase_url) return ""
     return `${supabase_url}/storage/v1/object/public/model-photos/${storage_path}`;
  };

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

      <NavBar currentPage="models" />

      <div className="relative z-10 px-6 py-6 md:px-12 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
              Models
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Person photos used as the base for try-on
            </p>
          </div>
          <button
            onClick={() => setShowDialog(true)}
            className="px-5 py-2.5 bg-white hover:bg-white/90 text-background font-medium rounded-lg text-sm transition-all"
          >
            + Add Model
          </button>
        </motion.div>

        {/* Model Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {loading ? (
            <div className="text-center py-16">
              <p className="text-white/40 text-sm">Loading models...</p>
            </div>
          ) : models.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white/60 font-medium">No models yet</p>
              <p className="text-white/30 text-sm mt-1">Upload a person photo to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {models.map((model) => (
                <motion.div
                  key={model.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden hover:border-white/20 transition-all"
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={getImageUrl(model.storage_path)}
                      alt={model.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-white truncate">
                      {model.name}
                    </h3>
                    {model.version && (
                      <p className="text-xs text-white/40 mt-0.5">
                        v{model.version}
                      </p>
                    )}
                    <p className="text-[10px] text-white/30 mt-1">
                      {new Date(model.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Upload Dialog */}
      <AnimatePresence>
        {showDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowDialog(false);
                resetUploadForm();
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
            >
              <form onSubmit={handleUpload}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-serif font-bold text-white">
                      Add Model
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDialog(false);
                        resetUploadForm();
                      }}
                      className="text-white/30 hover:text-white/70 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* File Upload */}
                    {!preview ? (
                      <label className="block cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          required
                        />
                        <div className="rounded-xl border-2 border-dashed border-white/20 hover:border-accent/50 transition-all p-8 text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-dashed border-accent/40 flex items-center justify-center">
                            <svg className="w-5 h-5 text-accent/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-white/60 text-sm">Click to upload a photo</p>
                          <p className="text-white/30 text-xs mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      </label>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full object-contain max-h-64"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUploadFile(null);
                            setPreview(null);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        placeholder="e.g. Front Pose"
                        required
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent/50 text-sm transition-all"
                      />
                    </div>

                    {/* Version (optional) */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">
                        Version
                      </label>
                      <input
                        type="text"
                        value={uploadVersion}
                        onChange={(e) => setUploadVersion(e.target.value)}
                        placeholder="e.g. v1 (optional)"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent/50 text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDialog(false);
                      resetUploadForm();
                    }}
                    className="flex-1 py-2.5 border border-white/20 text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !uploadFile || !uploadName}
                    className="flex-1 py-2.5 bg-white hover:bg-white/90 text-background font-medium rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
