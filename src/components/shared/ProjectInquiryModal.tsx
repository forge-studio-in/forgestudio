"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

interface ProjectInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  "Software",
  "Web",
  "Design & Branding",
  "Media",
  "Marketing",
  "AI & Automation",
  "Other",
];

export function ProjectInquiryModal({ isOpen, onClose }: ProjectInquiryModalProps) {
  const [step, setStep] = React.useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setStep("form");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }
      
      setStep("success");
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === "form" ? "Start a Project" : undefined}>
      <AnimatePresence mode="wait">
        {step === "form" ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <p className="text-muted text-sm mb-2">
              Tell us a bit about yourself and what you&apos;re looking to build.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatingInput label="Name *" name="name" type="text" required />
              <FloatingInput label="Email *" name="email" type="email" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatingInput label="Phone (optional)" name="phone" type="tel" />
              <FloatingInput label="Company (optional)" name="company" type="text" />
            </div>

            <div className="relative">
              <select
                name="service"
                required
                className="w-full h-14 px-4 bg-transparent border border-border rounded-lg text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer transition-colors"
                defaultValue=""
              >
                <option value="" disabled className="bg-charcoal text-muted">Select a primary service *</option>
                {services.map(s => (
                  <option key={s} value={s} className="bg-charcoal">{s}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted peer-focus:text-primary">
                <Icon name="ChevronDown" size={16} />
              </div>
            </div>

            <div className="relative">
              <textarea
                name="message"
                required
                placeholder=" "
                rows={4}
                className="w-full p-4 bg-transparent border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer transition-colors resize-none pt-6"
              />
              <label className="absolute left-4 top-4 text-muted text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                Project description *
              </label>
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="submit" isLoading={isSubmitting} icon="ArrowRight" className="w-full sm:w-auto">
                Submit Inquiry
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
              <Icon name="Check" size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Inquiry Received</h3>
            <p className="text-muted mb-8 max-w-sm">
              Thank you for reaching out. Our team will review your project details and get back to you within 24 hours.
            </p>
            <Button onClick={onClose}>
              Close
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

// Helper for floating label input
function FloatingInput({ label, name, type, required }: { label: string, name: string, type: string, required?: boolean }) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        id={name}
        required={required}
        placeholder=" "
        className="w-full h-14 px-4 pt-4 bg-transparent border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer transition-colors"
      />
      <label 
        htmlFor={name}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}
