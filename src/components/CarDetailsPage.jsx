import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCars } from '../context/CarsContext'
import { useChat } from '../context/ChatContext'
import { ArrowLeft, Gauge, Fuel, Settings, ShieldCheck, CalendarCheck, Send, CheckCircle2, Calendar, Phone, MessageSquare, User } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/400x250/111/fff?text=No+Image';
  if (imagePath.startsWith('blob:')) return imagePath;
  if (imagePath.startsWith('/uploads/')) return `${API_URL}${imagePath}`;
  return imagePath;
};

const CarDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cars } = useCars()
  const car = cars.find(c => c.id === Number(id))
  
  const [activeImage, setActiveImage] = useState(car?.image || '')
  const [viewMode, setViewMode] = useState('details')
  const handleBack = () => navigate('/')

  const { joinConversation, sendMessage, onNewMessage, offNewMessage, fetchHistory, sessionId } = useChat()
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [clientName, setClientName] = useState(localStorage.getItem('chat_client_name') || '')
  const [showNameInput, setShowNameInput] = useState(!localStorage.getItem('chat_client_name'))
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)
  const createTempMessageId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  useEffect(() => {
    if (car && !activeImage) {
      setActiveImage(car.image)
    }
  }, [car, activeImage])

  // Join the socket room and load history when entering chat mode
 useEffect(() => {
  if (viewMode !== "dm" || !car?.id) {
    return;
  }

  console.log(
    "💬 Opening chat for car:",
    car.id
  );

  joinConversation(car.id);

  setChatLoading(true);

  fetchHistory(car.id)
    .then((msgs) => {
      setChatMessages(msgs || []);
    })
    .catch((error) => {
      console.error(
        "Failed to load chat history:",
        error
      );
      setChatMessages([]);
    })
    .finally(() => {
      setChatLoading(false);
    });
}, [
  viewMode,
  car?.id,
  joinConversation,
  fetchHistory,
]);

  // Listen for new real-time messages
