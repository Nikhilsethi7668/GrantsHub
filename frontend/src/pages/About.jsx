'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  RocketLaunchIcon,
  PuzzlePieceIcon,
  GlobeAmericasIcon,
  BuildingLibraryIcon,
  ChartBarIcon, 
  DocumentMagnifyingGlassIcon, 
  UserGroupIcon, 
  TrophyIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline'
import { FaChartBar, FaTrophy,FaSearch } from 'react-icons/fa';
import { PiCoinsBold } from 'react-icons/pi'; 
import { NavLink } from 'react-router-dom'

export default function AboutUs() {
  const stats = [
    { value: '15K+', label: 'Active Grants', icon: DocumentMagnifyingGlassIcon, color: 'text-amber-500' },
    { value: '50K+', label: 'Successful Applicants', icon: UserGroupIcon, color: 'text-emerald-500' },
    { value: '$2B+', label: 'Funding Secured', icon: BanknotesIcon, color: 'text-purple-500' },
    { value: '98%', label: 'Satisfaction Rate', icon: SparklesIcon, color: 'text-blue-500' }
  ]

  const features = [
    {
      icon: DocumentMagnifyingGlassIcon,
      title: "Precision Matching",
      desc: "Our AI cross-references 27 factors to find your ideal grants",
      highlight: true
    },
    {
      icon: ChartBarIcon,
      title: "Success Forecasting",
      desc: "Predict your approval odds before you apply",
      highlight: false
    },
    {
      icon: UserGroupIcon,
      title: "Collaboration Hub",
      desc: "Secure workspace for teams to manage applications",
      highlight: true
    },
    {
      icon: ShieldCheckIcon,
      title: "Compliance Guardian",
      desc: "Automated tracking of reporting requirements",
      highlight: false
    },
    {
      icon: LightBulbIcon,
      title: "Template Engine",
      desc: "Smart templates that adapt to different grant types",
      highlight: true
    },
    {
      icon: ArrowsPointingOutIcon,
      title: "Impact Amplifier",
      desc: "Tools to showcase your organization's potential",
      highlight: false
    }
  ]

  
const services = [
  {
    icon: <RocketLaunchIcon className="h-8 w-8 text-[#EA580C] mb-4" />,
    title: 'Accelerate Growth',
    description: 'We help organizations secure funding 3x faster than traditional methods',
  },
  {
    icon: <PuzzlePieceIcon className="h-8 w-8 text-[#EA580C] mb-4" />,
    title: 'Simplify Complexity',
    description: 'Breaking down bureaucratic barriers to make funding accessible',
  },
  {
    icon: <GlobeAmericasIcon className="h-8 w-8 text-[#EA580C] mb-4" />,
    title: 'National Reach',
    description: 'Comprehensive coverage of funding sources across all Canadian provinces',
  },
  {
    icon: <BuildingLibraryIcon className="h-8 w-8 text-4xl text-[#EA580C] mb-4" />,
    title: 'Institutional Knowledge',
    description: 'Decades of combined experience in grant acquisition and management',
  },
];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <section
                className="relative bg-cover bg-center h-[300px] flex items-center justify-center pt-5 mt-20"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1672917187338-7f81ecac3d3f?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative text-center text-white z-10">
                    <h1 className="text-5xl font-bold mb-2">About Us</h1>
                    <p className="text-lg">
                        <span className="text-gray-300 text-xl">Home</span> &nbsp;•&nbsp; <span>About Us</span>
                    </p>
                </div>
            </section>
    <section className="py-16 px-4 md:px-16 bg-white flex flex-col md:flex-row items-center justify-between">
      {/* Left Side Images - Improved positioning and responsiveness */}
      <div className="relative w-full md:w-1/2 mb-10 md:mb-0 h-[400px] sm:h-[450px]">
        <img
          src="https://img.freepik.com/free-photo/creative-man-working-office_23-2147665346.jpg"
          alt="Team Collaboration"
          className="absolute w-4/5 h-4/5 object-cover rounded-lg shadow-lg z-10"
        />
        <div>
        <img
          src="https://img.freepik.com/free-photo/successful-business-team_1098-18155.jpg"
          alt="Professional Team"
          className="absolute top-[10%] left-[10%] w-4/5 h-4/5 object-cover border-4 border-white rounded-lg shadow-lg z-20"
        />
        </div>
      </div>

      {/* Right Side Content */}
      <div className="w-full md:w-1/2 md:pl-12">
        <p className="text-[#F97316] font-semibold text-sm mb-2">About Our Company</p>
        <h2 className="text-4xl font-bold mb-4 leading-snug">
        Empowering Your <br /> Funding Journey
        </h2>
        <p className="text-gray-600 mb-6">
        GrantsHub transforms the funding landscape with intelligent technology and deep institutional knowledge to maximize your success.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="flex items-center mb-2">
              <FaChartBar className="text-[#F97316] text-xl mr-2" />
              <h4 className="font-semibold">Best Marketing Analysis</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Our data-driven approach identifies the most promising funding opportunities based on your organization's profile and current market trends.
            </p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <FaTrophy className="text-[#F97316] text-xl mr-2" />
              <h4 className="font-semibold">More Than 1000+ Clients Trusted</h4>
            </div>
            <p className="text-gray-600 text-sm">
              We've helped over a thousand organizations secure crucial funding, with a success rate that consistently outperforms industry averages.
            </p>
          </div>
        </div>

      </div>
    </section>
    <section className="py-16 bg-white relative overflow-hidden">
  <div className="container mx-auto px-6">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        By the <span className="text-[#EA580C]">Numbers</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Quantifying our impact on the Canadian funding ecosystem
      </p>
    </motion.div>
    
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="w-40 h-40 rounded-full border-8 border-white bg-white shadow-lg flex items-center justify-center mb-4 group hover:border-[#EA580C]/20 transition-all duration-300">
            <div className="text-4xl font-bold text-[#EA580C] group-hover:text-[#EA580C]/90 transition-colors duration-300">
              {stat.value}
            </div>
          </div>
          <div className="text-center">
            <stat.icon className="h-8 w-8 mx-auto mb-2 text-[#EA580C]" />
            <h3 className="text-lg font-semibold text-gray-800">{stat.label}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  </div>

  {/* Decorative orange elements */}
  <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#EA580C]/10 blur-3xl -z-0"></div>
  <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#EA580C]/5 blur-3xl -z-0"></div>
    </section>
    <section className="py-16 px-4 md:px-16 bg-white">
      
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
      Our <span className="text-[#EA580C]">Operating</span> Principles
    </h2>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center mb-10">
      The foundation of everything we do at GrantsHub
    </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-center">{service.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="py-24 bg-white">
  <div className="container mx-auto px-6">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Intelligent <span className="text-[#EA580C]">Funding</span> Tools
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Harnessing technology to transform your funding strategy
      </p>
    </motion.div>
    
    <div className="space-y-12">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
        >
          <div className={`flex-shrink-0 w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
            <div className={`p-1 rounded-2xl ${feature.highlight ? 'bg-gradient-to-r from-[#EA580C] to-[#EA580C]/80' : 'bg-gray-100'}`}>
              <div className="bg-white p-8 rounded-xl h-full">
                <div className={`w-16 h-16 ${feature.highlight ? 'bg-[#EA580C]/10 text-[#EA580C]' : 'bg-gray-100 text-gray-600'} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className={`aspect-w-16 aspect-h-9 bg-gradient-to-br ${feature.highlight ? 'from-[#EA580C]/5 to-[#EA580C]/10' : 'from-gray-50 to-gray-100'} rounded-2xl overflow-hidden`}>
              {/* Placeholder for feature image/video */}
              <div className="w-full h-full flex items-center justify-center">
                {feature.highlight && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#EA580C]/10 animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
      
    </div>
  )
}