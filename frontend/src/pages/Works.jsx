import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const controls = useAnimation();

    const steps = [
        {
            title: 'Register',
            description: 'Create your GrantsHub account to get started. Signing up is quick and easy, requiring only a few details.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>,
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
            hoverEffect: {
                scale: 1.05,
                rotateZ: [0, -3, 3, 0],
                boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)'
            }
        },
        {
            title: 'Profile',
            description: 'Complete your profile to help us match you with relevant grants. The more detailed, the better!',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>,
            image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            bg: 'bg-gradient-to-br from-purple-400 to-purple-500',
            hoverEffect: {
                scale: 1.05,
                y: -10,
                boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)'
            }
        },
        {
            title: 'Discover',
            description: 'Browse and search for grants that match your interests and eligibility. Use filters to narrow your options.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>,
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            bg: 'bg-gradient-to-br from-purple-600 to-purple-700',
            hoverEffect: {
                scale: 1.05,
                rotateZ: [0, 5, -5, 0],
                boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)'
            }
        },
        {
            title: 'Apply',
            description: 'Use our tools and resources to prepare and submit your grant applications. Save drafts and track progress.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>,
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
            hoverEffect: {
                scale: 1.05,
                y: -10,
                boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)'
            }
        },
        {
            title: 'Track',
            description: 'Monitor the status of your applications and manage deadlines with automated reminders.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>,
            image: "https://images.unsplash.com/photo-1666537072157-440346cea066?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGF0YSUyMHRyYWNrfGVufDB8fDB8fHww",
            bg: 'bg-gradient-to-br from-purple-400 to-purple-500',
            hoverEffect: {
                scale: 1.05,
                rotateZ: [0, -3, 3, 0],
                boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)'
            }
        },
        {
            title: 'Succeed',
            description: 'Receive support and guidance throughout the grant lifecycle. Celebrate your achievements with us!',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>,
            image: "https://plus.unsplash.com/premium_photo-1671028545792-f3a4c084f807?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHN1Y2NlZWR8ZW58MHx8MHx8fDA%3D",
            bg: 'bg-gradient-to-br from-purple-600 to-purple-700',
            hoverEffect: {
                scale: 1.05,
                y: -10,
                boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)'
            }
        },
    ];

    const particlesInit = async (engine) => {
        await loadFull(engine);
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <section
                className="relative bg-cover bg-center h-[300px] flex items-center justify-center pt-5 mt-20"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1672917187338-7f81ecac3d3f?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative text-center text-white z-10">
                    <h1 className="text-5xl font-bold mb-2">How it Works</h1>
                    <p className="text-lg">
                        <span className="text-gray-300 text-xl">Home</span> &nbsp;•&nbsp; <span>How it works</span>
                    </p>
                </div>
            </section>

    <div className="container mx-auto px-6 py-16">
        {/* Title Section */}
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-[#F06310] mb-12 text-center"
        >
            How It Works
        </motion.h1>

        {/* Steps Section */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 relative"
                >
                    {/* Image with overlay */}
                    <div className="relative h-40 overflow-hidden rounded-t-lg">
                        <img 
                            src={step.image} 
                            alt={step.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>

                    {/* Icon overlapping image and content */}
                    <div className="absolute -top-6 left-6 z-10">
                        <div className="bg-[#F06310] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                            {step.icon}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h2>
                        <p className="text-gray-600 mb-6">{step.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Call to Action Section */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-12 text-center"
        >
            <p className="text-lg text-gray-700 mb-6">
                Ready to begin your journey? Register now and start applying for grants tailored to your needs.
            </p>
            <NavLink to="/payment">
                <button className="bg-[#F06310] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#d8560b] transition-colors shadow-md">
                    Get Started
                </button>
            </NavLink>
        </motion.div>
    </div>
</div>
    );
}