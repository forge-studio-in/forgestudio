"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const steps = [
  { id: "01", title: "Discover", desc: "Understanding goals & audience." },
  { id: "02", title: "Strategize", desc: "Planning the right roadmap." },
  { id: "03", title: "Design", desc: "Crafting beautiful systems." },
  { id: "04", title: "Build", desc: "Developing robust solutions." },
  { id: "05", title: "Launch", desc: "Testing and deploying." },
  { id: "06", title: "Grow", desc: "Scaling for long-term impact." },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function ProcessPreview() {
  return (
    <section className="py-24 md:py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="mb-16 md:mb-24 text-center md:text-left"
        >
          <span className="text-primary font-bold tracking-wider text-sm uppercase mb-4 block">
            Our Process
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            FROM IDEA <br className="hidden md:block" /> TO IMPACT.
          </h2>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="relative"
        >
          {/* Desktop Horizontal Line */}
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-border z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id} 
                variants={itemVariants}
                className="flex flex-row lg:flex-col gap-6 lg:gap-4 items-start"
              >
                {/* Node */}
                <div className="relative shrink-0 mt-1 lg:mt-0">
                  {/* Mobile Vertical Line */}
                  {index !== steps.length - 1 && (
                    <div className="lg:hidden absolute top-12 bottom-[-2rem] left-1/2 -translate-x-1/2 w-px bg-border z-0" />
                  )}
                  <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-primary relative z-10 shadow-sm">
                    <span className="text-sm font-mono font-bold">{step.id}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-2 lg:pt-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 md:mt-24 text-center md:text-left"
        >
          <Link 
            href="/about#process"
            className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors group"
          >
            EXPLORE OUR PROCESS
            <Icon 
              name="ArrowRight" 
              size={20} 
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1" 
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
