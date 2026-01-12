import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Search,
  ArrowUpDown,
  ShoppingCart,
  PieChart,
  BarChart3,
  Activity
} from 'lucide-react';
import { getUserPositions, getPlayers } from '../api';

function PositionRow({ position, player, onSellClick }) {
  const currentValue = player.value * position.quantity;
  const invested = position.average_cost * position.quantity;
  const profitLoss = currentValue - invested;
  const profitPercent = invested > 0 ? ((profitLoss / invested) * 100).toFixed(2) : 0;
  const isProfitable = profitLoss >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <Link 
          to={`/player/${player.slug}`}
          className="flex-1 hover:text-blue-600 transition-colors"
        >
          <h3 className="font-bold text-lg">{player.name}</h3>
          <p className="text-sm text-gray-500">{player.team}</p>
        </Link>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isProfitable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isProfitable ? '↑' : '↓'} {profitPercent}%
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-600 mb-1">Quantity</p>
          <p className="font-bold text-gray-800">{position.quantity}</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-600 mb-1">Avg Cost</p>
          <p className="font-bold text-gray-800">${position.average_cost.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-600 mb-1">Current Price</p>
          <p className="font-bold text-gray-800">${player.value.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-600 mb-1">Total Value</p>
          <p className="font-bold text-gray-800">${currentValue.toFixed(2)}</p>
        </div>
        <div className={`rounded p-2 ${isProfitable ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`text-xs mb-1 ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            Profit/Loss
          </p>
          <p className={`font-bold ${isProfitable ? 'text-green-700' : 'text-red-700'}`}>
            {isProfitable ? '+' : ''}${profitLoss.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t">
        <Link
          to={`/player/${player.slug}`}
          className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center"
        >
          View Details
        </Link>
        <button
          onClick={() => onSellClick(position, player)}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Sell
        </button>
      </div>
    </div>
  );
}

function PortfolioSummaryCard({ icon: Icon, label, value, subValue, color = "blue" }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-3">
        <Icon size={32} className="opacity-90" />
      </div>
      <p className="text-sm opacity-90 mb-1">{label}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {subValue && <p className="text-sm opacity-80">{subValue}</p>}
    </div>
  );
}

function TopPerformers({ positions, players }) {
  const topGainers = positions
    .map(pos => {
      const player = players[pos.player_id];
      if (!player) return null;
      const currentValue = player.value * pos.quantity;
      const invested = pos.average_cost * pos.quantity;
      const profitLoss = currentValue - invested;
      const profitPercent = invested > 0 ? ((profitLoss / invested) * 100) : 0;
      return { ...pos, player, profitLoss, profitPercent };
    })
    .filter(Boolean)
    .sort((a, b) => b.profitPercent - a.profitPercent)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp size={24} className="text-green-600" />
        Top Performers
      </h3>
      <div className="space-y-3">
        {topGainers.map((pos, idx) => (
          <div key={`${pos.player_id}-${pos.user_id}`} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                idx === 1 ? 'bg-gray-300 text-gray-700' :
                'bg-orange-400 text-orange-900'
              }`}>
                {idx + 1}
              </div>
              <div>
                <Link to={`/player/${pos.player.slug}`} className="font-semibold hover:text-blue-600">
                  {pos.player.name}
                </Link>
                <p className="text-xs text-gray-500">{pos.quantity} shares</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">+{pos.profitPercent.toFixed(2)}%</p>
              <p className="text-sm text-gray-600">${pos.profitLoss.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Allocation({ positions, players }) {
  const totalValue = positions.reduce((sum, pos) => {
    const player = players[pos.player_id];
    return sum + (player ? player.value * pos.quantity : 0);
  }, 0);

  const allocations = positions
    .map(pos => {
      const player = players[pos.player_id];
      if (!player) return null;
      const value = player.value * pos.quantity;
      const percentage = totalValue > 0 ? (value / totalValue * 100).toFixed(1) : 0;
      return { player, value, percentage };
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <PieChart size={24} className="text-purple-600" />
        Portfolio Allocation
      </h3>
      <div className="space-y-3">
        {allocations.map((alloc, idx) => (
          <div key={idx}>
            <div className="flex justify-between mb-1">
              <Link to={`/player/${alloc.player.slug}`} className="font-semibold text-sm hover:text-blue-600">
                {alloc.player.name}
              </Link>
              <span className="text-sm font-semibold">{alloc.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${alloc.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const { user } = useAuth();
  const [positions, setPositions] = useState([]);
  const [players, setPlayers] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('value');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    async function load() {
      if (!user) return;
      
      try {
        const [positionsData, playersData] = await Promise.all([
          getUserPositions(user.id),
          getPlayers()
        ]);

        const playerMap = {};
        playersData.forEach(p => { playerMap[p.id] = p; });

        setPositions(positionsData);
        setPlayers(playerMap);
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const filteredAndSortedPositions = useMemo(() => {
    let result = positions.filter(pos => {
      const player = players[pos.player_id];
      return player && player.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    result.sort((a, b) => {
      const playerA = players[a.player_id];
      const playerB = players[b.player_id];
      
      if (!playerA || !playerB) return 0;

      let aVal, bVal;
      
      switch (sortKey) {
        case 'value':
          aVal = playerA.value * a.quantity;
          bVal = playerB.value * b.quantity;
          break;
        case 'profit':
          aVal = (playerA.value * a.quantity) - (a.average_cost * a.quantity);
          bVal = (playerB.value * b.quantity) - (b.average_cost * b.quantity);
          break;
        case 'quantity':
          aVal = a.quantity;
          bVal = b.quantity;
          break;
        case 'name':
          aVal = playerA.name;
          bVal = playerB.name;
          break;
        default:
          return 0;
      }

      const dir = sortDir === 'desc' ? -1 : 1;
      if (aVal > bVal) return dir;
      if (aVal < bVal) return -dir;
      return 0;
    });

    return result;
  }, [positions, players, searchQuery, sortKey, sortDir]);

  // Calculate portfolio stats
  const stats = useMemo(() => {
    const totalValue = positions.reduce((sum, pos) => {
      const player = players[pos.player_id];
      return sum + (player ? player.value * pos.quantity : 0);
    }, 0);

    const totalInvested = positions.reduce((sum, pos) => 
      sum + (pos.average_cost * pos.quantity), 0
    );

    const profitLoss = totalValue - totalInvested;
    const profitPercent = totalInvested > 0 ? ((profitLoss / totalInvested) * 100).toFixed(2) : 0;

    return { totalValue, totalInvested, profitLoss, profitPercent };
  }, [positions, players]);

  const handleSellClick = (position, player) => {
    window.location.href = '/marketplace?tab=sell';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">My Portfolio</h1>
          <p className="text-gray-600">Track your holdings and performance</p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <PortfolioSummaryCard
            icon={DollarSign}
            label="Total Value"
            value={`$${stats.totalValue.toFixed(2)}`}
            color="blue"
          />
          <PortfolioSummaryCard
            icon={BarChart3}
            label="Total Invested"
            value={`$${stats.totalInvested.toFixed(2)}`}
            color="purple"
          />
          <PortfolioSummaryCard
            icon={stats.profitLoss >= 0 ? TrendingUp : TrendingDown}
            label="Profit/Loss"
            value={`${stats.profitLoss >= 0 ? '+' : ''}$${stats.profitLoss.toFixed(2)}`}
            subValue={`${stats.profitPercent >= 0 ? '+' : ''}${stats.profitPercent}%`}
            color={stats.profitLoss >= 0 ? 'green' : 'red'}
          />
          <PortfolioSummaryCard
            icon={Activity}
            label="Active Positions"
            value={positions.length}
            color="blue"
          />
        </div>

        {/* Quick Actions & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopPerformers positions={positions} players={players} />
          <Allocation positions={positions} players={players} />
        </div>

        {/* All Positions */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">All Positions ({positions.length})</h2>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <ShoppingCart size={20} />
              Trade More
            </Link>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search your positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="value">Total Value</option>
              <option value="profit">Profit/Loss</option>
              <option value="quantity">Quantity</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowUpDown size={18} />
              {sortDir === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>

          {/* Positions List */}
          {filteredAndSortedPositions.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedPositions.map(position => (
                <PositionRow
                  key={`${position.player_id}-${position.user_id}`}
                  position={position}
                  player={players[position.player_id]}
                  onSellClick={handleSellClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Activity size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-lg mb-2">No positions found</p>
              <Link to="/marketplace" className="text-blue-600 hover:text-blue-800 font-medium">
                Start trading →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}