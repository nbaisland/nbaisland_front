import { useState, useEffect } from 'react';
import { getTransactions, getPlayers, getUsers } from '../api';
import TradeCard from './TradeCard';
import './RecentActivity.css';

function RecentTrades({ topN = 10 }) {
  const [transactions, setTransactions] = useState([]);
  const [players, setPlayers] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [transactionsData, playersData, userData] = await Promise.all([
          getTransactions(),
          getPlayers(),
          getUsers(),
        ]);

        const userMap = {}
        userData.forEach(u => { userMap[u.id] = u});
        const playerMap = {};
        playersData.forEach(p => { playerMap[p.id] = p; });
        setTransactions(transactionsData);
        setPlayers(playerMap);
        setUsers(userMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p>Loading top transactions...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!transactions.length) return <p>No transactions found.</p>;

  const toptransactions = transactions
    .slice(0, topN);

  return (
    <div>
  <h2>Recent Transactions</h2>
  
  <div className="transaction-card headers">
    <p className="quantity">Qty</p>
    <p className="timestamp">Time</p>
    <p className="price">Price</p>
    <p className="type">Type</p>
    <p className="player">Player</p>
    <p className="user">User</p>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
    {toptransactions.map(transaction => (
      <TradeCard
        key={transaction.id}
        transaction={transaction}
        player={players[transaction.player_id]}
        user={users[transaction.user_id]}
      />
    ))}
  </div>
</div>
  );
}

export default RecentTrades;
