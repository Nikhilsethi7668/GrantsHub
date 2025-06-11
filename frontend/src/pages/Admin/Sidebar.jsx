import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
            <NavLink to="/admin/users" className="mb-4 text-lg hover:text-gray-300" activeClassName="text-gray-300">Users</NavLink>
            <NavLink to="/admin/grants" className="mb-4 text-lg hover:text-gray-300" activeClassName="text-gray-300">Grants</NavLink>
            <NavLink to="/admin/profile" className="mb-4 text-lg hover:text-gray-300" activeClassName="text-gray-300">Profile</NavLink>
            <button className="mt-auto bg-red-500 text-white py-2 rounded hover:bg-red-700">Logout</button>
        </div>
    );
};

export default Sidebar;
