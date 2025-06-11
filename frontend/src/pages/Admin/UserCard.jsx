import React from 'react';

const UserCard = ({ user, onDelete }) => {
    return (
        <div className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Paid: {user.isPaid ? 'Yes' : 'No'}</p>
            <p>Verified: {user.isVerified ? 'Yes' : 'No'}</p>
            <div className="flex gap-2 mt-4">
                <button className="text-purple-500 text-white px-4 py-2 rounded">Edit</button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => onDelete(user._id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default UserCard;
