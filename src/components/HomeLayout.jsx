import React from 'react'
import Header from './header'
import Hero from './hero'
import Brand from './Brand'
import AvailableCars from './AvailableCars'
import WhyUs from './WhyUs'
import Reviews from './Reviews'
import FAQ from './FAQ'
import FindUs from './FindUs'
import Footer from './Footer'

const HomeLayout = () => (
  <>
    <div className='hero h-screen w-full flex flex-col overflow-hidden'>
      <Header />
      <Hero />
    </div>
    <Brand />
    <AvailableCars />
    <WhyUs />
    <Reviews />
    <FAQ />
    <FindUs />
    <Footer />
  </>
)

export default HomeLayout
