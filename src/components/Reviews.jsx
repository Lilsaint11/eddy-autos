import React from 'react'
import { Star, Quote, Award, ThumbsUp } from 'lucide-react'

const reviewData = [
  {
    name: 'Sarah Ajibade',
    vehicle: 'Verified Buyer — BMW 5 Series',
    rating: 5,
    text: 'The level of service at Eddy Autos is unmatched. I bought my BMW 5 Series here and the pricing was completely transparent. The car was delivered directly to my doorstep in pristine condition. Highly recommended!',
    initials: 'SJ',
    avatarBg: 'from-blue-600 to-indigo-800'
  },
  {
    name: 'David Akharume',
    vehicle: 'Verified Buyer — Tesla Model 3',
    rating: 5,
    text: 'Getting financed was incredibly simple. I applied online, got approved within an hour, and drove off in my Tesla Model 3 the same evening. Transparent pricing and exceptional customer care.',
    initials: 'DC',
    avatarBg: 'from-red-600 to-rose-800'
  },
  {
    name: 'Arokoyo  Yemisi',
    vehicle: 'Verified Buyer — Mercedes-Benz C-Class',
    rating: 5,
    text: 'Rigorous multi-point inspection is not just a tagline here. My Mercedes-Benz drives as if it just rolled off the factory line. The sales support team answered all my questions honestly.',
    initials: 'MT',
    avatarBg: 'from-amber-600 to-orange-850'
  }
]

const Reviews = () => {
  return (
    <section className="bg-zinc-950 py-30 px-6 md:px-12 border-t border-white/5" id='reviews'>
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-red-500 font-black tracking-widest text-[10px] uppercase mb-3 block">
              HEAR FROM OUR DRIVERS
            </span>
            <h2 className="text-white font-black text-4xl mb-4 tracking-tight leading-none">
              Customer <span className="text-red-500">Reviews</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Discover why thousands of drivers choose Eddy Autos for their next luxury vehicle. We take pride in absolute transparency and unbeatable premium service.
            </p>
          </div>
          
          {/* Trust Metrics Badge */}
          <div className="flex items-center gap-6 bg-zinc-900/40 border border-white/5 p-4 rounded-2xl shrink-0 self-start md:self-auto backdrop-blur-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="text-white font-black text-xl">4.9/5</span>
              </div>
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">Google Rating</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white font-black text-xl">98%</span>
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviewData.map((review, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl hover:border-red-500/20 hover:bg-zinc-900/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden cursor-pointer"
            >
              {/* Giant abstract background quotes icon */}
              <Quote className="absolute right-6 top-6 w-16 h-16 text-white/2 opacity-[0.02] group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

              <div>
                {/* Stars Row */}
                <div className="flex gap-1 mb-5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={15} className="text-yellow-500 fill-yellow-500 group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-300 text-sm leading-relaxed mb-8 italic">
                  "{review.text}"
                </p>
              </div>

              {/* User Avatar + Name Row */}
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${review.avatarBg} flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                  {review.initials}
                </div>
                <div>
                  <h4 className="text-white font-bold text-base group-hover:text-red-400 transition-colors duration-200">{review.name}</h4>
                  <span className="text-zinc-500 text-[11px] font-semibold tracking-wider block">{review.vehicle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust CTA Showcase */}
        <div className="bg-gradient-to-r from-zinc-900/50 via-zinc-900/20 to-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Exceptional Dealership Award Winner</h4>
              <p className="text-gray-400 text-xs mt-0.5">Recognized for top-rated customer service, pricing clarity, and retail transparency.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-white/8 text-white text-xs font-black uppercase tracking-widest px-6 py-4 rounded-2xl transition-all duration-300 active:scale-95 whitespace-nowrap">
            <ThumbsUp size={14} />
            Read Google Reviews
          </button>
        </div>

      </div>
    </section>
  )
}

export default Reviews
