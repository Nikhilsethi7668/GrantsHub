"use client"

import { motion } from "framer-motion"
import { Link, NavLink } from "react-router-dom"

const advisors = [
  {
    name: 'kane GTA Willumson',
    role: 'CEO & FOUNDER',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q0VPfGVufDB8fDB8fHww',
  },
  {
    name: 'David Souinx Potha',
    role: 'SR MARKETER',
    image: 'https://www.devsnews.com/template/bizzix/bizzix/assets/img/team/02.png',
  },
  {
    name: 'Konngo Pual Singh',
    role: 'APPS DEVELOPER',
    image: 'https://images.unsplash.com/photo-1600804889194-e6fbf08ddb39?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'David Souinx Potha',
    role: 'SR MARKETER',
    image: 'https://www.devsnews.com/template/bizzix/bizzix/assets/img/team/04.png',
  },
];

export default function AboutGrants() {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            <section
                className="relative bg-cover bg-center h-[300px] flex items-center justify-center pt-5 mt-20"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1672917187338-7f81ecac3d3f?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative text-center text-white z-10">
                    <h1 className="text-5xl font-bold mb-2">Grants</h1>
                    <p className="text-lg">
                        <span className="text-gray-300 text-xl">Home</span> &nbsp;•&nbsp; <span>Grants</span>
                    </p>
                </div>
            </section>

            

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EC5C0E] mb-8 text-center"
                >
                    Discover the World of Grants
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-3xl mx-auto text-center mb-12"
                >
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Unlock opportunities and fuel your dreams with grants. Whether you're a researcher, artist, entrepreneur, or
                        community leader, grants can provide the resources you need to make a difference.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        {...fadeInUp}
                        className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#EC5C0E] mb-4">What are Grants?</h2>
                        <p className="text-gray-700 mb-4">
                            Grants are non-repayable funds provided by grant makers, often a government department, corporation,
                            foundation, or trust, to eligible entities, usually non-profit organizations, educational institutions,
                            businesses, or individuals.
                        </p>
                        <p className="text-gray-700">
                            Unlike loans, grants do not need to be repaid, making them an attractive option for funding projects,
                            research, and initiatives that align with the grant maker's objectives.
                        </p>
                    </motion.div>
                    <motion.div
                        {...fadeInUp}
                        transition={{ ...fadeInUp.transition, delay: 0.3 }}
                        className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#EC5C0E] mb-4">Types of Grants</h2>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-[#EC5C0E]" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Research grants
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-[#EC5C0E]" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Project grants
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-[#EC5C0E]" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Capacity building grants
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-[#EC5C0E]" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Equipment and infrastructure grants
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-[#EC5C0E]" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Training and development grants
                            </li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.4 }}
                    className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#EC5C0E] mb-6">The Grant Application Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Steps to Success</h3>
                            <ol className="list-decimal list-inside text-gray-700 space-y-2">
                                <li>Identify suitable grant opportunities</li>
                                <li>Review eligibility criteria and guidelines</li>
                                <li>Develop a strong project proposal</li>
                                <li>Prepare a detailed budget</li>
                                <li>Submit the application before the deadline</li>
                                <li>Follow up and provide additional information if requested</li>
                                <li>If successful, comply with reporting requirements</li>
                            </ol>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Tips for a Winning Application</h3>
                            <ul className="text-gray-700 space-y-2">
                                <li>• Start early and give yourself plenty of time</li>
                                <li>• Read and follow the guidelines carefully</li>
                                <li>• Clearly articulate your project's goals and impact</li>
                                <li>• Use data and evidence to support your proposal</li>
                                <li>• Be realistic with your budget and timeline</li>
                                <li>• Proofread and edit your application thoroughly</li>
                                <li>• Seek feedback from colleagues or mentors</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                <section className="py-16 px-4 text-center bg-white">
      <h2 className="text-4xl font-bold mb-2">Talented Advisors</h2>
      <div className="w-16 h-1 bg-orange-500 mx-auto mb-6"></div>
      <p className="max-w-2xl mx-auto text-gray-600 mb-12">
        Our experienced advisors provide expert guidance to help you navigate the complex world of grants and maximize your funding opportunities.
      </p>

      <div className="flex flex-wrap justify-center gap-10">
        {advisors.map((advisor, index) => (
          <div key={index} className="w-48 flex flex-col items-center">
            <img
              src={advisor.image}
              alt={advisor.name}
              className="w-40 h-40 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-semibold">{advisor.name}</h3>
            <p className="text-orange-500 font-semibold text-sm mt-1">{advisor.role}</p>
          </div>
        ))}
      </div>
    </section>
                

                <motion.div
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.5 }}
                    className="mt-12 bg-[#EC5C0E] text-white p-8 rounded-lg shadow-lg text-center"
                >
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Grant Journey?</h2>
                    <p className="text-xl mb-6">
                        Explore our resources, connect with experts, and find the perfect grant for your project.
                    </p>
                    <NavLink to="/payment">
                        <button className="bg-white text-[#EC5C0E] font-bold py-3 px-6 rounded-full hover:bg-orange-100 transition duration-300">
                            Explore Grants Now
                        </button>
                    </NavLink>
                </motion.div>
            </div>
        </div>
    )
}