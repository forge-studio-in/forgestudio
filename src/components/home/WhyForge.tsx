"use client";

import { motion } from "framer-motion";
import { Icon, IconName } from "@/components/ui/Icon";

const principles: { title: string; desc: string; icon: IconName }[] = [
  { title: "Strategy First", desc: "We solve the right problem before writing code.", icon: "Target" },
  { title: "Design + Technology", desc: "Engineers and designers working together.", icon: "Layers" },
  { title: "One Studio", desc: "Everything you need under one roof.", icon: "Box" },
  { title: "Built for Growth", desc: "Digital products that scale with you.", icon: "Activity" },
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

export function WhyForge() {
  return (
    <section className="py-24 md:py-32 relative bg-surface">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={itemVariants}
            className="lg:col-span-5"
          >
            <span className="text-primary font-bold tracking-wider text-sm uppercase mb-4 block">
              Why Forge
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              WE DON&apos;T JUST DELIVER PROJECTS. <br />
              <span className="text-muted">WE BUILD PARTNERSHIPS.</span>
            </h2>
          </motion.div>

          {/* Principles Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 lg:pl-12"
          >
            {principles.map((principle) => (
              <motion.div 
                key={principle.title} 
                variants={itemVariants}
                className="flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-light border border-border flex items-center justify-center text-primary shrink-0">
                  <Icon name={principle.icon} size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{principle.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{principle.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
