import { useState, useEffect, useMemo } from 'react';
import { getPlayers } from '../api';
import PlayerCard from '../components/Player/PlayerCard';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    async function loadPlayers() {
      const data = await getPlayers();
      setPlayers(data);
    }
    loadPlayers();
  }, []);

  const filteredPlayers = useMemo(() => {
    let res = players;

    if (search) {
      const s = search.toLowerCase();
      res = res.filter(p =>
        p.name.toLowerCase().includes(s) ||
        (p.team && p.team.toLowerCase().includes(s))
      );
    }

    res = [...res].sort((a, b) => {
      const dir = sortDir === "desc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return dir;
      if (a[sortKey] < b[sortKey]) return -dir;
      return 0;
    });

    return res;
  }, [players, search, sortKey, sortDir]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Players</h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />

        <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
          <option value="name">Name</option>
          <option value="points">Points</option>
          <option value="rebounds">Rebounds</option>
          <option value="assists">Assists</option>
        </select>

        <select value={sortDir} onChange={e => setSortDir(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredPlayers.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
