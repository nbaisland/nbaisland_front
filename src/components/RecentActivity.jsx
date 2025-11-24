import { useState, useEffect } from 'react';
import { getHoldings, getPlayers } from '../api';
import TradeCard from './TradeCard';

function RecentTrades({ topN = 10 }) {
  const [holdings, setHoldings] = useState([]);
  const [players, setPlayers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [holdingsData, playersData] = await Promise.all([
          getHoldings(),
          getPlayers(),
        ]);

        // Build a map: { playerId: playerObj }
        const playerMap = {};
        playersData.forEach(p => { playerMap[p.id] = p; });

        setHoldings(holdingsData);
        setPlayers(playerMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p>Loading top holdings...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!holdings.length) return <p>No holdings found.</p>;
  console.log(holdings);

  const topHoldings = holdings
    .slice(0, topN);

  return (
    <div>
      <h2>Holdings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {topHoldings.map(holding => (
          <TradeCard
            key={holding.id}
            holding={holding}
            player={players[holding.player_id]}
          />
        ))}
      </div>
    </div>
  );
}

export default RecentTrades;
