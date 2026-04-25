"use client";

import { useState } from "react";

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("word");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = () => {
    if (!file) return;
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      // Simulate download
      const blob = new Blob(["Simulated converted content"], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Converted_${file.name.split('.')[0]}.${selectedFormat === 'word' ? 'docx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2000);
  };

  return (
    <>
      <div className="flex-1 flex flex-col gap-6">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface mb-2">Convert Document</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Transform your PDFs to Word, or Word to PDF.
            </p>
          </div>
        </header>
        <div className="glass-card rounded-xl flex-1 flex flex-col p-6 min-h-[600px] relative overflow-hidden group">
          {/* File Upload / Preview Canvas */}
          {!file ? (
            <label className="flex-1 border-2 border-dashed border-primary/50 hover:border-primary rounded-lg flex flex-col items-center justify-center cursor-pointer bg-surface-container/50 hover:bg-surface-container/70 transition-colors">
              <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleFileChange} />
              <span className="material-symbols-outlined text-4xl text-primary mb-4">upload_file</span>
              <h3 className="font-headline-md text-white mb-2">Upload a Document</h3>
              <p className="text-on-surface-variant text-sm">Select a PDF or DOCX file to convert</p>
            </label>
          ) : (
            <div className="flex-1 border border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-surface-container/50">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {file.name.endsWith('.pdf') ? 'pdf' : 'description'}
                </span>
                <h3 className="font-headline-md text-lg md:text-xl text-on-surface px-4 break-all text-center max-w-full">{file.name}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <label className="mt-4 px-4 py-2 rounded-full glass-button hover:bg-white/5 text-primary text-sm font-label-sm cursor-pointer border border-primary/30">
                  <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleFileChange} />
                  Change File
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Panel - Settings */}
      <aside className="w-full xl:w-[400px] flex flex-col gap-6">
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-headline-md text-body-lg text-on-surface mb-4">Output Format</h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="cursor-pointer relative">
              <input
                type="radio"
                name="format"
                className="peer sr-only"
                checked={selectedFormat === "word"}
                onChange={() => setSelectedFormat("word")}
              />
              <div className="glass-button rounded-lg p-3 flex flex-col items-center gap-2 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-[0_0_15px_rgba(173,198,255,0.2)] transition-all">
                <span className="material-symbols-outlined text-base text-secondary">description</span>
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface">Word</span>
              </div>
            </label>
            <label className="cursor-pointer relative">
              <input
                type="radio"
                name="format"
                className="peer sr-only"
                checked={selectedFormat === "pdf"}
                onChange={() => setSelectedFormat("pdf")}
              />
              <div className="glass-button rounded-lg p-3 flex flex-col items-center gap-2 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-[0_0_15px_rgba(173,198,255,0.2)] transition-all">
                <span className="material-symbols-outlined text-base text-red-400">pdf</span>
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface">PDF</span>
              </div>
            </label>
          </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-outline-variant/30">
          <button 
            onClick={handleConvert}
            disabled={isConverting || !file}
            className={`w-full py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-surface-container-lowest font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${isConverting || !file ? 'opacity-50 cursor-not-allowed' : 'neon-glow hover:scale-[1.02]'}`}
          >
            {isConverting && (
              <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'FILL' 1" }}>
                sync
              </span>
            )}
            {isConverting ? 'Converting...' : 'Convert Now'}
          </button>
        </div>
      </aside>
    </>
  );
}
