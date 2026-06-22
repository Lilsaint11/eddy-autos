import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqData = [
  {
    question: 'How do I arrange a test drive?',
    answer: 'Scheduling is simple! Just select any car from our inventory and click "Book Test Drive", or get in touch with our showroom directly via phone or email. We will have the vehicle fully prepped, detailed, and ready for you upon arrival.'
  },
  {
    question: 'What kind of financing options do you offer?',
    answer: 'We offer custom financing solutions tailored to your credit profile and budget, including hire purchase, personal contract purchase, and lease options. You can apply for pre-approval online or speak with our finance desk to customize a payment structure.'
  },
  {
    question: 'Do you accept trade-ins?',
    answer: 'Yes, absolutely! We accept trade-ins for all makes and models. Bring your car in for a professional, fee-free appraisal, and we\'ll apply its top-market value directly toward the purchase of your next vehicle.'
  },
  {
    question: 'Are all your vehicles inspected and under warranty?',
    answer: 'Every single vehicle undergoes a rigorous multi-point physical, mechanical, and safety inspection by our certified technicians before being listed. Additionally, all cars come with a comprehensive 12-month dealer warranty and a clean vehicle history report.'
  },
  {
    question: 'Can you deliver vehicles nationwide?',
    answer: 'Yes! We offer safe, enclosed transport and delivery to your doorstep anywhere across the country. Speak with our logistics team to calculate shipping costs and arrange a convenient delivery window.'
  }
]

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="bg-zinc-950 py-20  max-md:py-10 px-5 md:px-12 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-red-500 font-black tracking-widest text-[10px] uppercase mb-3 block">
            HAVE QUESTIONS?
          </span>
          <h2 className="text-white font-black text-4xl mb-4 tracking-tight">
            Frequently Asked <span className="text-red-500">Questions</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Find quick answers to common questions about test drives, tailored financing options, vehicle trade-ins, and nationwide delivery services.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-4">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index
            return (
              <div
                key={index}
                className={`bg-zinc-900/40 border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-red-500/30 bg-zinc-900/70 shadow-[0_5px_20px_rgba(239,68,68,0.03)]' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-white font-bold text-lg hover:text-red-400 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle size={18} className={`transition-colors duration-300 ${isOpen ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                    <span className="pr-4">{item.question}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-zinc-500 group-hover:text-white transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-red-500' : ''
                    }`}
                  />
                </button>

                {/* Accordion Content Body */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed pl-14">
                    {item.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
