import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Search } from "lucide-react"; // Example icon library
import { useNavigate } from "react-router-dom";

function AdminLayout() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logging out...");
        navigate("/login"); // Redirect to login
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="bg-gray-800 text-white w-64 p-4">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>
                <nav className="space-y-4">
                    <Link to="/admin/users" className="block hover:text-gray-400">
                        Users
                    </Link>
                    <Link to="/admin/grants" className="block hover:text-gray-400">
                        Grants
                    </Link>
                    <Link to="/admin/profile" className="block hover:text-gray-400">
                        Profile
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <div className="flex items-center justify-between bg-gray-100 p-4 shadow-md">
                    <div className="flex items-center space-x-4">
                        <Search className="w-5 h-5 text-gray-600" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="border border-gray-300 rounded p-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                {/* Content Outlet */}
                <div className="p-6 bg-gray-50 flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
