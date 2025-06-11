"use client";

import { useContext, useState, useEffect, useCallback } from "react";
import { GrantsContext } from "../../Context/GrantsContext";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCloudDownload,
} from "react-icons/ai";
import {
  FaHandshake,
  FaLightbulb,
  FaLink,
} from "react-icons/fa";
import { motion } from "framer-motion";
import DescriptionRenderer from "../../Components/DescriptionRender";
import Footer from "../profile/Footer";
import Navbar from "../../Components/Navbar/Navbar/Navbar";

export default function FundingPreview() {
  const { isLoading, matchedGrants } = useContext(GrantsContext);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-orange-50">
      {/* Navbar on the left */}
      <div className="w-64 fixed z-50 left-0 top-0 h-full">
        <Navbar />
      </div>

      {/* Main content on the right */}
      <div className="flex-1 mt-16">
        {isLoading ? (
          <motion.div
            className="flex justify-center items-center h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AiOutlineLoading3Quarters className="animate-spin text-5xl text-orange-500" />
          </motion.div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl font-bold text-orange-600 mb-4"
              >
                Explore Funding Opportunities preview
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-orange-700 mb-8"
              >
                Discover grants that align with your innovation goals
              </motion.p>
            </div>

            {matchedGrants && matchedGrants.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 !z-0 lg:grid-cols-3 gap-8"
                >
                  {matchedGrants.map((grant, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-white relative z-0 rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-opacity-90"
                    >
                      {/* Gradient border line at the top */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-t-2xl" />

                      <div className="flex items-center mb-4">
                        <div className="bg-orange-100 rounded-full p-3">
                          <FaHandshake className="text-orange-500 text-2xl" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 ml-4">
                          {grant.programName}
                        </h2>
                      </div>

                      {/* Blurred Description */}
                      <div className="relative overflow-hidden rounded-lg border border-gray-200 mb-4">
                        <div className="blur-sm select-none pointer-events-none p-2">
                          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero accusantium voluptates ipsa voluptate exercitationem, porro ducimus incidunt neque accusamus eos eveniet quia id debitis nostrum deleniti consequuntur provident non sed laborum modi dolorem sequi magni fuga.
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm text-sm font-medium text-gray-600">
                          Upgrade to view full description
                        </div>
                      </div>

                      {/* Disabled Button with Premium Badge */}
                      <div className="flex items-center justify-between">
                        <a href="/payment">
                          <button
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg"
                          >
                            <FaLink className="mr-2  " />
                            Upgrade Now
                          </button>
                        </a>

                        <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                          Premium Only
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <FaLightbulb className="text-5xl text-orange-500 mx-auto mb-4" />
                <p className="text-xl text-gray-600">
                  No matching grants found. Try adjusting your criteria.
                </p>
              </div>
            )}
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}