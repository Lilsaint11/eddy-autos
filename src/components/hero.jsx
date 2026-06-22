import React from 'react'
import { Search } from 'lucide-react'

const Hero = () => {
  return (
    <div className='flex-1 flex flex-col items-center justify-center text-white text-center px-4 relative lg:pt-40 max-lg:pt-30 max-lg:pb-30'>
      {/* Vertical Social Icons on the Left */}
      <div className='hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-40 animate-fade-in mt-20'>

        
        {/* Instagram */}
        <div className='bg-white/9 w-10 h-10 rounded-full flex justify-center items-center'>
          <a href="#" className="text-zinc-400 hover:text-red-500 transition-all duration-300 hover:scale-120" title="Instagram">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
        
        {/* Twitter (X) */}
        <div className='bg-white/9 w-10 h-10 rounded-full flex justify-center items-center'>
          <a href="#" className="text-zinc-400 hover:text-red-500 transition-all duration-300 hover:scale-120" title="Twitter">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </a>
        </div>
        {/* Youtube */}
        <div className='bg-white/9 w-10 h-10 rounded-full flex justify-center items-center'>
          <a href="#" className="text-zinc-400 hover:text-red-500 transition-all duration-300 hover:scale-120" title="YouTube">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
            </svg>
          </a>
        </div>
        {/* Linkedin */}
        <div className='bg-white/9 w-10 h-10 rounded-full flex justify-center items-center'>
          <a href="#" className="text-zinc-400 hover:text-red-500 transition-all duration-300 hover:scale-120" title="LinkedIn">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
      </div>

      <div className='max-w-5xl mx-auto max-lg:pt-20'>
        <h1 className='text-3xl md:text-4xl lg:text-6xl font-black tracking-tight mb-6 drop-shadow-2xl leading-none'>
            Explore 
            <span style={{
                backgroundImage: 'linear-gradient(to right, #ef4444, #991b1b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
            }}>
                  {' '}Quality Cars{' '}
            </span> <br />
            You Can Trust
        </h1>
        <p className='text-lg md:text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto drop-shadow-lg'>
          Discover premium vehicles at unbeatable prices. The road to your next adventure starts right here.
        </p>
        
        {/* Search / Filter Glassmorphism Bar */}
        <div className='bg-white/10 backdrop-blur-md border border-white/20 p-2 md:py-4 md:px-7  flex md:flex-row gap-2 md:gap-4 w-full max-w-4xl shadow-2xl mx-auto justify-center items-center rounded-full'>
            <input type="text" name="" id="" className='w-full outline-none placeholder:text-[#bbb]' placeholder='search for your dream car...' />

          <Search size={24} className='cursor-pointer' />

        </div>
      </div>
    </div>
  )
}

export default Hero