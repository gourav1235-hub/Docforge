"use client";

import dynamic from "next/dynamic";

const PdfEditorApp = dynamic(() => import("@/components/PdfEditorApp"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-80px)] text-outline gap-4">
      <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
      <p>Loading Editor Engine...</p>
    </div>
  )
});

export default function EditorPage() {
  return <PdfEditorApp />;
}
