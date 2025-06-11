"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Mail, Github, Twitter, Linkedin, Phone } from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
      setEmail("")
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
  }

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Mail className="h-5 w-5" />, href: "#", label: "Email" },
  ]

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Grants", path: "/grants" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <>
      {/* Pre-footer sections */}
      <div className="relative bg-black">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Background"
            className="h-full w-full object-cover opacity-70 "
          />
          <div className="absolute inset-0 bg-black/80"></div>
        </div>

        <div className="container relative mx-auto px-4 py-16 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Consultation section */}
            <motion.div
              className="bg-white/10 p-8 rounded-lg backdrop-blur-sm border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Need A Consultation?</h3>
              <div className="flex items-center space-x-4">
                <div className="bg-[#F26711] p-3 rounded-full">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Phone</p>
                  <p className="text-white text-xl font-semibold">+1 (800) 123-4567</p>
                </div>
              </div>
            </motion.div>

            {/* Newsletter section */}
            {/* <motion.div
              className="bg-white/10 p-8 rounded-lg backdrop-blur-sm border border-white/10"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Subscribe Newsletters</h3>
              <p className="text-white/80 mb-6">Enter your email</p>
              <form onSubmit={handleSubmit} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-grow h-12 px-4 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#F26711] rounded-l-lg"
                  required
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-[#F26711] text-white font-medium hover:bg-[#e05d0a] transition-colors rounded-r-lg"
                >
                  Subscribe
                </button>
              </form>
            </motion.div> */}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <footer className="relative overflow-hidden bg-[#1a1a1a]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#F26711]/20 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#F26711]/10 blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* About section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="mb-6 inline-block rounded-lg bg-[#F26711]/30 px-3 py-1 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <span className="bg-gradient-to-r from-white to-[#F26711] bg-clip-text text-xl font-bold text-transparent cursor-pointer">
                  GrantsHub
                </span>
              </motion.div>
              <motion.p
                className="mb-6 max-w-md text-gray-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                GrantsHub is dedicated to connecting innovators, researchers, and dreamers with the funding they need to
                make a difference.
              </motion.p>
              {/* <motion.div
                className="flex space-x-4"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    variants={item}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F26711]/30 text-white transition-colors hover:bg-[#F26711] hover:text-white"
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </motion.div> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="mb-6 text-lg font-semibold text-white">Quick Links</h3>
              <motion.ul
                className="flex flex-wrap gap-3 sm:block sm:space-y-3"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {quickLinks.map((link, index) => (
                  <motion.li key={index} variants={item} className="mb-2 sm:mb-0">
                    <Link
                      to={link.path}
                      onClick={() => window.scrollTo(0, 0)}
                      className="group flex items-center text-gray-300 transition-all duration-300 hover:text-white gap-2"
                    >
                      <motion.span
                        className=" h-0 w-0 opacity-0 transition-all duration-300 group-hover:h-auto group-hover:w-4 group-hover:opacity-100"
                        initial={{ width: 0 }}
                        whileHover={{ width: "16px" }}
                      >
                        <ArrowRight className="h-4 w-4  text-[#F26711]" />
                      </motion.span>
                      {link.name} 
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Resources section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="mb-6 text-lg font-semibold text-white">Resources</h3>
              <motion.div
                className="space-y-4"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <motion.div variants={item} className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                  <h4 className="mb-2 font-medium text-white">Grant Writing Tips</h4>
                  <p className="text-sm text-gray-300">Access our free resources to improve your grant applications.</p>
                  <motion.div whileHover={{ x: 5 }} className="mt-2">
                    <Link to={"/about"} className="text-sm font-medium text-[#F26711] hover:text-white flex items-center gap-1">
                      Learn more <ArrowRight className="h-3.5 w-3.5 mt-[3px]" />
                    </Link>
                  </motion.div>
                </motion.div>
                <motion.div variants={item} className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                  <h4 className="mb-2 font-medium text-white">Funding Calendar</h4>
                  <p className="text-sm text-gray-300">Stay updated with upcoming grant deadlines and opportunities.</p>
                  <motion.div whileHover={{ x: 5 }} className="mt-2">
                    <Link to={"/about"} className=" text-sm font-medium text-[#F26711] hover:text-white flex items-center gap-1">
                     <span>Learn more</span>  <span><ArrowRight className="h-3.5 w-3.5 mt-[3px]" /></span>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Contact section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="mb-6 text-lg font-semibold text-white">Contact Us</h3>
              <motion.div
                className="space-y-4"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <motion.div variants={item} className="flex items-center space-x-3">
                  <Mail className="h-7 w-7 text-[#F26711] mt-1" />
                  <div>
                    <h4 className="font-medium text-white">Email</h4>
                    <p className="text-sm text-gray-300">info@grantshub.com</p>
                  </div>
                </motion.div>
                <motion.div variants={item} className="flex items-center space-x-3">
                  <Phone className="h-7 w-7 text-[#F26711] mt-1" />
                  <div>
                    <h4 className="font-medium text-white">Phone</h4>
                    <p className="text-sm text-gray-300">+812 (345) 678 99</p>
                  </div>
                </motion.div>
                <motion.div variants={item} className="pt-4">
                  <h4 className="font-medium text-white mb-2">Office Hours</h4>
                  <p className="text-sm text-gray-300">Monday - Friday: 9am - 6pm</p>
                  <p className="text-sm text-gray-300">Saturday: 10am - 4pm</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Footer bottom */}
          <motion.div
            className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <motion.p  className="flex flex-wrap items-center justify-center gap-2">
              <span>&copy; {new Date().getFullYear()} GrantsHub.</span>
              <span className="h-1 w-1 rounded-full bg-gray-500"></span>
              <span>All rights reserved.</span>
              <span className="h-1 w-1 rounded-full bg-gray-500"></span>
              <Link href="/terms" className="hover:text-[#F26711]">
                Terms
              </Link>
              <span className="h-1 w-1 rounded-full bg-gray-500"></span>
              <Link href="/privacy" className="hover:text-[#F26711]">
                Privacy
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </footer>
    </>
  )
}