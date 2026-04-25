"use client";

import { useState } from "react";
import TopAppBar from "./TopAppBar";
import NavigationDrawer from "./NavigationDrawer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <TopAppBar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <NavigationDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="transition-all duration-300 ml-0 md:ml-64 mt-16 p-4 md:p-8 min-h-[calc(100vh-64px)] flex flex-col xl:flex-row gap-8 relative z-10 before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] before:from-surface-container-high/50 before:via-background before:to-background">
        {children}
      </main>
    </>
  );
}
