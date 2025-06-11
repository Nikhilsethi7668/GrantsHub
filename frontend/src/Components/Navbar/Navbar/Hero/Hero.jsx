import React, { useContext } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../../../../Context/UserContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/payment");
    } else {
      navigate("/login");
    }
  };

  return (
    <header
      className="relative w-full h-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: "url('https://www.devsnews.com/template/bizzix/bizzix/assets/img/slider/slider-1.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0"></div>

      {/* Text Content */}
      <motion.div
        className="relative z-10 max-w-4xl px-6 md:px-16"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#222222]">
          Discover Your
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#222222]">
          Perfect Grant
        </h2>
        <p className="max-w-md mb-6 text-[#888888]">
          GrantsHub connects visionaries with tailored funding opportunities. Embark on your journey to success and innovation today.
        </p>
        <button 
          onClick={handleGetStarted}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded shadow font-semibold"
        >
          Get Started
        </button>
      </motion.div>
    </header>
  );
};

export default Hero;