"use client"

import { useContext, useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { UserContext } from "../../../Context/UserContext"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useContext(UserContext)

  // Dynamic styles based on scroll position
  const textColor = scrolled ? 'text-gray-800' : 'text-gray-800'
  const hoverTextColor = scrolled ? 'hover:text-[#F6732E]' : 'hover:text-[#F6732E]'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => setIsOpen(false), [location.pathname])

  const handleLogout = async () => {
    try {
      await logout()
      setShowLogoutConfirm(false)
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/grants", label: "Grants" },
    { path: "/how-it-works", label: "How It Works" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ]

  return (
    <>
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-medium bg-[#F6732E] text-white hover:bg-[#e56727] transition-all"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-100 transition-all duration-300`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <NavLink to="/" className="flex items-center group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ rotate: -15, scale: 0.9 }}
                className="p-1.5 rounded-full bg-orange-50 backdrop-blur-sm border border-orange-100"
              >
                <img
                  src="/grantshubLogo.webp"
                  alt="Logo"
                  className="h-8 w-8 object-contain"
                />
              </motion.div>
              <motion.span
                className="ml-2 text-xl font-bold text-gray-800"
                whileHover={{ scale: 1.05 }}
              >
                GrantsHub
              </motion.span>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-lg font-medium ${isActive
                      ? 'text-[#F6732E] font-semibold'
                      : 'text-gray-700 hover:text-[#F6732E]'
                    } transition-all`
                  }
                  onMouseEnter={() => setHoveredLink(link.path)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {link.label}
                  {(hoveredLink === link.path || location.pathname === link.path) && (
                    <motion.div
                      className="absolute bottom-0 h-0.5 bg-[#F6732E] -translate-x-1/2"
                      layoutId="nav-underline"
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </NavLink>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {!user?.isPaid && (
                    <NavLink
                      to="/preview"
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg font-medium transition-all ${isActive
                          ? 'text-[#F6732E] font-semibold'
                          : 'text-gray-700 hover:text-[#F6732E]'
                        }`
                      }
                    >
                      Preview
                    </NavLink>
                  )}
                  {user?.isPaid ? (
                    <>
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `px-4 py-2 rounded-lg font-medium transition-all ${isActive
                            ? 'text-[#F6732E] font-semibold'
                            : 'text-gray-700 hover:text-[#F6732E]'
                          }`
                        }
                      >
                        Profile
                      </NavLink></>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <NavLink
                        to="/payment"
                        className={`px-4 py-2 rounded-lg font-medium bg-[#F6732E] text-white shadow-lg hover:shadow-orange-500/30 transition-all`}
                      >
                        Upgrade
                      </NavLink>
                    </motion.div>
                  )}
                  <motion.button
                    onClick={() => setShowLogoutConfirm(true)}
                    className={`px-4 py-2 rounded-lg font-medium bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Out
                  </motion.button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={`px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-[#F6732E] transition-all`}
                  >
                    Login
                  </NavLink>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <NavLink
                      to="/register"
                      className={`px-4 py-2 rounded-lg font-medium bg-[#F6732E] text-white shadow-lg hover:shadow-orange-500/30 transition-all`}
                    >
                      Register
                    </NavLink>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.svg
                    key="close"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="menu"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                className="md:hidden  overflow-hidden mt-2"
              >
                <div className={`bg-white backdrop-blur-md border border-gray-200 rounded-xl p-2 space-y-1`}>
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.path}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-lg font-medium ${isActive
                            ? 'bg-orange-50 text-[#F6732E]'
                            : 'text-gray-700 hover:bg-gray-100'
                          } transition-all`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </motion.div>
                  ))}

                  <div className={`border-t border-gray-200 my-1`}></div>

                  {isAuthenticated ? (
                    <>
                      <NavLink
                        to="/preview"
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-lg font-medium ${isActive
                            ? 'bg-orange-50 text-[#F6732E]'
                            : 'text-gray-700 hover:bg-gray-100'
                          } transition-all`
                        }
                      >
                        Preview
                      </NavLink>
                      {user?.isPaid ? (
                        <motion.div initial={{ y: -10 }} animate={{ y: 0 }}>
                          <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                              `block px-4 py-3 rounded-lg font-medium ${isActive
                                ? 'bg-orange-50 text-[#F6732E]'
                                : 'text-gray-700 hover:bg-gray-100'
                              } transition-all`
                            }
                          >
                            Profile
                          </NavLink>
                        </motion.div>
                      ) : (
                        <motion.div initial={{ y: -10 }} animate={{ y: 0 }}>
                          <NavLink
                            to="/payment"
                            className={`block px-4 py-3 rounded-lg font-medium text-center bg-[#F6732E] text-white`}
                          >
                            Upgrade
                          </NavLink>
                        </motion.div>
                      )}
                      <motion.button
                        onClick={() => setShowLogoutConfirm(true)}
                        className={`w-full px-4 py-3 rounded-lg font-medium mt-1 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50`}
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                      >
                        Sign Out
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.div initial={{ y: -10 }} animate={{ y: 0 }}>
                        <NavLink
                          to="/login"
                          className={`block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100`}
                        >
                          Login
                        </NavLink>
                      </motion.div>
                      <motion.div initial={{ y: -10 }} animate={{ y: 0 }}>
                        <NavLink
                          to="/register"
                          className={`block px-4 py-3 rounded-lg font-medium text-center bg-[#F6732E] text-white`}
                        >
                          Register
                        </NavLink>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  )
}

export default Navbar