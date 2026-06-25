"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type PageId = "home" | "outfits" | "upload" | "gallery" | "wardrobe";

interface NavBarProps {
  currentPage: PageId;
}

const navItems: { label: string; href: string; id: PageId }[] = [
  { label: "Style Consultant", href: "/wardrobe", id: "wardrobe" },
  { label: "Outfits", href: "/outfits", id: "outfits" },
  { label: "Upload", href: "/upload", id: "upload" },
  { label: "Favorites", href: "/gallery", id: "gallery" },
];

export function NavBar({ currentPage }: NavBarProps) {
  const isHome = currentPage === "home";

  return (
    <nav
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
      </motion.div>
    </nav>
  );
}
