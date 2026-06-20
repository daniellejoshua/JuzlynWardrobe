"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CustomSelectProps {
  name: string
  value: string
  onChange: (e: { target: { name: string; value: string } }) => void
  options: string[]
  label: string
  required?: boolean
  placeholder?: string
}

export function CustomSelect({
  name,
  value,
  onChange,
  options,
  label,
  required,
  placeholder = "Select...",
}: CustomSelectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customInput, setCustomInput] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isCustom = value !== "" && !options.includes(value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectOption = (opt: string) => {
    onChange({ target: { name, value: opt } })
    setIsDropdownOpen(false)
  }

  const openCustomModal = () => {
    setCustomInput("")
    setIsDropdownOpen(false)
    setIsModalOpen(true)
  }

  const confirmCustom = () => {
    if (customInput.trim()) {
      onChange({ target: { name, value: customInput.trim() } })
    }
    setIsModalOpen(false)
  }

  return (
    <>
      <div ref={dropdownRef} className="relative">
        <label className="block text-sm font-semibold text-white mb-3">
          {label} {required && <span className="text-accent">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-left text-white placeholder-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/8 transition-all flex items-center justify-between"
        >
          <span className={value ? "text-white" : "text-white/40"}>
            {value || placeholder}
          </span>
          {isCustom && (
            <span className="text-xs text-accent ml-2 whitespace-nowrap">(custom)</span>
          )}
          <svg
            className={`w-4 h-4 ml-2 text-white/40 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute z-40 mt-1 w-full rounded-xl border border-white/10 bg-neutral-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto">
                {!value && (
                  <div className="px-4 py-2.5 text-sm text-white/30 italic">
                    {placeholder}
                  </div>
                )}
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => selectOption(opt)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
                      value === opt ? "text-accent bg-white/5" : "text-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
                <div className="border-t border-white/10" />
                <button
                  type="button"
                  onClick={openCustomModal}
                  className="w-full px-4 py-2.5 text-left text-sm text-accent hover:bg-white/10 transition-colors"
                >
                  ✏️ Custom...
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/95 backdrop-blur-xl p-8 shadow-2xl"
            >
              <h3 className="text-xl font-serif font-bold text-white mb-2">
                Custom {label}
              </h3>
              <p className="text-sm text-white/50 mb-6">
                Type your own {label.toLowerCase()} value
              </p>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}...`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmCustom()
                  if (e.key === "Escape") setIsModalOpen(false)
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/8 transition-all mb-6"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-white/20 text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmCustom}
                  className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-background font-medium rounded-xl transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
