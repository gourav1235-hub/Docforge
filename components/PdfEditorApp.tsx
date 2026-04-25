"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Tool = "select" | "highlight" | "erase" | "text";

type Annotation = {
  id: string;
  type: "highlight" | "erase" | "text";
  x: number;
  y: number;
  width?: number;
  text?: string;
  fontSize?: number;
  pageNum: number;
};

export default function PdfEditorApp() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [textSize, setTextSize] = useState<number>(14);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  const [currentPos, setCurrentPos] = useState<{x: number, y: number} | null>(null);
  
  // Dragging state
  const [draggingAnnId, setDraggingAnnId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{x: number, y: number} | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const buffer = await selectedFile.arrayBuffer();
      setPdfBytes(new Uint8Array(buffer));
      setAnnotations([]);
      setCurrentPage(1);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (activeTool === "select") return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;

    if (activeTool === "text") {
      const text = prompt("Enter text to add:");
      if (text) {
        setAnnotations(prev => [...prev, {
          id: Date.now().toString(),
          type: "text",
          x,
          y,
          text,
          pageNum: currentPage,
          fontSize: textSize
        }]);
      }
      setActiveTool("select");
      return;
    }

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentPos({ x, y });
  };

  const handleAnnMouseDown = (e: React.MouseEvent | React.TouchEvent, id: string, annX: number, annY: number) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = (clientX - rect.left) / scale;
    const mouseY = (clientY - rect.top) / scale;
    
    setDragOffset({ x: mouseX - annX, y: mouseY - annY });
    setDraggingAnnId(id);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;

    if (draggingAnnId && dragOffset) {
      setAnnotations(prev => prev.map(a => 
        a.id === draggingAnnId 
          ? { ...a, x: x - dragOffset.x, y: y - dragOffset.y } 
          : a
      ));
      return;
    }

    if (!isDrawing || !startPos) return;
    setCurrentPos({ x, y });
  };

  const handleMouseUp = () => {
    if (draggingAnnId) {
      setDraggingAnnId(null);
      setDragOffset(null);
      return;
    }

    if (!isDrawing || !startPos || !currentPos) {
      setIsDrawing(false);
      return;
    }

    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);

    if (width > 5 && height > 5) {
      setAnnotations(prev => [...prev, {
        id: Date.now().toString(),
        type: activeTool as "highlight" | "erase",
        x,
        y,
        width,
        height,
        pageNum: currentPage
      }]);
    }

    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
    setActiveTool("select"); // Revert to select after drawing
  };

  const undoLastAnnotation = () => {
    setAnnotations(prev => prev.slice(0, -1));
  };

  const handleExport = async () => {
    if (!pdfBytes) return;
    setIsExporting(true);
    
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      
      for (const ann of annotations) {
        const page = pages[ann.pageNum - 1];
        if (!page) continue;
        
        const { height: pageHeight } = page.getSize();
        
        // pdf-lib's origin is bottom-left. DOM origin is top-left.
        // We must translate the Y coordinate.
        
        if (ann.type === "highlight" && ann.width && ann.height) {
          page.drawRectangle({
            x: ann.x,
            y: pageHeight - ann.y - ann.height,
            width: ann.width,
            height: ann.height,
            color: rgb(1, 1, 0), // Yellow
            opacity: 0.4
          });
        } else if (ann.type === "erase" && ann.width && ann.height) {
          page.drawRectangle({
            x: ann.x,
            y: pageHeight - ann.y - ann.height,
            width: ann.width,
            height: ann.height,
            color: rgb(1, 1, 1), // White out
          });
        } else if (ann.type === "text" && ann.text) {
          page.drawText(ann.text, {
            x: ann.x,
            y: pageHeight - ann.y - (ann.fontSize || 14) + 2, // Approximate baseline adjustment
            size: ann.fontSize || 14,
            color: rgb(0, 0, 0),
          });
        }
      }
      
      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `Edited_${file?.name || 'Document.pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to export the edited PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 w-full lg:h-[calc(100vh-80px)] overflow-y-auto lg:overflow-hidden">
      {/* Tools Sidebar */}
      <aside className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4 lg:gap-6 lg:h-full lg:overflow-y-auto pb-4 lg:pb-10">
        <div className="glass-card rounded-xl p-4 flex flex-col gap-4">
          <h2 className="font-headline-md text-white">Editor Tools</h2>
          
          {!file ? (
            <label className="border-2 border-dashed border-primary/50 hover:border-primary rounded-lg flex flex-col items-center justify-center cursor-pointer bg-surface-container/50 hover:bg-surface-container/70 transition-colors p-6 text-center">
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
              <span className="material-symbols-outlined text-3xl text-primary mb-2">upload_file</span>
              <span className="text-on-surface-variant text-sm">Upload PDF</span>
            </label>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Tool Selection */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setActiveTool("select")}
                  className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${activeTool === 'select' ? 'bg-primary/20 border border-primary text-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'}`}
                >
                  <span className="material-symbols-outlined">pan_tool</span>
                  <span className="text-[11px] text-center w-full break-words leading-tight">Pan/Select</span>
                </button>
                <button 
                  onClick={() => setActiveTool("erase")}
                  className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${activeTool === 'erase' ? 'bg-primary/20 border border-primary text-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'}`}
                >
                  <span className="material-symbols-outlined">ink_eraser</span>
                  <span className="text-[11px] text-center w-full break-words leading-tight">Remove (Erase)</span>
                </button>
                <button 
                  onClick={() => setActiveTool("highlight")}
                  className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${activeTool === 'highlight' ? 'bg-primary/20 border border-primary text-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'}`}
                >
                  <span className="material-symbols-outlined">ink_highlighter</span>
                  <span className="text-[11px] text-center w-full break-words leading-tight">Highlight</span>
                </button>
                <button 
                  onClick={() => setActiveTool("text")}
                  className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${activeTool === 'text' ? 'bg-primary/20 border border-primary text-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'}`}
                >
                  <span className="material-symbols-outlined">title</span>
                  <span className="text-[11px] text-center w-full break-words leading-tight">Add Text</span>
                </button>
              </div>

              {/* Text Tool Options */}
              {activeTool === 'text' && (
                <div className="p-3 bg-surface-container rounded-lg border border-white/5 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="text-xs text-outline flex justify-between">
                    <span>Text Size</span>
                    <span className="text-primary font-bold">{textSize}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="8" 
                    max="72" 
                    value={textSize} 
                    onChange={(e) => setTextSize(parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              )}

              <p className="text-xs text-outline mt-2 leading-relaxed">
                <strong className="text-primary">How to use:</strong> Select a tool above. For erase or highlight, click and drag on the document. For text, click where you want the text to appear. You can move items by switching to the <strong>Pan/Select</strong> tool and dragging them.
              </p>
              
              {annotations.length > 0 && (
                <button 
                  onClick={undoLastAnnotation}
                  className="mt-2 flex items-center justify-center gap-2 py-2 bg-surface-container hover:bg-surface-container-high rounded text-sm text-red-400 border border-red-500/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">undo</span>
                  Undo Last Action
                </button>
              )}
              
              {/* Big Download Button for Desktop Sidebar */}
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="mt-4 hidden lg:flex w-full h-12 rounded-lg text-sm font-bold transition-all items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                {isExporting ? 'Generating PDF...' : 'Download Edited PDF'}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col gap-4 bg-surface-container-lowest/50 rounded-xl border border-white/5 relative overflow-hidden min-h-[500px] lg:h-full">
        <header className="h-14 border-b border-white/5 bg-surface-container/50 backdrop-blur-md flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium text-sm truncate max-w-[300px]">
              {file?.name || 'No document selected'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {numPages > 0 && (
              <div className="flex items-center gap-2 bg-surface-container rounded-lg px-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="p-1 hover:text-primary disabled:opacity-50"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <span className="text-xs text-white">Page {currentPage} of {numPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} className="p-1 hover:text-primary disabled:opacity-50"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            )}
            
            <button 
              onClick={handleExport}
              disabled={!file || isExporting}
              className={`h-8 px-4 rounded-md text-xs font-medium transition-colors hidden sm:flex items-center gap-2 ${file ? 'bg-gradient-to-r from-primary to-secondary text-surface-container-lowest shadow-[0_0_15px_rgba(173,198,255,0.4)]' : 'bg-surface-container-high text-outline cursor-not-allowed'}`}
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              {isExporting ? 'Applying...' : 'Export & Save'}
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto bg-[#1a1d24] relative p-8 flex justify-center cursor-crosshair">
          {file && pdfBytes ? (
            <div 
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              className={`relative shadow-2xl bg-white select-none ${activeTool !== 'select' ? 'touch-none' : ''}`}
              style={{ cursor: activeTool !== 'select' ? 'crosshair' : 'default' }}
            >
              <Document 
                file={file} 
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="p-10 text-center text-outline">Loading PDF...</div>}
              >
                <Page 
                  pageNumber={currentPage} 
                  scale={scale} 
                  renderTextLayer={false} 
                  renderAnnotationLayer={false}
                />
              </Document>

              {/* Render existing annotations for current page */}
              {annotations.filter(a => a.pageNum === currentPage).map(ann => (
                <div 
                  key={ann.id}
                  onMouseDown={(e) => handleAnnMouseDown(e, ann.id, ann.x, ann.y)}
                  onTouchStart={(e) => handleAnnMouseDown(e, ann.id, ann.x, ann.y)}
                  className="absolute"
                  style={{
                    left: `${ann.x * scale}px`,
                    top: `${ann.y * scale}px`,
                    width: ann.width ? `${ann.width * scale}px` : 'auto',
                    height: ann.height ? `${ann.height * scale}px` : 'auto',
                    backgroundColor: ann.type === 'highlight' ? 'rgba(255, 255, 0, 0.4)' : ann.type === 'erase' ? 'white' : 'transparent',
                    color: ann.type === 'text' ? 'black' : 'transparent',
                    fontSize: `${(ann.fontSize || 14) * scale}px`,
                    border: ann.type === 'erase' ? '1px dashed #ccc' : ann.type === 'text' && activeTool === 'select' ? '1px dashed rgba(0,0,0,0.3)' : 'none',
                    whiteSpace: 'nowrap',
                    cursor: activeTool === 'select' ? 'move' : 'default',
                    pointerEvents: activeTool === 'select' ? 'auto' : 'none',
                  }}
                >
                  {ann.type === 'text' && ann.text}
                </div>
              ))}

              {/* Render drawing rectangle preview */}
              {isDrawing && startPos && currentPos && (activeTool === 'highlight' || activeTool === 'erase') && (
                <div 
                  className="absolute pointer-events-none border border-blue-500"
                  style={{
                    left: `${Math.min(startPos.x, currentPos.x) * scale}px`,
                    top: `${Math.min(startPos.y, currentPos.y) * scale}px`,
                    width: `${Math.abs(currentPos.x - startPos.x) * scale}px`,
                    height: `${Math.abs(currentPos.y - startPos.y) * scale}px`,
                    backgroundColor: activeTool === 'highlight' ? 'rgba(255, 255, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'
                  }}
                />
              )}
            </div>
          ) : (
            <div className="text-center text-outline m-auto flex flex-col items-center">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-30">edit_document</span>
              <p>Upload a PDF to start an interactive editing session</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile-only Big Download Button at the very bottom */}
      {file && (
        <div className="lg:hidden w-full pb-8 shrink-0">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full h-14 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">download</span>
            {isExporting ? 'Generating PDF...' : 'Download Edited PDF'}
          </button>
        </div>
      )}
    </div>
  );
}
