import React from 'react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-zinc-950 text-gray-400 py-16 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/5">
          
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <img src="/images/eddy1.png" alt="Eddy Autos" className="w-28" />
            </div>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-sm">
              Sourcing and delivering the world's finest premium vehicles with absolute transparency. Experience high-performance luxury today.
            </p>

            <div className="flex gap-4">
     
              <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white rounded-xl flex items-center justify-center transition-all duration-300 group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white rounded-xl flex items-center justify-center transition-all duration-300 group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white rounded-xl flex items-center justify-center transition-all duration-300 group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white rounded-xl flex items-center justify-center transition-all duration-300 group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Navigation</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Benefits</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Inventory</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Dealership Benefits</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Our Brands</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">BMW Series</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Tesla Electric</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Mercedes-Benz</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Toyota Hybrids</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Honda Sports</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Newsletter</h4>
            <p className="text-sm leading-relaxed text-zinc-400">
              Subscribe to get notified about fresh arrivals, exclusive private inventory releases, and seasonal offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full mt-2">
              <div className="relative flex-1">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-zinc-900 border border-white/5 focus:border-red-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                />
              </div>
              <button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-3 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-red-600/10 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} Eddy Autos. All rights reserved. 
            <span className="mx-2 text-zinc-700">|</span> 
            Designed for high performance.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>

          <button 
            onClick={scrollToTop} 
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white flex items-center justify-center transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            title="Scroll to Top"
          >

            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>

      </div>
    </footer>
  )
}

export default Footer
