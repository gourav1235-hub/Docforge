"use client";

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="glass-card rounded-2xl max-w-2xl w-full p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Profile Image */}
          <div className="shrink-0 relative group">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-surface-container-high shadow-[0_0_30px_rgba(77,142,255,0.2)] group-hover:shadow-[0_0_50px_rgba(77,142,255,0.4)] transition-shadow duration-500">
              <img 
                src="/my_image.jpg" 
                alt="Gourav" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-surface-container-highest rounded-full p-3 border border-white/10 shadow-lg">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                code
              </span>
            </div>
          </div>

          {/* Bio Info */}
          <div className="flex flex-col text-center md:text-left">
            <h1 className="font-headline-lg text-3xl md:text-4xl text-white mb-2">Gourav</h1>
            <h2 className="font-label-sm text-sm tracking-widest text-primary uppercase mb-6 bg-primary/10 w-fit mx-auto md:mx-0 px-3 py-1 rounded border border-primary/20">
              Problem Solver • JUNIOR DATA SCIENTIST
            </h2>
            
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              Turning curiosity into clean code and ideas into impact. A BCA student exploring data, logic, and design through Python and the web. Passionate about learning, building, and growing one project at a time—focused on progress, consistency, and creating solutions that actually matter.
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a 
                href="https://github.com/gourav1235-hub" 
                target="_blank" 
                rel="noreferrer"
                className="p-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white transition-all border border-transparent hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center group"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>

              <a 
                href="https://www.linkedin.com/in/gourav-sarkar-762723326/" 
                target="_blank" 
                rel="noreferrer"
                className="p-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-[#0A66C2] transition-all border border-transparent hover:border-[#0A66C2]/30 hover:shadow-[0_0_15px_rgba(10,102,194,0.3)] flex items-center justify-center group"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>

              <a 
                href="https://www.instagram.com/stf.sunny/" 
                target="_blank" 
                rel="noreferrer"
                className="p-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-[#E4405F] transition-all border border-transparent hover:border-[#E4405F]/30 hover:shadow-[0_0_15px_rgba(228,64,95,0.3)] flex items-center justify-center group"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>

              <a 
                href="https://www.facebook.com/profile.php?id=61565199250403" 
                target="_blank" 
                rel="noreferrer"
                className="p-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-[#1877F2] transition-all border border-transparent hover:border-[#1877F2]/30 hover:shadow-[0_0_15px_rgba(24,119,242,0.3)] flex items-center justify-center group"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>

              <a href="mailto:contact@example.com" className="ml-2 px-6 py-3 rounded-full glass-button hover:bg-white/5 text-primary text-sm font-label-sm uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(173,198,255,0.2)]">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
