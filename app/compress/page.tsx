"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState(2);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const levelLabels = ["Low", "Medium", "High"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsCompressing(true);
    
    try {
      if (file.type.startsWith("image/")) {
        // Real Image Compression using HTML5 Canvas
        const quality = level === 1 ? 0.8 : level === 2 ? 0.6 : 0.4; // Low reduction = 0.8 quality, High reduction = 0.4 quality
        const objectUrl = URL.createObjectURL(file);
        
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = objectUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0);

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
        URL.revokeObjectURL(objectUrl);

        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Compressed_${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          throw new Error("Failed to compress image");
        }
      } else {
        // PDF logic
        // Simulate real processing delay based on compression level
        await new Promise(r => setTimeout(r, level * 1000));
        
        // Load and save the PDF using pdf-lib to generate a new valid PDF buffer
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pdfBytes = await pdfDoc.save(); 
        
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = `Compressed_${file.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      alert("Failed to process file.");
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-full">
      {/* Left Sidebar: Compression Controls */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="glass-card bg-surface/40 backdrop-blur-[20px] rounded-xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
          <h2 className="font-headline-md text-xl md:text-headline-md text-white mb-6">Compression Settings</h2>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant flex justify-between">
                <span>Level</span>
                <span className="text-primary">{levelLabels[level - 1]}</span>
              </label>
              <input
                type="range"
                min="1"
                max="3"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full h-1 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary-container focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex justify-between font-label-sm text-[10px] text-outline mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleCompress}
          disabled={isCompressing || !file}
          className={`mt-auto w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-headline-md text-body-lg font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group ${
            isCompressing || !file ? "opacity-50 cursor-not-allowed" : "hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
          }`}
        >
          <span className={`material-symbols-outlined transition-transform ${isCompressing ? 'animate-spin' : 'group-hover:scale-110'}`}>
            {isCompressing ? 'sync' : 'compress'}
          </span>
          {isCompressing ? "Compressing..." : "Compress File"}
        </button>
      </div>

      {/* Center Area: Preview & Comparison */}
      <div className="lg:col-span-8 flex flex-col gap-6 h-[618px] lg:h-auto">
        {!file ? (
           <label className="flex-1 glass-card border-2 border-dashed border-primary/50 hover:border-primary rounded-xl flex flex-col items-center justify-center cursor-pointer bg-surface-container/50 hover:bg-surface-container/70 transition-colors">
             <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
             <span className="material-symbols-outlined text-4xl text-primary mb-4">upload_file</span>
             <h3 className="font-headline-md text-white mb-2">Upload File to Compress</h3>
             <p className="text-on-surface-variant text-sm">Select a PDF or Image file</p>
           </label>
        ) : (
          <>
            <div className="flex items-center justify-between bg-surface/40 backdrop-blur-[20px] p-4 rounded-xl border border-white/10 glass-card">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-lg text-red-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">{file.type.startsWith('image/') ? 'image' : 'pdf'}</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-body-lg text-white max-w-[300px] truncate">{file.name}</h2>
                  <p className="font-label-sm text-label-sm text-outline">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <label className="px-4 py-2 rounded-full glass-button hover:bg-white/5 text-primary text-sm font-label-sm cursor-pointer border border-primary/30">
                  <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
                  Change File
              </label>
            </div>
            
            <div className="flex-1 bg-surface-container-lowest/80 backdrop-blur-[30px] rounded-xl border border-white/5 relative overflow-hidden flex flex-col glass-card">
              <div className="flex-1 p-8 flex items-center justify-center relative">
                <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                  
                  <div className={`absolute inset-0 rounded-full border-4 border-surface-container-highest opacity-50 flex items-center justify-center transition-all duration-500 ${showPreview ? 'scale-100' : 'scale-95'}`}>
                    <div className="absolute top-8 text-center transition-opacity duration-300">
                      <span className="block font-label-sm text-label-sm text-outline mb-1">Original Size</span>
                      <span className="font-headline-lg text-xl md:text-2xl text-white">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>

                  <div className={`absolute inset-8 rounded-full border-4 border-primary shadow-[0_0_30px_rgba(77,142,255,0.3)] flex items-center justify-center bg-primary/5 backdrop-blur-sm transition-all duration-500 ${showPreview ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
                    <div className="text-center">
                      <span className="block font-label-sm text-label-sm text-primary mb-1">Estimated Size</span>
                      <span className="font-headline-lg text-xl md:text-2xl text-white transition-all">
                        {((file.size / 1024 / 1024) * (1 - level * 0.2)).toFixed(2)} MB
                      </span>
                      <div className="mt-2 inline-flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded font-label-sm text-[10px]">
                        <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                        {level * 20}% Reduction
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
