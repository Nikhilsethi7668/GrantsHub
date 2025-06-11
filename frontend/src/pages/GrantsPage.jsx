// GrantsPage.jsx
import { useState, useContext,useEffect } from 'react';
import { GrantsContext } from '../Context/GrantsContext';
import  DescriptionRenderer  from '../components/DescriptionRenderer'; // Assuming you have a component for rendering descriptions


const GrantsPage = () => {
    const { grants } = useContext(GrantsContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredGrants, setFilteredGrants] = useState(grants);
  useEffect(() => {
  // Clone before sorting to avoid mutating context
  const sortedGrants = [...grants].sort((a, b) => b.score - a.score);
  console.log("sortedGrants", sortedGrants);
  setFilteredGrants(sortedGrants);
}, [grants]); // only depend on 'grants'


    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter grants based on the search query
        const sortedGrants = [...grants].sort((a, b) => b.score - a.score);
        const filtered = sortedGrants.filter((grant) =>
                grant.title.toLowerCase().includes(query)
            );
            setFilteredGrants(filtered);
                };

    return (
        <div className="grants-page">
            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search grants..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Displaying Grant Cards */}
            <div className="grants-cards-container">
                {filteredGrants.length > 0 ? (
                    filteredGrants.map((grant) => (
                        <div key={grant.id} className="grant-card">
                            <h3>{grant.title}</h3>
                            <DescriptionRenderer indexToRender={1} data={grant?.description}/>
                        
                            <p>Amount: {grant.amount}</p>
                            {/* Add any additional grant details here */}
                        </div>
                    ))
                ) : (
                    <p>No grants found.</p>
                )}
            </div>
        </div>
    );
};

export default GrantsPage;
