import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "DocForge - Document Toolkit",
  description: "Web-based document toolkit for PDF and DOCX files.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="bg-background text-on-background min-h-screen overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
