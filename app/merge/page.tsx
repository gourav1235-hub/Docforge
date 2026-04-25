"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();

        if (file.type === "application/pdf") {
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
          const image = await mergedPdf.embedJpg(arrayBuffer);
          const { width, height } = image.scale(1);
          const page = mergedPdf.addPage([width, height]);
          page.drawImage(image, { x: 0, y: 0, width, height });
        } else if (file.type === "image/png") {
          const image = await mergedPdf.embedPng(arrayBuffer);
          const { width, height } = image.scale(1);
          const page = mergedPdf.addPage([width, height]);
          page.drawImage(image, { x: 0, y: 0, width, height });
        }
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "Merged_Document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error merging files:", error);
      alert("Failed to merge files.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full max-w-[1000px] mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface mb-2">Merge to PDF</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Upload images or PDFs to merge them into a single document.
          </p>
        </div>
      </header>
      
      <div className="glass-card rounded-xl p-8 flex flex-col gap-6 min-h-[500px]">
        {/* Upload Area */}
        <label className="border-2 border-dashed border-primary/50 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-colors rounded-xl flex flex-col items-center justify-center p-12 cursor-pointer relative overflow-hidden group">
          <input 
            type="file" 
            multiple 
            accept="image/jpeg, image/png, application/pdf" 
            className="hidden" 
            onChange={handleFileChange} 
          />
          <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">upload_file</span>
          <h3 className="font-headline-md text-white mb-2">Click or drag files to upload</h3>
          <p className="text-on-surface-variant text-sm">Supports JPG, PNG, and PDF</p>
        </label>

        {/* File List */}
        {files.length > 0 && (
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Selected Files ({files.length})</h3>
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between bg-surface-container-high p-4 rounded-lg border border-white/5">
                <div className="flex items-center gap-4 overflow-hidden">
                  <span className="material-symbols-outlined text-tertiary text-2xl">
                    {file.type === "application/pdf" ? "picture_as_pdf" : "image"}
                  </span>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-white text-sm truncate max-w-[300px] md:max-w-[500px]">{file.name}</span>
                    <span className="text-outline text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <button onClick={() => removeFile(idx)} className="text-on-surface-variant hover:text-red-400 transition-colors p-2">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Area */}
        <div className="mt-auto pt-6 border-t border-outline-variant/30 flex justify-end">
          <button 
            onClick={handleMerge}
            disabled={isMerging || files.length === 0}
            className={`py-4 px-8 rounded-lg bg-gradient-to-r from-primary to-secondary text-surface-container-lowest font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${isMerging || files.length === 0 ? 'opacity-50 cursor-not-allowed' : 'neon-glow hover:scale-[1.02]'}`}
          >
            <span className={`material-symbols-outlined ${isMerging ? 'animate-spin' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {isMerging ? 'sync' : 'library_add'}
            </span>
            {isMerging ? 'Merging...' : 'Merge Files'}
          </button>
        </div>
      </div>
    </div>
  );
}
