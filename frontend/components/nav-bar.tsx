"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./auth-provider";
type PageId = "home" | "outfits" | "gallery" | "wardrobe" | "models" | "signOut";

interface NavBarProps {
  currentPage: PageId;
}

const navItems: { label: string; href: string; id: PageId }[] = [
  { label: "Style Consultant", href: "/wardrobe", id: "wardrobe" },
  { label: "Outfits", href: "/outfits", id: "outfits" },
  { label: "Models", href: "/models", id: "models" },
  { label: "Favorites", href: "/gallery", id: "gallery" },
];

export function NavBar({ currentPage }: NavBarProps) {
  const { signOut }  = useAuth()
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    if (showSignOutConfirm) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showSignOutConfirm]);

  const isHome = currentPage === "home";
  const handleSignOut = () => { setShowSignOutConfirm(false); signOut(); };
  const closeConfirm = () => setShowSignOutConfirm(false);

  return (
    <><nav
      className={`relative z-10 flex items-center justify-between px-6 py-4 md:px-12 ${
        isHome ? "" : "border-b border-white/10"
      }`}
    >
      <Link href="/">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl font-serif font-bold tracking-tight text-white hover:text-white transition-colors"
        >
          {isHome ? "Your Wardrobe" : "← Your Wardrobe"}
        </motion.span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-6"
      >
        {navItems.map((item) => {
          const isActive = item.id === currentPage;

          if (isActive) {
            return (
              <span
                key={item.id}
                className="relative text-xs md:text-sm font-light text-white"
              >
                {item.label}
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/80" />
              </span>
            );
          }
        

          return (
            <Link
              key={item.id}
              href={item.href}
              className="text-xs md:text-sm font-light text-white/70 hover:text-white hover:underline underline-offset-4 decoration-white/40 transition-all"
            >
              {item.label}
            </Link>
          );
        })}
          <button onClick={() => setShowSignOutConfirm(true)} className="text-xs md:text-sm font-light text-white/70 hover:text-white hover:underline underline-offset-4 decoration-white/40 transition-all"
>
            Sign Out
          </button>
      </motion.div>
    </nav>

      <AnimatePresence>
        {showSignOutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeConfirm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-1">Sign Out</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Are you sure you want to sign out? You'll need to log back in to access your wardrobe.
                </p>
              </div>
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={closeConfirm}
                  className="flex-1 py-2.5 border border-white/20 text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-sm transition-all"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
