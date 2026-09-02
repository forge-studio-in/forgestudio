"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectInquiryModal } from "@/components/shared/ProjectInquiryModal";
import { PageTransition } from "@/components/shared/PageTransition";

// We create a context to allow deep children (like FinalCTA) to open the modal
export const ProjectModalContext = React.createContext({
  openModal: () => {},
});

export const useProjectModal = () => React.useContext(ProjectModalContext);

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = React.useCallback(() => setIsModalOpen(true), []);
  const closeModal = React.useCallback(() => setIsModalOpen(false), []);

  return (
    <ProjectModalContext.Provider value={{ openModal }}>
      <Navbar onOpenProjectModal={openModal} />
      
      <main className="flex-1 flex flex-col">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      
      <Footer />
      
      <ProjectInquiryModal isOpen={isModalOpen} onClose={closeModal} />
    </ProjectModalContext.Provider>
  );
}
