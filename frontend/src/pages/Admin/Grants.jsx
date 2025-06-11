import React from 'react';
import GrantCard from '../components/GrantCard';

const Grants = () => {
    const grants = [
        {
            OpportunityID: '262148',
            OpportunityTitle: 'Edmund S. Muskie Graduate Internship Program',
            AwardCeiling: 600000,
            AwardFloor: 400000,
            Description: 'The Office of Press and Public Diplomacy of the Bureau of South...',
        },
        // Add more grants here
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {grants.map(grant => (
                <GrantCard key={grant.OpportunityID} grant={grant} />
            ))}
        </div>
    );
};

export default Grants;
