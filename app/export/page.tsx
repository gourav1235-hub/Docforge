"use client";

import { useState } from "react";

export default function ExportPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("Download completed!");
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 w-full h-full relative -mt-8">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(77,142,255,0.05)_0%,_rgba(16,19,26,0)_70%)] pointer-events-none" />
      
      {/* Success Indicator */}
      <div className="mb-10 flex flex-col items-center z-10">
        <div className="w-24 h-24 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center mb-6 animate-[pulse-glow_2s_infinite_alternate] shadow-[0_0_15px_rgba(77,142,255,0.4)]">
          <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h2 className="font-headline-lg text-2xl md:text-headline-lg text-white text-center mb-2">Processing Complete</h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-center">
          Your document is ready for export.
        </p>
      </div>

      {/* File Summary Card */}
      <div className="glass-card rounded-2xl w-full max-w-md p-6 mb-8 flex items-center space-x-4 z-10">
        <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
            description
          </span>
        </div>
        <div className="flex-grow overflow-hidden">
          <h3 className="font-headline-md text-body-lg text-white truncate mb-1">Q3_Financial_Report_Final.pdf</h3>
          <div className="flex items-center text-label-sm font-label-sm text-outline">
            <span>PDF Document</span>
            <span className="mx-2">•</span>
            <span className="text-primary">2.4 MB</span>
            <span className="mx-2 text-outline-variant">-45% smaller</span>
          </div>
        </div>
      </div>

      {/* Export Options Bento */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 mb-10 z-10">
        {/* Save to Cloud */}
        <button 
          onClick={() => alert("Saving to cloud...")}
          className="glass-card rounded-xl p-4 flex flex-col items-center justify-center space-y-3 hover:bg-white/5 transition-colors border border-transparent hover:border-primary/30 group"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              cloud_upload
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface">Save to Cloud</span>
        </button>
        {/* Share Link */}
        <button 
          onClick={() => alert("Link copied to clipboard!")}
          className="glass-card rounded-xl p-4 flex flex-col items-center justify-center space-y-3 hover:bg-white/5 transition-colors border border-transparent hover:border-primary/30 group"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              link
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface">Share Link</span>
        </button>
      </div>

      {/* Primary Action */}
      <div className="w-full max-w-md z-10">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary-container text-white font-headline-md text-body-lg flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(173,198,255,0.3)] transition-all ${isDownloading ? 'opacity-70' : 'hover:shadow-[0_0_30px_rgba(173,198,255,0.5)] active:scale-[0.98]'}`}
        >
          <span className="material-symbols-outlined">
            {isDownloading ? 'hourglass_empty' : 'download'}
          </span>
          <span>{isDownloading ? 'Downloading...' : 'Download Now'}</span>
        </button>
        <p className="text-center font-label-sm text-label-sm text-outline mt-4 uppercase tracking-widest">
          or drag to desktop
        </p>
      </div>
    </div>
  );
}
