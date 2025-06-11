import React from 'react';

const Profile = () => {
    const admin = {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
    };

    return (
        <div className="border p-4 rounded shadow">
            <h2 className="text-2xl font-bold">Admin Profile</h2>
            <p>First Name: {admin.firstName}</p>
            <p>Last Name: {admin.lastName}</p>
            <p>Email: {admin.email}</p>
        </div>
    );
};

export default Profile;
