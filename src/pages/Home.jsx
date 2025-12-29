import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase, 
  Activity, 
  ArrowRight,
  Users,
  Trophy,
  Clock,
  Flame
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserPositions, getUserTransactions, getPlayers, getUsers } from '../api';
import PlayerCard from '../components/transaction/PlayerCard';
import PositionCard from '../components/positions/PositionCard';

function QuickStatCard({ icon: Icon, label, value, change, link, color = "blue" }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <Link to={link} className="block">
      <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow`}>
        <div className="flex items-center justify-between mb-3">
          <Icon size={32} className="opacity-90" />
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              change >= 0 ? 'bg-white/20' : 'bg-black/20'
            } px-2 py-1 rounded`}>
              {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{change >= 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <p className="text-sm opacity-90 mb-1">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </Link>
  );
}

function RecentActivity({ transactions, players }) {
  const recentTxns = transactions.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity size={24} className="text-blue-600" />
          Recent Activity
        </h2>
        <Link to="/transactions" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {recentTxns.length > 0 ? (
        <div className="space-y-3">
          {recentTxns.map((txn, idx) => {
            const player = players[txn.player_id];
            const isBuy = txn.transaction_type === 'BUY';
            return (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isBuy ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {isBuy ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {player?.name || 'Unknown Player'}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(txn.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">x{txn.quantity}</p>
                  <p className={`text-sm ${isBuy ? 'text-red-600' : 'text-green-600'}`}>
                    {isBuy ? '-' : '+'}${(txn.price * txn.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Activity size={48} className="mx-auto mb-3 opacity-50" />
          <p>No recent activity</p>
          <Link to="/marketplace" className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
            Start trading →
          </Link>
        </div>
      )}
    </div>
  );
}

function TopPositions({ positions, players }) {
  const topPositions = positions
    .map(pos => {
      const player = players[pos.player_id];
      if (!player) return null;
      const currentValue = player.value * pos.quantity;
      const invested = pos.average_cost * pos.quantity;
      const profitLoss = currentValue - invested;
      return { ...pos, player, currentValue, profitLoss };
    })
    .filter(Boolean)
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Briefcase size={24} className="text-purple-600" />
          Top Holdings
        </h2>
        <Link to="/positions" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {topPositions.length > 0 ? (
        <div className="space-y-3">
          {topPositions.map((pos, idx) => (
            <PositionCard
              key={`${pos.player_id}-${pos.user_id}`}
              position={pos}
              player={pos.player}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Briefcase size={48} className="mx-auto mb-3 opacity-50" />
          <p>No active positions</p>
          <Link to="/marketplace" className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
            Browse players →
          </Link>
        </div>
      )}
    </div>
  );
}

function TrendingPlayers({ players }) {
  const trending = Object.values(players)
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 6);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Flame size={24} className="text-orange-500" />
          Trending Players
        </h2>
        <Link to="/players" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {trending.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trending.map(player => (
            <PlayerCard key={player.id} player={player} showValue={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Users size={48} className="mx-auto mb-3 opacity-50" />
          <p>No players available</p>
        </div>
      )}
    </div>
  );
}

function Leaderboard({ users }) {
  const topUsers = users
    .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy size={24} className="text-yellow-500" />
          Leaderboard
        </h2>
        <Link to="/users" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {topUsers.length > 0 ? (
        <div className="space-y-3">
          {topUsers.map((user, idx) => (
            <Link
              key={user.id}
              to={`/user/${user.username}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                  idx === 1 ? 'bg-gray-300 text-gray-700' :
                  idx === 2 ? 'bg-orange-400 text-orange-900' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.username || user.name}</p>
                  <p className="text-xs text-gray-500">{user.activePositions || 0} positions</p>
                </div>
              </div>
              <p className="font-bold text-green-600">${(user.totalValue || 0).toFixed(2)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Trophy size={48} className="mx-auto mb-3 opacity-50" />
          <p>No rankings available</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const {user} = useAuth();
  const [positions, setPositions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [players, setPlayers] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      try {

        const [positionsData, transactionsData, playersData, usersData] = await Promise.all([
          getUserPositions(user.id),
          getUserTransactions(user.id),
          getPlayers(),
          getUsers()
        ]);

        const playerMap = {};
        playersData.forEach(p => { playerMap[p.id] = p; });

        setPositions(positionsData);
        const sortedTransactions = transactionsData.slice().sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        setTransactions(sortedTransactions);
        setPlayers(playerMap);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalValue = positions.reduce((sum, pos) => {
    const player = players[pos.player_id];
    return sum + (player ? player.value * pos.quantity : 0);
  }, 0);

  const totalInvested = positions.reduce((sum, pos) => sum + (pos.average_cost * pos.quantity), 0);
  const profitLoss = totalValue - totalInvested;
  const profitPercent = totalInvested > 0 ? ((profitLoss / totalInvested) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            Welcome back, {user?.username || 'Trader'}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your portfolio today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickStatCard
            icon={DollarSign}
            label="Available Currency"
            value={`$${user?.currency?.toFixed(2) || '0.00'}`}
            link="/marketplace"
            color="green"
          />
          <QuickStatCard
            icon={TrendingUp}
            label="Portfolio Value"
            value={`$${totalValue.toFixed(2)}`}
            change={parseFloat(profitPercent)}
            link="/positions"
            color="blue"
          />
          <QuickStatCard
            icon={Briefcase}
            label="Active Positions"
            value={positions.length}
            link="/positions"
            color="purple"
          />
          <QuickStatCard
            icon={Activity}
            label="Total Transactions"
            value={transactions.length}
            link="/transactions"
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RecentActivity transactions={transactions} players={players} />
          <TopPositions positions={positions} players={players} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrendingPlayers players={players} />
          </div>
          <div className="lg:col-span-1">
            <Leaderboard users={users} />
          </div>
        </div>
      </div>
    </div>
  );
}