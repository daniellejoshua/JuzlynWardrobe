"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { NavBar } from "@/components/nav-bar";
import { useAuth } from "@/components/auth-provider";

export default function Home() {
  
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-y-auto">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
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
      </div>

      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <NavBar currentPage="home" />

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-20 md:px-16 md:py-32 lg:py-40 flex items-center min-h-[70vh]">
        <div className="max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-8 text-balance text-white"
          >
            Lyn's Wardrobe
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base md:text-lg text-white/60 max-w-2xl mb-12 leading-relaxed"
          >
            A personalized digital Wardrobe of Juzlyn
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/wardrobe">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-background font-medium px-8"
              >
                Start Styling
              </Button>
            </Link>
            <Link href="/gallery">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 backdrop-blur px-8"
              >
                View Favorites
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-8 md:px-16 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl"
        >
          {[
            {
              title: "AI-Powered Suggestions",
              description:
                "Get intelligent outfit combinations using advanced AI analysis",
              icon: "🤖",
            },
            {
              title: "Smart Matching",
              description:
                "Find perfect pairs based on color, style, and occasion compatibility",
              icon: "✨",
            },
            {
              title: "Save Favorites",
              description:
                "Curate and organize your favorite outfit combinations",
              icon: "♡",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              <div className="mb-4 w-12 h-12 rounded-full border border-accent/50 flex items-center justify-center text-accent group-hover:border-accent">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 md:px-16 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white text-balance">
              Let Juzlyn Style Your Wardrobe
            </h2>
            <p className="text-white/60 mb-8 text-base md:text-lg leading-relaxed">
              Unlock perfectly matched outfit combinations. Juzlyn analyzes your
              style and creates personalized suggestions for every occasion.
            </p>
            <Link href="/wardrobe">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-background font-medium px-8"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 md:px-16 py-12 md:py-16 text-white/40 text-sm">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <p>
            &copy; 2026 Your Wardrobe with Juzlyn. AI Fashion Styling Assistant.
          </p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-accent transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Pinterest
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Email
            </a>
          </div>
        </motion.div>
      </footer>
    </main>
  );
}
