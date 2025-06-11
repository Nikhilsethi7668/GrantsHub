import React, { useContext, useState } from 'react';
import UserCard from './UserCard';
import { UserContext } from '../../Context/UserContext';
// import UserCard from '../components/UserCard';


const Users = () => {
    const { users } = useContext(UserContext);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    const handleDelete = (id) => {
        setUsers(users.filter(user => user._id !== id));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded"
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Filter by</option>
                    <option value="paid">Paid</option>
                    <option value="verified">Verified</option>
                </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {users
                    .filter(user =>
                        user.firstName.toLowerCase().includes(search.toLowerCase()) &&
                        (filter === 'paid' ? user.isPaid : filter === 'verified' ? user.isVerified : true)
                    )
                    .map(user => (
                        <UserCard key={user._id} user={user} onDelete={handleDelete} />
                    ))}
            </div>
        </div>
    );
};

export default Users;
