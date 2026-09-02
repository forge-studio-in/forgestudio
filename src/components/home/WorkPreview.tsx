"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: 1,
    title: "Nexora",
    category: "Website Design & Development",
    href: "/work/nexora",
    color: "from-emerald-500/20 to-emerald-900/40", // placeholder gradient
  },
  {
    id: 2,
    title: "Cloudix",
    category: "SaaS Platform Development",
    href: "/work/cloudix",
    color: "from-blue-500/20 to-blue-900/40", // placeholder gradient
  },
  {
    id: 3,
    title: "Visionly",
    category: "Mobile App UI/UX",
    href: "/work/visionly",
    color: "from-purple-500/20 to-purple-900/40", // placeholder gradient
    hideOnMobile: true, // Show 2 on mobile, 3 on desktop
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function WorkPreview() {
  return (
    <section className="py-24 md:py-32 relative bg-surface">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24"
        >
          <div>
            <span className="text-primary font-bold tracking-wider text-sm uppercase mb-4 block">
              Selected Work
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              WORK WE&apos;RE PROUD OF.
            </h2>
          </div>
          
          <Link 
            href="/work"
            className="hidden md:inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors group mb-2"
          >
            VIEW ALL WORK
            <Icon 
              name="ArrowRight" 
              size={20} 
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1" 
            />
          </Link>
        </motion.div>

        {/* Work Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className={cn(
                "group cursor-pointer flex flex-col",
                project.hideOnMobile && "hidden lg:flex"
              )}
            >
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-charcoal border border-border">
                {/* 
                  This is a placeholder for the actual next/image. 
                  When real images are provided, swap this div with <Image />
                */}
                <div className={cn("absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-[1.02]", project.color)}>
                  {/* Subtle structural UI representation for placeholder */}
                  <div className="absolute inset-x-8 top-8 bottom-0 bg-surface rounded-t-lg border-t border-x border-white/10 shadow-2xl overflow-hidden">
                    <div className="h-4 border-b border-white/5 bg-white/5" />
                  </div>
                </div>
              </div>
              
              {/* Project Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted text-sm">{project.category}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-forge-black transition-colors shrink-0">
                  <Icon name="ArrowUpRight" size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Footer Action */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 block md:hidden text-center"
        >
          <Link 
            href="/work"
            className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors group"
          >
            VIEW ALL WORK
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
