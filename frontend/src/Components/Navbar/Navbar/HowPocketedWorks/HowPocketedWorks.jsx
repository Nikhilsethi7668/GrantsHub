import React from 'react';
import { FaChartLine, FaAward } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import image from "../../../../images/work.webp";

const AboutCompany = () => {
  return (
    <section className="bg-white py-20 px-6 relative">
      {/* Orange shape top-left */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-0"></div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Content */}
        <div>
          <span className="text-orange-600 font-semibold uppercase mb-2 block">
          Our streamlined process makes finding and applying for grants effortless
          </span>
          <h2 className="text-6xl font-bold text-gray-900 mb-4">
          How GrantsHub  Works
          </h2>
          

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2 text-orange-600 text-xl font-semibold">              
                1 <FiArrowRight />
                Sign Up and Enrollment
              </div>
              <hr className="border-t-2 border-orange-500 w-20 mb-2" />
              <p className="text-gray-600 text-sm">
              Create your account and make the one-time payment of 120 CAD to access the grants database and matching tool.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2 text-orange-600 text-xl font-semibold">
              2 <FiArrowRight />
                Provide Business Information
              </div>
              <hr className="border-t-2 border-orange-500 w-20 mb-2" />
              <p className="text-gray-600 text-sm">
                Complete your business profile with industry, size, location, and project needs to help us identify the most suitable grant opportunities for your specific situation.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2 text-orange-600 text-xl font-semibold">
                3 <FiArrowRight />          
                Grant Matching
              </div>
              <hr className="border-t-2 border-orange-500 w-20 mb-2" />
              <p className="text-gray-600 text-sm">
              Our intelligent system uses your information to match you with the most relevant grants available across various government and private sources.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2 text-orange-600 text-xl font-semibold">
              4 <FiArrowRight />      
                Explore and Apply
              </div>
              <hr className="border-t-2 border-orange-500 w-20 mb-2" />
              <p className="text-gray-600 text-sm">
              Browse the grant options and use our DIY tools to write proposals, or escalate to professional grant writers for managed services.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2 text-orange-600 text-xl font-semibold">
              5 <FiArrowRight />  
                Receive Notifications
              </div>
              <hr className="border-t-2 border-orange-500 w-20 mb-2" />
              <p className="text-gray-600 text-sm">
              Get real-time updates on new grant opportunities, approaching deadlines, and the status of your applications.
              </p>
            </div>
          </div>

          
          <a href="/about">
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded transition">
            Learn More
            <FiArrowRight />
          </button>
          </a>
        </div>

        {/* Image & CTA */}
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Team"
            className=" shadow-lg w-full h-full object-cover"
          />
          <div className="absolute bottom-0 w-full left-0 bg-orange-500 text-white text-lg font-semibold px-6 py-4 shadow-lg">
            Experience Consulting Agency <span className="font-bold">Join With Us</span>
          </div>
        </div>
      </div>

      {/* Scroll Up button */}
      <div className="fixed bottom-5 right-5">
        <button className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition">
          ↑
        </button>
      </div>
    </section>
  );
};

export default AboutCompany;
