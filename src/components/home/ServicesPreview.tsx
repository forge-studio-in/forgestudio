"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Icon, IconName } from "@/components/ui/Icon";

const services: { id: string; title: string; desc: string; icon: IconName }[] = [
  { id: "01", title: "Software & Development", desc: "Custom software, SaaS, and enterprise applications.", icon: "Code" },
  { id: "02", title: "Web Solutions", desc: "High-performance websites and web applications.", icon: "Globe" },
  { id: "03", title: "Design & Branding", desc: "Brand identity, UI/UX, and creative direction.", icon: "PenTool" },
  { id: "04", title: "Motion & Media", desc: "Video editing, motion graphics, and storytelling.", icon: "Video" },
  { id: "05", title: "Growth & Marketing", desc: "SEO, campaigns, and performance marketing.", icon: "TrendingUp" },
  { id: "06", title: "AI & Automation", desc: "AI assistants, workflows, and smart integrations.", icon: "Bot" },
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

export function ServicesPreview() {
  return (
    <section className="py-24 md:py-32 relative bg-background">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="mb-16 md:mb-24"
        >
          <span className="text-primary font-bold tracking-wider text-sm uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 max-w-2xl">
            ONE STUDIO. <br />
            EVERY DIGITAL NEED.
          </h2>
          <p className="text-muted text-lg max-w-xl">
            From strategy and design to development and automation — we build everything you need to grow online.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="group p-8 rounded-xl bg-surface border border-border hover:border-primary/50 transition-colors duration-300 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 rounded-lg bg-surface-light flex items-center justify-center text-primary">
                  <Icon name={service.icon} size={24} />
                </div>
                <span className="text-muted font-mono text-sm">{service.id}</span>
              </div>
              
              <div className="mt-auto">
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-8">{service.desc}</p>
                
                <Link 
                  href={`/services#${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center text-sm font-medium text-foreground group-hover:text-primary transition-colors"
                >
                  Explore
                  <Icon 
                    name="ArrowRight" 
                    size={16} 
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Action */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <Link 
            href="/services"
            className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors group"
          >
            VIEW ALL SERVICES
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
