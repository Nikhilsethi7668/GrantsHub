// import React, { useEffect, useRef } from "react";
// import { motion, useAnimation } from "framer-motion";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../Context/UserContext";


const logos = [
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiNuvdA60X9tQmlPWSA2qd2ZojccIVAes_HA&s",
    name: "Company 1"
  },
  {
    logo: "https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_2/5cd4996fffb03ac09c45",
    name: "Company 2"
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUG9vLVLmNOBhA90Ur2Z50kTxVxN8a0rQJ4A&s",
    name: "Company 3"
  },
  {
    logo: "https://images.unsplash.com/photo-1662947475743-35a389428742?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRlc2xhJTIwbG9nb3xlbnwwfHwwfHx8MA%3D%3D",
    name: "Company 4"
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGXCYuH5LG-xVd2kBKM01pZHsp2HSJXUxhtQ&s",
    name: "Company 5"
  },
];

const Companies = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleButtonClick = () => {
  if (user) {
    navigate("/profile");
    window.scrollTo(0, 0); 
  } else {
    navigate("/login");
    window.scrollTo(0, 0); 
  }
};

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h4 className="text-orange-500 font-semibold relative inline-block before:absolute before:w-3 before:h-1 before:bg-orange-500 before:-left-4 before:top-1/2 before:-translate-y-1/2 after:absolute after:w-3 after:h-1 after:bg-orange-500 after:-right-4 after:top-1/2 after:-translate-y-1/2">
            Trusted by
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold mt-4">
            Leading Companies
          </h2>
        </div>

        <div className="relative w-full overflow-hidden py-6">
          <div className="marquee flex items-center">
            <div className="marquee-content flex space-x-12 animate-marquee whitespace-nowrap">
              {[...logos, ...logos].map((company, index) => (
                <div key={`company-${index}`} className="inline-flex flex-col items-center mx-8">
                  <div className="relative h-16 w-32 flex items-center justify-center">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  {/* <p className="text-center text-gray-600 text-sm mt-3">
                    {company.name}
                  </p> */}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join industry leaders who trust our platform
          </p>
          <button 
            onClick={handleButtonClick}
            className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {user ? "View Profile" : "Become a Partner"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default Companies;