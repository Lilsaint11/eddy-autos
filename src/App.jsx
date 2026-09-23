import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link
} from "react-router-dom";

import Header from "./components/header";
import Hero from "./components/hero";
import Brand from "./components/Brand";
import AvailableCars from "./components/AvailableCars";
import WhyUs from "./components/WhyUs";
import Reviews from "./components/Reviews";
import FAQ from "./components/FAQ";
import FindUs from "./components/FindUs";
import Footer from "./components/Footer";
import CarDetailsPage from "./components/CarDetailsPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";

import { ChatProvider } from "./context/ChatContext";

// Home page
const Home = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleViewCar = (car) => {
    navigate(`/cars/${car.id}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Hero */}
      <div className="hero lg:h-screen flexx items-center justify-center flex-col">
        <Header onGoHome={handleGoHome} />
        <Hero />
      </div>

      <Brand />

      <AvailableCars
        onViewDetails={handleViewCar}
      />

      <WhyUs />
      <Reviews />
      <FAQ />
      <FindUs />
      <Footer />
    </>
  );
};

// Full cars/inventory page
const CarsPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header onGoHome={handleGoHome} />

      <main className="min-h-screen bg-zinc-950 pt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 text-sm tracking-widest uppercase font-bold transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>

        <AvailableCars />
      </main>

      <Footer />
    </>
  );
};

const App = () => {
  return (
    <ChatProvider>
      <BrowserRouter>
        <Routes>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Cars / Search */}
          <Route
            path="/cars"
            element={<CarsPage />}
          />

          {/* Individual car */}
          <Route
            path="/cars/:id"
            element={<CarDetailsPage />}
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          {/* Admin Login */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

        </Routes>
      </BrowserRouter>
    </ChatProvider>
  );
};

export default App;
