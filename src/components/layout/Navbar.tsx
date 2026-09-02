"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Insights", href: "/insights" },
  { name: "Contact", href: "/contact" },
];

export function Navbar({ onOpenProjectModal }: { onOpenProjectModal: () => void }) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out",
          isScrolled
            ? "bg-surface/80 backdrop-blur-md border-b border-border py-4"
            : "bg-transparent border-b border-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo Placeholder */}
          <Link href="/" className="flex items-center gap-2 z-50">
            {/* TODO: Replace with official F logo SVG */}
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-forge-black font-bold text-xl leading-none">F</span>
            </div>
            <span className="font-bold tracking-tight text-xl hidden sm:block">FORGE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button
              onClick={onOpenProjectModal}
              icon="ArrowRight"
              size="sm"
            >
              Start a Project
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden z-50 p-2 -mr-2 text-foreground focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenProjectModal={() => {
          setIsMobileMenuOpen(false);
          onOpenProjectModal();
        }}
      />
    </>
  );
}

// Mobile Menu Component
function MobileMenu({
  isOpen,
  onClose,
  onOpenProjectModal,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenProjectModal: () => void;
}) {
  // Prevent scrolling when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-30 lg:hidden pointer-events-none",
        isOpen && "pointer-events-auto"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-surface transition-all duration-500 ease-[0.22,1,0.36,1]",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <nav
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-8 pt-20 pb-10 px-6 overflow-y-auto transition-transform duration-500 ease-[0.22,1,0.36,1]",
          isOpen ? "translate-y-0" : "-translate-y-8"
        )}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={onClose}
            className={cn(
              "text-3xl font-bold tracking-tight text-foreground hover:text-primary transition-colors",
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: isOpen ? `${i * 50 + 100}ms` : "0ms" }}
          >
            {link.name}
          </Link>
        ))}

        <div
          className={cn(
            "mt-8 w-full max-w-xs transition-all duration-500",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: isOpen ? `${navLinks.length * 50 + 150}ms` : "0ms" }}
        >
          <Button
            onClick={onOpenProjectModal}
            className="w-full"
            size="lg"
            icon="ArrowRight"
          >
            Start a Project
          </Button>
        </div>
      </nav>
    </div>
  );
}
