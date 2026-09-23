import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/header';
import Hero from './components/hero';
import Brand from './components/Brand';
import AvailableCars from './components/AvailableCars';
import WhyUs from './components/WhyUs';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import FindUs from './components/FindUs';
import Footer from './components/Footer';
import CarDetailsPage from './components/CarDetailsPage';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { ChatProvider } from './context/ChatContext';

// Home page layout component
const Home = () => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleViewCar = (car) => {
    navigate(`/cars/${car.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
    <div className='hero lg:h-screen flexx items-center justify-center flex-col'>
      <Header onGoHome={handleGoHome} />
      <Hero />
    </div>
      <Brand />
      <AvailableCars onViewDetails={handleViewCar} />
      <WhyUs />
      <Reviews />
      <FAQ />
      <FindUs />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <ChatProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
    </ChatProvider>
  );
};

export default App;

