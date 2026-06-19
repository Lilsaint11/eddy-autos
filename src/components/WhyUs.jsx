import React from 'react'
import { Tag, CreditCard, ShieldCheck, Clock, ThumbsUp, Wrench  } from 'lucide-react'


const WhyUs = () => {
  return (
    <div className='text-white px-15 py-30 flex gap-10' id='benefits'>
      <div className='flex flex-col gap-10'>
        <h2 className="text-white font-black font-medium text-4xl leading-14">
          Experience the  <br /> Benefits of Buying Your Next Car <br /> with{' '}
          <span className="text-red-500">Eddy Autos</span>
        </h2>

        <div className='flex gap-5'>

          <div className='bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 max-w-xs'>
            <h3 className='font-bold text-lg'>Competitive Pricing</h3>
            <p className='text-gray-400 text-sm leading-relaxed'>
              We source directly from trusted dealers and auctions so you get 
              the best market price, no hidden fees, no last-minute surprises. 
              Just fair, transparent pricing from the start.
            </p>
          </div>

          <div className='bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 max-w-xs'>
            <h3 className='font-bold text-lg'>Flexible Financing</h3>
            <p className='text-gray-400 text-sm leading-relaxed'>
              Whether you're paying upfront or spreading the cost, we offer 
              financing plans tailored to your budget. Get pre-approved in 
              minutes and drive away the same day.
            </p>
          </div>

        </div>
      </div>

        <div className='grid grid-cols-2 gap-5'>
            <div className='bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 max-w-xs'>
               
                <h3 className='font-bold text-lg'>Verified Vehicles</h3>
                <p className='text-gray-400 text-sm leading-relaxed'>
                    Every car on our lot goes through a rigorous multi-point inspection 
                    before it reaches you. Buy with confidence knowing exactly what you're getting.
                </p>
            </div>

            <div className='bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 max-w-xs'>
               
                <h3 className='font-bold text-lg'>Fast & Easy Process</h3>
                <p className='text-gray-400 text-sm leading-relaxed'>
                    From browsing to driving, we've cut out the paperwork headaches. 
                    Our streamlined process gets you behind the wheel in as little as 24 hours.
                </p>
            </div>

            <div className='bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 max-w-xs'>
              
                <h3 className='font-bold text-lg'>Trusted by Thousands</h3>
                <p className='text-gray-400 text-sm leading-relaxed'>
                    With over 2,400 happy customers and a 98% satisfaction rate, our 
                    reputation speaks for itself. Real people, real reviews, real results.
                </p>
            </div>

            <div className='bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 max-w-xs'>
               
                <h3 className='font-bold text-lg'>After-Sale Support</h3>
                <p className='text-gray-400 text-sm leading-relaxed'>
                    Our relationship doesn't end at the sale. We offer dedicated after-sale 
                    support, warranty options, and a service team ready to keep your car running perfectly.
                </p>
            </div>
        </div>

    </div>
  )
}

export default WhyUs