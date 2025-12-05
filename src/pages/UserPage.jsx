import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {getUserByUsername, getUserPositions, getUserTransactions, getPlayers} from '../api';
import TradeCard from "../components/TradeCard";
import PositionCard from "../components/positions/PositionCard";

function UserPage() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [positions, setPositions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userData = await getUserByUsername(username);
        if (!userData) {
          console.error("User not found");
          return;
        }
        setUser(userData);

        const userId = userData.id;

        const [positionsData, tradesData, playersData] = await Promise.all([
          getUserPositions(userId),
          getUserTransactions(userId),
          getPlayers()
        ]);
        const playerMap = {};
        playersData.forEach(p => { playerMap[p.id] = p; });
        setPositions(positionsData);
        setTransactions(tradesData);
        setPlayers(playerMap)
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [username]);

  if (loading) return <p>Loading user...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h1>{user.username}</h1>
      <h2>Currency: {user.currency}</h2>

      <h2>Positions</h2>
      <pre>
        {positions.map( position => (
          <PositionCard
            position={position}
            player={players[position.player_id]}
          />
        ))}
      </pre>
          

      <h2>Transactions</h2>
      <pre>
        {transactions.map(transaction => (
          <TradeCard
            key={transaction.id}
            transaction={transaction}
            player={players[transaction.player_id]}
            user={user}
          />
        ))}
      </pre>
    </div>
  );
}

export default UserPage;
