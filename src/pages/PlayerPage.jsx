import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {getPlayerByName, getPlayerPositions, getPlayerTransactions, getUsers} from '../api';
import TradeCard from "../components/TradeCard";
import PositionCard from "../components/positions/PositionCard";

function UserPage() {
  const { playerSlug } = useParams();

  const [player, setPlayer] = useState(null);
  const [positions, setPositions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const playerData = await getPlayerByName(playerSlug);
        if (!playerData) {
          console.error("Player not found");
          return;
        }
        setPlayer(playerData);

        const playerId = playerData.id;

        const [positionsData, tradesData, UsersData] = await Promise.all([
          getPlayerPositions(playerId),
          getPlayerTransactions(playerId),
          getUsers()
        ]);
        const userMap = {};
        UsersData.forEach(u => { userMap[u.id] = u });
        setPositions(positionsData);
        setTransactions(tradesData);
        setUsers(userMap)
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [playerSlug]);

  if (loading) return <p>Loading player...</p>;
  if (!player) return <p>Player not found</p>;

  return (
    <div>
      <h1>{player.name}</h1>
      <h2>Current Value: {player.value}</h2>

      <h2>Positions</h2>
        {positions.map( position => (
          <PositionCard
            key={`${position.player_id}-${position.user_id}`}
            position={position}
            user={users[position.user_id]}
          />
        ))}

      <h2>Transactions</h2>
        {transactions.map(transaction => (
          <TradeCard
            key={transaction.id}
            transaction={transaction}
            player={player}
            user={users[transaction.user_id]}
          />
        ))}
    </div>
  );
}

export default UserPage;
