import React, { useState, useEffect } from 'react'
import { X, Calendar, Gauge, Fuel, Settings, MessageSquare, CalendarCheck, Send, ArrowLeft, CheckCircle2, Phone, ShieldCheck } from 'lucide-react'

const carExtraSpecs = {
  1: { engine: '2.0L TwinPower Turbo', power: '248 HP', color: 'Sophisto Grey', drive: 'xDrive AWD' },
  2: { engine: 'Dual Motor (Electric)', power: '346 HP', color: 'Pearl White', drive: 'AWD' },
  3: { engine: '2.5L 4-Cylinder Hybrid', power: '203 HP', color: 'Celestial Silver', drive: 'FWD' },
  4: { engine: '1.5L Turbocharged I4', power: '180 HP', color: 'Rallye Red', drive: 'FWD' },
  5: { engine: '2.0L Turbo Mild-Hybrid', power: '255 HP', color: 'Obsidian Black', drive: 'RWD' },
  6: { engine: '168 kW Electric Motor', power: '225 HP', color: 'Cyber Grey', drive: 'RWD' }
}

const CarDetailsModal = ({ car, onClose }) => {
  const [viewMode, setViewMode] = useState('details') // 'details', 'inspection', 'dm'
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', date: '', time: '' })
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const extraSpecs = carExtraSpecs[car.id] || { engine: 'Standard Engine', power: 'N/A', color: 'N/A', drive: 'N/A' }

  // Set up mock initial message for DMs
  useEffect(() => {
    if (viewMode === 'dm' && chatMessages.length === 0) {
      setChatMessages([
        {
          id: 1,
          sender: 'dealer',
          text: `Hi there! I'm Eddy from Eddy Autos. I see you're interested in our gorgeous ${car.year} ${car.name}. Let me know if you would like to book a direct showroom inspection or if you have any questions!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
      setInputMessage(`Hi Eddy! I'm really interested in the ${car.name} (${car.miles}). Is it available for inspection this week?`)
    }
  }, [viewMode])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setChatMessages(prev => [...prev, userMsg])
    setInputMessage('')
    setIsTyping(true)

    // Simulate Dealer typing response after 1.5s
    setTimeout(() => {
      setIsTyping(false)
      const dealerMsg = {
        id: Date.now() + 1,
        sender: 'dealer',
        text: `Absolutely! The ${car.name} is detailed and currently sitting on our main showroom floor in Las Vegas. It looks even better in person! What day works best for you to come down and inspect it?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, dealerMsg])
    }, 1800)
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.date) return
    setBookingSuccess(true)
    setTimeout(() => {
      // Auto switch back or just let it stay on success
    }, 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-6 overflow-y-auto">
      {/* Modal Box */}
      <div className="bg-zinc-950 border border-white/10 w-full max-w-5xl rounded-3xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row h-auto md:h-[650px] animate-fade-in">
        
        {/* Close Button absolute */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2.5 bg-black/60 hover:bg-red-600/20 text-gray-400 hover:text-white rounded-full border border-white/10 transition-all duration-300 active:scale-90"
        >
          <X size={20} />
        </button>

        {/* Left Column: Visual Panel */}
        <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center border-r border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
          <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          
          {/* Badge & Year floating tags */}
          <div className="absolute top-6 left-6 z-20 flex gap-2">
            {car.badge && (
              <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                {car.badge}
              </span>
            )}
            <span className="bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
              {car.year}
            </span>
          </div>

          {/* Slogan floating on visual bottom */}
          <div className="absolute bottom-8 left-8 right-8 z-20 hidden md:block">
            <h3 className="text-white font-black text-2xl tracking-tight mb-2">{car.name}</h3>
            <div className="flex gap-2 items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-red-500" />
              <span>Certified Rigorous Multi-point Inspected</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Panel */}
        <div className="md:w-1/2 overflow-hidden flex flex-col justify-between h-full bg-zinc-950">
          
          {/* VIEW: DETAILS PANEL */}
          {viewMode === 'details' && (
            <div className="p-8 md:p-10 flex flex-col justify-between h-full overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-4 pr-10">
                  <div>
                    <span className="text-red-500 font-black tracking-widest text-[9px] uppercase">AVAILABLE NOW</span>
                    <h2 className="text-white font-black text-3xl tracking-tight mt-1">{car.name}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-500 text-[9px] uppercase tracking-widest block font-bold">EST. PRICE</span>
                    <span className="text-white font-black text-2xl tracking-tight">${car.price.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {car.description}
                </p>

                {/* Specs Grid */}
                <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Vehicle Specifications</h4>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <Gauge size={16} className="text-red-500" />
                    <div>
                      <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Mileage</span>
                      <span className="text-white text-xs font-bold">{car.miles}</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <Fuel size={16} className="text-red-500" />
                    <div>
                      <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Fuel System</span>
                      <span className="text-white text-xs font-bold">{car.fuelType}</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <Settings size={16} className="text-red-500" />
                    <div>
                      <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Transmission</span>
                      <span className="text-white text-xs font-bold">{car.transmission}</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
                    </svg>
                    <div>
                      <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Engine Displacement</span>
                      <span className="text-white text-xs font-bold">{extraSpecs.engine}</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 22 22 22" />
                    </svg>
                    <div>
                      <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Drive Type</span>
                      <span className="text-white text-xs font-bold">{extraSpecs.drive}</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24" />
                    </svg>
                    <div>
                      <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Exterior Color</span>
                      <span className="text-white text-xs font-bold">{extraSpecs.color}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* No Online Payments Disclaimer + Direct Contact Buttons */}
              <div className="mt-4">
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 mb-5 flex gap-3 items-start">
                  <span className="text-amber-500 text-base mt-0.5">⚠️</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    <strong>Direct Dealership Inspection Only:</strong> We believe in physical transparency. We never request online checkouts or upfront payments. Schedule a showroom inspection to fully evaluate this vehicle in person.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setViewMode('inspection')}
                    className="flex-1 bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg"
                  >
                    <CalendarCheck size={14} />
                    Book Inspection
                  </button>
                  <button 
                    onClick={() => setViewMode('dm')}
                    className="flex-1 bg-red-650 hover:bg-red-750 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-600/10"
                  >
                    <MessageSquare size={14} />
                    Chat in DMs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SHOWROOM INSPECTION SCHEDULER */}
          {viewMode === 'inspection' && (
            <div className="p-8 md:p-10 flex flex-col justify-between h-full overflow-y-auto">
              <div>
                <button 
                  onClick={() => setViewMode('details')}
                  className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-wider mb-6 group transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                  Back to Details
                </button>

                <h3 className="text-white font-black text-2xl tracking-tight mb-2">Book Showroom Inspection</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Schedule an on-site mechanical evaluation and private showroom walkthrough for the <strong>{car.name}</strong>.
                </p>

                {bookingSuccess ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center flex flex-col items-center gap-4 animate-fade-in">
                    <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Appointment Requested!</h4>
                      <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                        Thank you, {bookingForm.name}. Our showroom manager will call your number ({bookingForm.phone}) in the next 15 minutes to lock in your private inspection on {bookingForm.date}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full bg-zinc-900 border border-white/5 focus:border-red-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Direct Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (702) 555-0100"
                        className="w-full bg-zinc-900 border border-white/5 focus:border-red-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Preferred Date</label>
                        <input 
                          type="date" 
                          required
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full bg-zinc-900 border border-white/5 focus:border-red-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Preferred Time</label>
                        <select 
                          value={bookingForm.time}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full bg-zinc-900 border border-white/5 focus:border-red-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-red-650 hover:bg-red-750 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-600/10 mt-2"
                    >
                      <CalendarCheck size={14} />
                      Confirm Booking Request
                    </button>
                  </form>
                )}
              </div>

              {/* Showroom Direct Info Footer */}
              {!bookingSuccess && (
                <div className="border-t border-white/5 pt-6 mt-6 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    <span>Dealing directly with Eddy Autos</span>
                  </div>
                  <a href="tel:+17025550199" className="text-white hover:text-red-400 font-bold transition-colors flex items-center gap-1">
                    <Phone size={12} />
                    Call Dealer
                  </a>
                </div>
              )}
            </div>
          )}

          {/* VIEW: DIRECT DMs WITH DEALER */}
          {viewMode === 'dm' && (
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* DM Header */}
              <div className="p-5 border-b border-white/5 bg-zinc-900/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setViewMode('details')}
                    className="p-1 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer mr-1"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  
                  {/* Initial Circle */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-red-800 text-white flex items-center justify-center font-bold text-xs">
                    EA
                  </div>
                  
                  <div>
                    <h4 className="text-white font-bold text-sm leading-none flex items-center gap-1.5">
                      Eddy (Dealer)
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    </h4>
                    <span className="text-[10px] text-zinc-500 leading-none">Online &middot; Sells {car.name.split(' ')[0]}</span>
                  </div>
                </div>
                
                <a href="tel:+17025550199" className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all cursor-pointer">
                  <Phone size={14} />
                </a>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-zinc-950/40">
                {chatMessages.map(msg => {
                  const isUser = msg.sender === 'user'
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col max-w-[80%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
                    >
                      <div className={`py-3 px-4 rounded-2xl text-sm leading-relaxed ${
                        isUser 
                          ? 'bg-red-600 text-white rounded-tr-none' 
                          : 'bg-zinc-900 border border-white/5 text-gray-300 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-zinc-500 mt-1 font-semibold px-1">{msg.time}</span>
                    </div>
                  )
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="self-start flex flex-col max-w-[80%] items-start animate-pulse">
                    <div className="bg-zinc-900 border border-white/5 py-3 px-5 rounded-2xl rounded-tl-none text-zinc-500 text-xs font-bold flex items-center gap-1.5">
                      <span>Eddy is typing</span>
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-zinc-900/10 flex gap-2 shrink-0">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about this vehicle..."
                  className="flex-1 bg-zinc-900 border border-white/5 focus:border-red-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                />
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-red-600/10 cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </form>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default CarDetailsModal
