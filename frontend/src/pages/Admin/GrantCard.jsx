import React from 'react';

const GrantCard = ({ grant }) => {
    return (
        <div className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold">{grant.OpportunityTitle}</h3>
            <p>Award Ceiling: ${grant.AwardCeiling}</p>
            <p>Award Floor: ${grant.AwardFloor}</p>
            <p>{grant.Description}</p>
            <div className="flex gap-2 mt-4">
                <button className="text-purple-500 text-white px-4 py-2 rounded">Edit</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
        </div>
    );
};

export default GrantCard;
