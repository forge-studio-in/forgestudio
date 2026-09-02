"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function FinalCTA({ onOpenProjectModal }: { onOpenProjectModal: () => void }) {
  return (
    <section className="py-32 md:py-48 relative bg-charcoal overflow-hidden border-t border-border">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/5 rounded-full mix-blend-screen filter blur-[150px] opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-primary font-bold tracking-wider text-sm uppercase mb-6 block">
            Ready to Start?
          </span>
          <h2 className="text-4xl md:text-6xl md:leading-tight font-bold tracking-tight mb-8">
            HAVE A PROJECT IN MIND? <br />
            LET&apos;S MAKE IT REAL.
          </h2>
          <p className="text-muted text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Let&apos;s build something amazing together. Share your idea with us today.
          </p>
          
          <Button 
            size="lg" 
            icon="ArrowRight" 
            onClick={onOpenProjectModal}
            className="shadow-2xl shadow-primary/20"
          >
            Start a Project
          </Button>

          <div className="mt-16 pt-8 border-t border-border/50 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted font-medium">
            <span>Software</span>
            <span className="text-border">•</span>
            <span>Web</span>
            <span className="text-border">•</span>
            <span>Design</span>
            <span className="text-border">•</span>
            <span>Media</span>
            <span className="text-border">•</span>
            <span>Marketing</span>
            <span className="text-border">•</span>
            <span>AI</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
