import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

export default function Logout() {
    const { logout } = useContext(UserContext);

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Logout</h1>
            <p className="text-gray-600 mt-4">You’ve been logged out successfully!</p>
        </div>
    );
}