useEffect(() => {
  const handleMsg = (msg) => {
    if (
      String(msg.carId) !== String(car?.id) ||
      String(msg.sessionId) !== String(sessionId)
    ) {
      return;
    }

    setChatMessages((prev) => {
      // If this is the server-confirmed version of one
      // of our optimistic messages, replace the temporary one.
      const tempIndex = prev.findIndex(
        (message) =>
          String(message.id).startsWith("temp_") &&
          message.text === msg.text &&
          message.senderType === "client"
      );

      if (tempIndex !== -1) {
        const updated = [...prev];

        updated[tempIndex] = {
          ...msg,
          status: "sent",
        };

        return updated;
      }

      // Don't add an actual message that already exists.
      if (
        prev.some(
          (message) =>
            String(message.id) === String(msg.id)
        )
      ) {
        return prev;
      }

      return [
        ...prev,
        {
          ...msg,
          status: "sent",
        },
      ];
    });
  };

  onNewMessage(handleMsg);

  return () => {
    offNewMessage(handleMsg);
  };
}, [
  car?.id,
  sessionId,
  onNewMessage,
  offNewMessage,
]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

const handleSendMessage = async (e) => {
  e.preventDefault();

  const text = inputMessage.trim();

  if (!text || !car?.id) return;

  const tempId = createTempMessageId();

  const optimisticMessage = {
    id: tempId,
    carId: Number(car.id),
    sessionId,
    clientName: clientName?.trim() || "Anonymous",
    senderType: "client",
    text,
    read: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "sending",
  };

  // 1. SHOW MESSAGE IMMEDIATELY
  setChatMessages((prev) => [
    ...prev,
    optimisticMessage,
  ]);

  // 2. Clear input immediately
  setInputMessage("");

  try {
    // 3. Send to server
    const savedMessage = await sendMessage(
      car.id,
      text,
      clientName || "Anonymous"
    );

    // 4. Replace temporary message with server version
    if (savedMessage) {
      setChatMessages((prev) =>
        prev.map((message) =>
          message.id === tempId
            ? {
                ...savedMessage,
                status: "sent",
              }
            : message
        )
      );
    }
  } catch (error) {
    console.error(
      "Failed to send message:",
      error
    );

    // 5. Remove failed optimistic message
    setChatMessages((prev) =>
      prev.filter((message) => message.id !== tempId)
    );

    // Put the text back so the user doesn't lose it
    setInputMessage(text);

    alert(
      error?.message ||
        "Failed to send message. Please try again."
    );
  }
};

  const handleSetName = (e) => {
    e.preventDefault()
    if (clientName.trim()) {
      localStorage.setItem('chat_client_name', clientName.trim())
      setShowNameInput(false)
    }
  }

  if (!car) {
    return (
      <div className="bg-zinc-950 min-h-screen text-white pt-24 pb-16 px-6 md:px-12 flex flex-col items-center justify-center">
        <h2 className="text-xl font-black uppercase mb-4 text-red-500">Car not found</h2>
        <button onClick={() => navigate('/')} className="bg-red-650 text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl cursor-pointer">
          Back to Showroom
        </button>
      </div>
    )
  }

  const extraSpecs = { engine: car.engine || 'Standard Engine', power: car.power || 'N/A', color: car.color || 'N/A', drive: car.drive || 'N/A' }
  const galleryImages = car.gallery && car.gallery.length > 0 ? car.gallery : (car.image ? [car.image] : [])

  return (
    <div className="bg-zinc-950 min-h-screen text-white pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumbs & Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-red-500 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer group self-start"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Inventory
          </button>
          
          <div className="text-zinc-500 text-xs font-semibold tracking-wider">
            Home &middot; Inventory &middot; <span className="text-zinc-300">{car.name}</span>
          </div>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Gallery Section (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Featured Image */}
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent z-10" />
              <img src={getImageUrl(activeImage)} alt={car.name} className="w-full h-full object-cover transition-all duration-500" />
              
              {/* Badge & Year tags */}
              <div className="absolute top-6 left-6 z-20 flex gap-2">
                {car.badge && (
                  <span className="bg-red-650 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                    {car.badge}
                  </span>
                )}
                <span className="bg-zinc-950/80 backdrop-blur-md border border-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                  {car.year}
                </span>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div>
              <span className="text-zinc-500 text-[9px] uppercase tracking-widest block font-bold mb-3">VEHICLE MEDIA GALLERY ({galleryImages.length} IMAGES)</span>
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-[16/10] rounded-2xl overflow-hidden border bg-zinc-900 transition-all duration-300 active:scale-95 shadow-md relative cursor-pointer ${
                      activeImage === img && idx === 0 // just highlight first if all match
                        ? 'border-red-500 ring-2 ring-red-500/20' 
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt={`${car.name} thumbnail`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                    {/* Visual indicator of multiple slides */}
                    <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Certification Details Card */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 flex items-start gap-4 mt-2">
              <div className="p-3.5 bg-red-500/10 rounded-2xl text-red-500 shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-1">Eddy Autos Certified Quality Guarantee</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  This {car.year} {car.name} has passed our strict 150-point mechanical, structural, and electrical safety inspection. Fully detailed, odometer certified, and sold with a clean history report and comprehensive warranty backing.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT: Detail Controls Section (5 Columns) */}
          <div className="lg:col-span-5 bg-zinc-900/10 border border-white/5 rounded-3xl h-[650px] overflow-hidden flex flex-col justify-between shadow-xl">
            
            {/* VIEW MODE: DETAILS */}
            {viewMode === 'details' && (
              <div className="p-8 flex flex-col justify-between h-full overflow-y-auto">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-red-500 font-black tracking-widest text-[9px] uppercase">AVAILABLE DIRECTLY</span>
                      <h1 className="text-white font-black text-3xl tracking-tight mt-1">{car.name}</h1>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 text-[9px] uppercase tracking-widest block font-bold">EST. PRICE</span>
                      <span className="text-white font-black text-2xl tracking-tight">${car.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {car.description}
                  </p>

                  {/* Specification Table */}
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Vehicle Details</h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-zinc-900/60 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                      <Gauge size={16} className="text-red-500" />
                      <div>
                        <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Mileage</span>
                        <span className="text-white text-xs font-bold">{car.miles}</span>
                      </div>
                    </div>
                    <div className="bg-zinc-900/60 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                      <Fuel size={16} className="text-red-500" />
                      <div>
                        <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Fuel System</span>
                        <span className="text-white text-xs font-bold">{car.fuelType}</span>
                      </div>
                    </div>
                    <div className="bg-zinc-900/60 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                      <Settings size={16} className="text-red-500" />
                      <div>
                        <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Transmission</span>
                        <span className="text-white text-xs font-bold">{car.transmission}</span>
                      </div>
                    </div>
                    <div className="bg-zinc-900/60 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                      <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
                      </svg>
                      <div>
                        <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Engine Displacement</span>
                        <span className="text-white text-xs font-bold">{extraSpecs.engine}</span>
                      </div>
                    </div>
                    <div className="bg-zinc-900/60 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                      <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 22 22 22" />
                      </svg>
                      <div>
                        <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Drive Type</span>
                        <span className="text-white text-xs font-bold">{extraSpecs.drive}</span>
                      </div>
                    </div>
                    <div className="bg-zinc-900/60 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                      <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24" />
                      </svg>
                      <div>
                        <span className="text-zinc-500 text-[9px] uppercase block font-semibold">Color Coat</span>
                        <span className="text-white text-xs font-bold">{extraSpecs.color}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Alert Box */}
                <div>
                  <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 mb-5 flex gap-3 items-start">
                    <span className="text-amber-500 text-base mt-0.5">⚠️</span>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      <strong>Dealership Security Policy:</strong> We do not conduct online transactions or collect payments over the web. Schedule an in-person walkthrough or connect with Eddy directly to secure this vehicle.
                    </p>
                  </div>

                  <div className="flex gap-4 justify-between">
                    <button 
                      onClick={() => setViewMode('dm')}
                      className="flex-1 bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg px-3"
                    >
                      <MessageSquare size={14} />
                      Chat with Eddy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MODE: DM CHAT */}
            {viewMode === 'dm' && (
              <div className="p-6 flex flex-col h-full">
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">Chat about {car.name}</h3>
                      <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold">Real-time · Eddy Autos</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewMode('details')}
                    className="text-zinc-500 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                </div>

                {/* Name Input */}
                {showNameInput && (
                  <form onSubmit={handleSetName} className="mb-4 flex gap-2">
                    <div className="flex-1 relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Enter your name to start chatting..."
                        className="w-full bg-zinc-900/60 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500/50 transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest px-4 rounded-xl transition-colors cursor-pointer"
                    >
                      Join
                    </button>
                  </form>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                  {chatLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-zinc-500 text-xs font-semibold animate-pulse">Loading messages...</div>
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <MessageSquare size={28} className="text-zinc-700" />
                      <p className="text-zinc-600 text-xs text-center">No messages yet. Say hi to Eddy about this {car.name}!</p>
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.senderType === 'client' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          msg.senderType === 'client' 
                            ? 'bg-red-600/90 text-white rounded-br-md' 
                            : 'bg-zinc-800/80 text-zinc-200 rounded-bl-md border border-white/5'
                        }`}>
                          {msg.senderType === 'admin' && (
                            <span className="text-red-400 text-[9px] font-black uppercase tracking-widest block mb-1">Eddy</span>
                          )}
                          <p className="text-xs leading-relaxed">{msg.text}</p>
                          <span className={`text-[9px] mt-1 block ${
                            msg.senderType === 'client' ? 'text-red-200/60' : 'text-zinc-500'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={showNameInput ? 'Enter your name first...' : 'Type a message...'}
                    disabled={showNameInput}
                    className="flex-1 bg-zinc-900/60 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500/50 transition-all disabled:opacity-40"
                  />
                  <button 
                    type="submit" 
                    disabled={showNameInput || !inputMessage.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white p-3 rounded-xl transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}

         
          </div>

        </div>

      </div>
    </div>
  )
}

export default CarDetailsPage
