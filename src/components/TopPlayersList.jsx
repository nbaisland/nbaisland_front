import { useState, useEffect } from 'react';
import { getPlayers } from '../api';
import PlayerCard from './Player/PlayerCard';

function TopPlayersList({ topN = 10 }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPlayers()
      .then(data => setPlayers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading top players...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!players.length) return <p>No players found.</p>;

  const topPlayers = players
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);

  return (
    <div>
    <h2>Top {topN} Players</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {topPlayers.map(player => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
    </div>
  );
}

export default TopPlayersList;
