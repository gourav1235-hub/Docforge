"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: "PDF Editor", href: "/editor", icon: "edit_document" },
    { name: "Convert", href: "/convert", icon: "swap_horiz" },
    { name: "Compress", href: "/compress", icon: "folder_zip" },
    { name: "Merge", href: "/merge", icon: "library_add" },
    { name: "Security", href: "/security", icon: "shield" },
    { name: "Developer", href: "/about", icon: "person" },
  ];

  return (
    <nav className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col p-4 bg-slate-950/60 md:bg-slate-950/40 backdrop-blur-[20px] border-r border-white/10 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="mb-8 px-4 flex justify-between items-center">
        <h2 className="font-['Space_Grotesk'] text-sm uppercase tracking-widest text-white font-black">
          TOOLKIT
        </h2>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/convert');
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-300 font-label-sm text-label-sm ${
                  isActive
                    ? "text-blue-400 border-r-2 border-blue-500 bg-blue-500/10 shadow-[inset_-10px_0_15px_rgba(59,130,246,0.1)]"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5 hover:backdrop-blur-md"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
