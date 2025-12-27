import { useState, useEffect, useMemo } from 'react';
import { getPlayers } from '../api';
import PlayerCard from '../components/transaction/PlayerCard';
import { Search, TrendingUp, TrendingDown, Filter, Users, BarChart3 } from 'lucide-react';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(20);
  const [teamFilter, setTeamFilter] = useState("all");

  useEffect(() => {
    async function loadPlayers() {
      try {
        const data = await getPlayers();
        setPlayers(data);
      } catch (error) {
        console.error("Failed to load players:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, []);

  // Reset display limit when search changes
  useEffect(() => {
    setDisplayLimit(20);
  }, [search, teamFilter]);

  // Get unique teams for filter
  const teams = useMemo(() => {
    const uniqueTeams = [...new Set(players.map(p => p.team).filter(Boolean))];
    return uniqueTeams.sort();
  }, [players]);

  const filteredPlayers = useMemo(() => {
    let res = players;
    
    // Search filter
    if (search) {
      const s = search.toLowerCase();
      res = res.filter(p =>
        p.name.toLowerCase().includes(s) ||
        (p.team && p.team.toLowerCase().includes(s))
      );
    }

    // Team filter
    if (teamFilter !== "all") {
      res = res.filter(p => p.team === teamFilter);
    }

    // Sort
    res = [...res].sort((a, b) => {
      const dir = sortDir === "desc" ? -1 : 1;
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      if (aVal > bVal) return dir;
      if (aVal < bVal) return -dir;
      return 0;
    });

    return res;
  }, [players, search, sortKey, sortDir, teamFilter]);

  // Stats for the overview cards
  const stats = useMemo(() => {
    if (players.length === 0) return { total: 0, avgValue: 0, avgCapacity: 0, topPerformer: null };
    
    const avgValue = players.reduce((sum, p) => sum + (p.value || 0), 0) / players.length;
    const avgCapacity = players.reduce((sum, p) => sum + (p.capacity || 0), 0) / players.length;
    const topPerformer = [...players].sort((a, b) => (b.value || 0) - (a.value || 0))[0];

    return {
      total: players.length,
      avgValue: avgValue.toFixed(2),
      avgCapacity: avgCapacity.toFixed(1),
      topPerformer
    };
  }, [players]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading players...</p>
        </div>
      </div>
    );
  }

  const displayedPlayers = filteredPlayers.slice(0, displayLimit);
  const hasMore = displayLimit < filteredPlayers.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Player Database</h1>
          <p className="text-gray-600">Browse and analyze all available players</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Players</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm mb-1">Avg Value</p>
            <p className="text-3xl font-bold text-gray-800">{stats.avgValue}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="text-purple-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm mb-1">Avg Capacity</p>
            <p className="text-3xl font-bold text-gray-800">{stats.avgCapacity}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-md p-6 text-white">
            <p className="text-sm mb-1 opacity-90">Top Player</p>
            <p className="text-xl font-bold truncate">
              {stats.topPerformer?.name || "N/A"}
            </p>
            <p className="text-sm opacity-90">
              ${stats.topPerformer?.value?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or team..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Team Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={teamFilter}
                onChange={e => setTeamFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="capacity">Capacity</option>
              <option value="team">Team</option>
              <option value="points">Points</option>
              <option value="rebounds">Rebounds</option>
              <option value="assists">Assists</option>
            </select>

            {/* Sort Direction */}
            <button
              onClick={() => setSortDir(prev => prev === "asc" ? "desc" : "asc")}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 bg-white"
            >
              {sortDir === "asc" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              <span>{sortDir === "asc" ? "Asc" : "Desc"}</span>
            </button>
          </div>

          {/* Filter Results Info */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {displayedPlayers.length} of {filteredPlayers.length} players
            {(search || teamFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setTeamFilter("all");
                }}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Players Grid */}
        {displayedPlayers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {displayedPlayers.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 20)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                >
                  Load More Players ({filteredPlayers.length - displayLimit} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Users size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Players Found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearch("");
                setTeamFilter("all");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}