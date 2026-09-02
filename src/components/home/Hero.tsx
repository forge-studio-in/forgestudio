"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2, // Wait for navbar slightly
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function Hero({ onOpenProjectModal }: { onOpenProjectModal: () => void }) {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">
      {/* Subtle Background Elements (optional, per reference) */}
      <div className="absolute top-0 right-0 w-3/4 h-[800px] bg-surface-light rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
            >
              <motion.span variants={itemVariants} className="block">WE BUILD</motion.span>
              <motion.span variants={itemVariants} className="block text-primary">DIGITAL THINGS</motion.span>
              <motion.span variants={itemVariants} className="block">THAT MAKE</motion.span>
              <motion.span variants={itemVariants} className="block">BRANDS MATTER.</motion.span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted mb-10 max-w-lg leading-relaxed"
            >
              A creative technology studio crafting software, websites, brands, AI-powered systems and digital experiences built to grow.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" icon="ArrowRight" onClick={onOpenProjectModal}>
                Start a Project
              </Button>
              <Button size="lg" variant="secondary" icon="ArrowRight" className="rotate-90-icon">
                {/* We can use CSS to rotate the arrow, or just use a different icon like ArrowDown */}
                View Our Work
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Visual Composition */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative h-[500px] md:h-[600px] w-full hidden lg:block perspective-1000"
          >
            {/* 
              This is a placeholder for the digital work showcase.
              In the real implementation with assets, this would be a refined composition of images.
              For now, we build a clean CSS-based structural representation.
            */}
            
            {/* Web Preview */}
            <div className="absolute top-10 right-0 w-[450px] h-[300px] bg-surface rounded-xl border border-border shadow-2xl overflow-hidden transform -rotate-y-12 rotate-z-3 translate-z-10">
              <div className="h-6 border-b border-border bg-charcoal/50 flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-border" />
                <div className="w-2 h-2 rounded-full bg-border" />
                <div className="w-2 h-2 rounded-full bg-border" />
              </div>
              <div className="p-6 h-full flex flex-col gap-4">
                <div className="h-8 w-3/4 bg-border/30 rounded" />
                <div className="flex-1 bg-border/20 rounded-lg" />
              </div>
            </div>

            {/* Mobile Preview */}
            <div className="absolute bottom-10 left-10 w-[220px] h-[450px] bg-surface rounded-3xl border-4 border-charcoal shadow-2xl overflow-hidden transform rotate-y-12 -rotate-z-6 translate-z-20">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-charcoal rounded-b-xl z-10" />
              <div className="p-4 pt-10 h-full flex flex-col gap-4">
                <div className="h-20 w-full bg-primary/20 rounded-xl" />
                <div className="flex-1 bg-border/20 rounded-xl" />
                <div className="h-12 w-full bg-primary rounded-lg" />
              </div>
            </div>

            {/* Floating Brand Element */}
            <div className="absolute top-1/2 right-1/4 w-[160px] h-[160px] bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-md shadow-2xl transform rotate-12 translate-z-30 flex items-center justify-center">
               <span className="text-primary font-bold text-6xl">F</span>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
