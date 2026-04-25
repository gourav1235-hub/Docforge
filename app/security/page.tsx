"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { encryptPDF } from "@pdfsmaller/pdf-encrypt-lite";

export default function SecurityPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProtect = async () => {
    if (!file || !password) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      
      // Use the lightweight encrypt library to secure the PDF buffer
      const encryptedBytes = await encryptPDF(pdfBytes, password);
      
      const blob = new Blob([encryptedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `Protected_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert("PDF successfully protected! Ensure you remember the password.");
      setPassword("");
    } catch (error) {
      console.error("Error encrypting PDF:", error);
      alert("Failed to protect the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full max-w-[800px] mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface mb-2">Protect PDF</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Set a password to secure your PDF document.
          </p>
        </div>
      </header>
      
      <div className="glass-card rounded-xl p-8 flex flex-col gap-6 min-h-[500px]">
        {!file ? (
          <label className="flex-1 border-2 border-dashed border-primary/50 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-colors rounded-xl flex flex-col items-center justify-center p-12 cursor-pointer relative overflow-hidden group">
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">lock</span>
            <h3 className="font-headline-md text-white mb-2">Upload PDF to protect</h3>
            <p className="text-on-surface-variant text-sm">Select a PDF file</p>
          </label>
        ) : (
          <div className="flex-1 flex flex-col gap-8 items-center justify-center">
            <div className="flex items-center gap-4 bg-surface-container-high p-4 rounded-xl border border-white/5 w-full">
              <span className="material-symbols-outlined text-tertiary text-4xl">picture_as_pdf</span>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-white font-medium truncate">{file.name}</span>
                <span className="text-outline text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <label className="text-primary hover:text-primary-container text-sm cursor-pointer ml-4 font-medium">
                Change
                <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            
            <div className="w-full flex flex-col gap-4">
              <h3 className="font-headline-md text-white">Set Password</h3>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">key</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password" 
                  className="w-full bg-surface-container-lowest border border-outline/30 focus:border-primary text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none transition-colors"
                />
              </div>
              <p className="text-xs text-on-surface-variant">
                We don't store your password. If you forget it, the document cannot be recovered.
              </p>
            </div>
            
            <button 
              onClick={handleProtect}
              disabled={isProcessing || !password}
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-headline-md text-body-lg flex items-center justify-center space-x-2 transition-all ${isProcessing || !password ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] active:scale-[0.98]'}`}
            >
              <span className={`material-symbols-outlined ${isProcessing ? 'animate-spin' : ''}`}>
                {isProcessing ? 'sync' : 'lock'}
              </span>
              <span>{isProcessing ? 'Encrypting...' : 'Protect Document'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
