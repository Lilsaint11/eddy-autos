import React from 'react'

const Header = ({ onGoHome }) => {
  const handleLogoClick = () => {
    if (onGoHome) {
      onGoHome()
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleHomeClick = (e) => {
    if (onGoHome) {
      e.preventDefault()
      onGoHome()
    }
  }

  return (
    <header className='w-full px-8 py-6 flex justify-between items-center text-white z-50 border-b border-white/10 bg-black/20 backdrop-blur-sm fixed top-0 left-0'>
        <div onClick={handleLogoClick} className='flex items-center gap-2 cursor-pointer'>
          <img src="/images/eddy1.png" alt="" className='w-28' />
        </div>
        
        <nav className='hidden md:flex gap-10'>
            <a href="#" onClick={handleHomeClick} className='text-sm  tracking-widest font-semibold hover:text-red-500 transition-colors duration-300 border-b-2 border-transparent hover:border-red-500 pb-1'>Home</a>
            <a href="#inventory" className='text-sm  tracking-widest font-semibold text-gray-300 hover:text-red-500 transition-colors duration-300 border-b-2 border-transparent hover:border-red-500 pb-1'>Inventory</a>
            <a href="#benefits" className='text-sm  tracking-widest font-semibold text-gray-300 hover:text-red-500 transition-colors duration-300 border-b-2 border-transparent hover:border-red-500 pb-1'>Benefits</a>
            <a href="#reviews" className='text-sm  tracking-widest font-semibold text-gray-300 hover:text-red-500 transition-colors duration-300 border-b-2 border-transparent hover:border-red-500 pb-1'>Reviews</a>
            <a href="/admin" className='text-sm  tracking-widest font-semibold text-gray-300 hover:text-red-500 transition-colors duration-300 border-b-2 border-transparent hover:border-red-500 pb-1'>Admin</a>
        </nav>
        
        <div className='hidden md:block'>
          <a href="#contact" >
            <button className='bg-red-600 text-white text-black hover:bg-red-800 hover:text-white px-7 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-lg rounded-full cursor-pointer'>
                Contact Us
            </button>
          </a>
        </div>
        
        {/* Mobile menu text instead of SVG as requested */}
        <div className='md:hidden flex items-center'>
            <button className='text-sm uppercase tracking-widest font-bold'>Menu</button>
        </div>
    </header>
  )
}

export default Header