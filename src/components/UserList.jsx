import { useState, useEffect } from 'react';
import { getUsers } from '../api';
import UserCard from './UserCard';

function TopUsersList({ topN = 10 }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()
      .then(data => setUsers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading top users...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!users.length) return <p>No users found.</p>;

  const topUsers = users
    .sort((a, b) => b.currency - a.currency)
    .slice(0, topN);

  return (
    <div>
    <h2>Top {topN} Users</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {topUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
    </div>
  );
}

export default TopUsersList;
