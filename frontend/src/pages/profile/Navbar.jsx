import React, { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  User as UserIcon,
  Bookmark as BookmarkIcon,
  Users as UsersIcon,
  LogOut as LogoutIcon,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';


function Divider({ className }) {
  return <div className={className} />;
}

export default function Sidebar({ isMobileOpen, onMobileToggle, onMobileClose }) {
  const { logout, user } = useContext(UserContext);
  // const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sidebar links data
  const mainLinks = [
    { to: "/profile", icon: HomeIcon, text: "Home" },
    { to: "/profile/explore-funding", icon: SearchIcon, text: "Explore Funding" },
    { to: "/profile/my-profile", icon: UserIcon, text: "My Profile" },
    { to: "/profile/payment-history", icon: FaMoneyBill, text: "Payment History" },
    { to: "/", icon: ArrowLeftIcon, text: "Back to Home" },
  ];

  const adminLinks = user?.admin
    ? [{ to: "/profile/admin/manage-users", icon: UsersIcon, text: "Manage Users" }]
    : [];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={onMobileToggle}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative h-full flex flex-col border-r border-gray-200 bg-white z-40 transition-all duration-300 ease-in-out ${isMobileOpen ? "left-0 w-64" : "-left-full md:left-0 w-20 md:w-64"
          }`}
      >
        {/* Logo */}

        <div className="flex items-center p-6 md:mt-0 mt-10 space-x-2 text-[#F6732E]">
          <img
            src="/grantshubLogo.webp" // Replace with your actual image filename
            alt="Logo"
            className="h-8 w-8 object-contain"
          />
          <span className={`text-xl font-bold text-[#F6732E] ${isMobileOpen ? "block" : "hidden md:block"}`}>
            Grantshub
          </span>
        </div>


        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="space-y-1">
            {mainLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors ${isActive
                      ? 'bg-orange-50 text-[#F6732E]'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <link.icon className="h-5 w-5" />
                  <span className={`ml-3 ${isMobileOpen ? "block" : "hidden md:block"}`}>
                    {link.text}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>

          {adminLinks.length > 0 && (
            <>
              <Divider className={`my-4 border-gray-200 ${isMobileOpen ? "block" : "hidden md:block"}`} />
              <h3 className={`px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${isMobileOpen ? "block" : "hidden md:block"}`}>
                Admin
              </h3>
              <ul className="space-y-1">
                {adminLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition-colors ${isActive
                          ? "bg-primary-100 text-primary-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className={`ml-3 ${isMobileOpen ? "block" : "hidden md:block"}`}>
                        {link.text}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => {
              logout();
              setIsMobileOpen(false);
            }}
            className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogoutIcon className="h-5 w-5" />
            <span className={`ml-3 ${isMobileOpen ? "block" : "hidden md:block"}`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onMobileClose}  // Changed from setIsMobileOpen(false)
        />
      )}
    </>
  );
}