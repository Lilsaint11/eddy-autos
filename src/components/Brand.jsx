import React from 'react'

const brands = [
  {
    name: 'BMW',
    logo:"/images/bmw.png"
  },
  {
    name: 'Tesla',
    logo:"/images/tesla.png"
  },
  {
    name: 'Mercedes',
    logo:"/images/benz.png"
  },
  {
    name: 'Toyota',
    logo:"/images/tyt.png"
  },
  {
    name: 'Honda',
    logo:"/images/hnda.png"
  },
  {
    name: 'Hyundai',
    logo:"/images/hyundai.png"
  }
]

const Brand = () => {
  return (
    <section className="bg-zinc-950/80 py-12 px-6 md:px-12 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Subtle high-end Section Title */}
        <p className="text-red-500 font-black tracking-widest text-[10px] uppercase mb-3">
          Explore Brands We Sell
        </p>
        <h2 className="text-white font-black text-3xl mb-8 tracking-tight text-center">
          Our Premium <span className="text-red-500 ">Car Brands</span>
        </h2>

        {/* Brands Flex Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 w-full">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 bg-zinc-900/60 border border-white/5 px-6 py-4 rounded-2xl hover:border-red-500/30 hover:bg-zinc-900/80 transition-all duration-300 group cursor-pointer w-48 shadow-lg hover:shadow-[0_10px_30px_rgba(239,68,68,0.08)] hover:-translate-y-0.5"
            >
              {/* Logo / Image Container */}
              <div className="flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl group-hover:bg-red-500/10 transition-colors duration-300 group-hover:scale-105 transform">
              <img src={brand.logo} alt="" />  
              </div>
              {/* Brand Name */}
              <div className="flex flex-col">
                <span className="text-zinc-400 text-[10px] uppercase tracking-wider font-semibold">Brand</span>
                <span className="text-white font-bold text-base group-hover:text-red-400 transition-colors duration-300">
                  {brand.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Brand
