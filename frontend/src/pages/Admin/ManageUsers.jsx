import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Context/UserContext';
import { deleteUser } from '../../store/useAuthStore';

const ManageUsers = () => {
    const { allUsers, loading, error, getAllUsers } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all users when the component mounts
    useEffect(() => {
        getAllUsers();
    }, []);

    // Handle user deletion
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                // Call your API to delete the user
                const response = await deleteUser(userId);
                console.log("Deleting user with ID:", userId);
                // After deletion, refetch the users
                await getAllUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    // Handle user editing
    const handleEditUser = (userId) => {
        console.log("Editing user with ID:", userId);
        // Navigate to an edit page or open a modal
    };

    // Filter users based on search query
    const filteredUsers = allUsers.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        const query = searchQuery.toLowerCase();

        return fullName.includes(query) || email.includes(query);
    });


    if (error) {
        return <div className="text-red-500 text-center mt-8">{error}</div>;
    }

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Manage Users</h1>

            {/* Search Bar */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-2">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* User Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredUsers.map((user) => (
                    <div key={user._id} className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-gray-600 mb-2 text-sm sm:text-base">{user.email}</p>

                        {/* User Details Section */}
                        <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                            <p className="text-gray-600">
                                <span className="font-semibold">Role:</span>{" "}
                                {user.admin ? "Admin" : "User"}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Business:</span>{" "}
                                {user.business ? "Yes" : "No"}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Paid:</span>{" "}
                                {user.isPaid ? "Yes" : "No"}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Verified:</span>{" "}
                                {user.isVerified ? "Yes" : "No"}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Last Login:</span>{" "}
                                {new Date(user.lastLogin).toLocaleString()}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Stripe ID:</span>{" "}
                                {user.stripeCustomerId || "N/A"}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Last Payment:</span>{" "}
                                {user.lastPaymentDate
                                    ? new Date(user.lastPaymentDate).toLocaleString()
                                    : "N/A"}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 sm:space-x-4 mt-4">
                            <button
                                onClick={() => handleEditUser(user._id)}
                                className="w-full sm:w-auto text-purple-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="w-full sm:w-auto bg-red-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageUsers;