import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Footer from "./Footer";
import Sidebar from "./Navbar";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ProfileLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-screen flex bg-gray-50 text-gray-800">
      <div>
        

        {/* Mobile sidebar toggle button */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Sidebar - now with responsive classes */}
        <div
          className={`fixed md:relative z-50 w-64 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
        >
          <Sidebar
            isMobileOpen={sidebarOpen}
            onMobileToggle={() => setSidebarOpen(!sidebarOpen)}
            onMobileClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>
      {/* Main content area */}
      <div className="flex h-screen w-full md:w-[calc(100vw-256px)] overflow-y-auto flex-col">
        <main className="flex-grow flex flex-col p-2 pt-16 lg:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}