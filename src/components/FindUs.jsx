import React from 'react'
import { MapPin, Clock, Phone, Mail, Navigation, ExternalLink } from 'lucide-react'

const FindUs = () => {
  return (
    <section className="bg-zinc-950 py-30 px-6 md:px-12 border-t border-white/5" id='contact'>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <span className="text-red-500 font-black tracking-widest text-[10px] uppercase mb-3 block">
                VISIT THE SHOWROOM
              </span>
              <h2 className="text-white font-black text-4xl mb-4 tracking-tight leading-none">
                Find Us <span className="text-red-500 "> Here</span> 
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Experience high-performance luxury up close. Visit our state-of-the-art showroom to speak with our experts and take your dream vehicle for a test drive today.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Address Card */}
              <div className="flex items-start gap-4 bg-zinc-900/40 border border-white/5 p-5 rounded-2xl hover:border-red-500/20 transition-all duration-300 group">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-base mb-1">Our Location</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                  14 Admiralty Way, Lekki Phase 1, <br />
                  Lagos, NG 100281
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="flex items-start gap-4 bg-zinc-900/40 border border-white/5 p-5 rounded-2xl hover:border-red-500/20 transition-all duration-300 group">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                  <Clock size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-base mb-1">Showroom Hours</h4>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-gray-400 text-sm">
                    <span>Monday - Friday</span>
                    <span className="text-white font-semibold text-right">8:00 AM - 7:00 PM</span>
                    <span>Saturday</span>
                    <span className="text-white font-semibold text-right">9:00 AM - 5:00 PM</span>
                    <span>Sunday</span>
                    <span className="text-red-500 font-semibold text-right">Closed</span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="flex items-start gap-4 bg-zinc-900/40 border border-white/5 p-5 rounded-2xl hover:border-red-500/20 transition-all duration-300 group">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-base mb-1">Get in Touch</h4>
                  <p className="text-gray-400 text-sm mb-1">
                    Phone: <a href="tel:+2347025550199" className="text-white hover:text-red-400 font-semibold transition-colors">+234 (702) 555-0199</a>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Email: <a href="mailto:info@eddyautos.com" className="text-white hover:text-red-400 font-semibold transition-colors">info@eddyautos.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Map Column */}
          <div className="lg:col-span-7 h-[450px] relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Elegant Futuristic Map Mockup */}
            <div className="absolute inset-0 bg-[#08080a] overflow-hidden flex items-center justify-center">
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {/* Abstract futuristic roads (drawn with glowing dark grey lines) */}
              <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="100" x2="100%" y2="100" stroke="#333" strokeWidth="4" />
                <line x1="150" y1="0" x2="150" y2="100%" stroke="#333" strokeWidth="6" />
                <line x1="0" y1="320" x2="100%" y2="280" stroke="#333" strokeWidth="4" />
                <line x1="100%" y1="180" x2="0" y2="400" stroke="#333" strokeWidth="5" />
                <line x1="450" y1="0" x2="400" y2="100%" stroke="#333" strokeWidth="8" />
                <circle cx="410" cy="220" r="140" fill="none" stroke="#222" strokeWidth="2" strokeDasharray="8 8" />
              </svg>

              {/* Water body or park vector mock */}
              <div className="absolute top-[5%] right-[10%] w-48 h-32 bg-blue-900/5 rounded-full blur-xl border border-blue-500/5" />
              <div className="absolute bottom-[10%] left-[5%] w-64 h-24 bg-emerald-950/5 rounded-full blur-2xl border border-emerald-500/5" />

              {/* Major Landmarks */}
              <div className="absolute top-[18%] left-[28%] text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                Prestige District
              </div>
              <div className="absolute bottom-[20%] right-[30%] text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                Main Expressway
              </div>

              {/* Pulsing Pin Location in the Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                {/* Ping rings */}
                <div className="absolute w-24 h-24 bg-red-500/10 rounded-full animate-ping opacity-60" style={{ animationDuration: '3s' }} />
                <div className="absolute w-12 h-12 bg-red-500/25 rounded-full animate-ping opacity-80" style={{ animationDuration: '2s' }} />
                
                {/* Active Dealership Marker Box */}
                <div className="bg-zinc-900 border border-red-500/40 text-white rounded-xl py-2 px-3 flex items-center gap-2 shadow-2xl backdrop-blur-md mb-2 translate-y-[-24px] animate-bounce whitespace-nowrap">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-bold text-xs uppercase tracking-wider">Eddy Autos Showroom</span>
                </div>
                
                {/* Location Marker Pin Icon */}
                <div className="bg-gradient-to-t from-red-700 to-red-500 text-white p-3 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400/40">
                  <MapPin size={24} />
                </div>
              </div>

              {/* Mock Map UI Controls */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
                <button className="w-10 h-10 bg-zinc-900/90 border border-white/10 hover:border-red-500/50 rounded-xl flex items-center justify-center text-white text-lg font-bold transition-all hover:bg-zinc-800 active:scale-95 shadow-lg">
                  +
                </button>
                <button className="w-10 h-10 bg-zinc-900/90 border border-white/10 hover:border-red-500/50 rounded-xl flex items-center justify-center text-white text-lg font-bold transition-all hover:bg-zinc-800 active:scale-95 shadow-lg">
                  -
                </button>
              </div>

              <div className="absolute top-6 left-6 z-20">
                <div className="bg-zinc-900/95 border border-white/15 rounded-2xl py-2 px-4 flex items-center gap-2 shadow-lg backdrop-blur-sm text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block animate-pulse" />
                  Showroom Open Now
                </div>
              </div>

              {/* Bottom directions link */}
              <div className="absolute bottom-6 left-6 z-20">
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl transition-all duration-300 shadow-lg active:scale-95 group"
                >
                  <Navigation size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  Get Directions
                  <ExternalLink size={12} className="opacity-60" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default FindUs
