import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserByUsername, getUserPositions, getUserTransactions, getPlayers } from '../api';
import { DollarSign, TrendingUp, TrendingDown, Activity, User, Briefcase, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import PositionCard from "../components/positions/PositionCard";
import TradeCard from "../components/TradeCard";

function StatCard({ icon: Icon, label, value, trend, trendValue, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6 border-2`}>
      <div className="flex items-center justify-between mb-2">
        <Icon size={24} />
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trend >= 0 ? '+' : ''}{trendValue}</span>
          </div>
        )}
      </div>
      <p className="text-sm opacity-80 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function PortfolioSummary({ positions, players }) {
  const totalValue = positions.reduce((sum, pos) => {
    const player = players[pos.player_id];
    return sum + (player ? player.value * pos.quantity : 0);
  }, 0);

  const totalInvested = positions.reduce((sum, pos) => sum + (pos.average_cost * pos.quantity), 0);
  const profitLoss = totalValue - totalInvested;
  const profitPercent = totalInvested > 0 ? ((profitLoss / totalInvested) * 100).toFixed(2) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Briefcase size={24} className="text-purple-600" />
        Portfolio Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Value</p>
          <p className="text-2xl font-bold text-gray-800">${totalValue.toFixed(2)}</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-gray-800">${totalInvested.toFixed(2)}</p>
        </div>
        <div className={`text-center p-4 rounded-lg ${profitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className="text-sm text-gray-600 mb-1">Profit/Loss</p>
          <p className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
          </p>
          <p className={`text-sm ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ({profitPercent >= 0 ? '+' : ''}{profitPercent}%)
          </p>
        </div>
      </div>
    </div>
  );
}

function TransactionHistory({ transactions, players, user }) {
  const [filter, setFilter] = useState('all'); // 'all', 'buy', 'sell'
  
  const filteredTransactions = transactions.filter(txn => {
    if (filter === 'all') return true;
    return txn.transaction_type.toLowerCase() === filter;
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Activity size={24} className="text-blue-600" />
          Transaction History
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('buy')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'buy' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Buys
          </button>
          <button
            onClick={() => setFilter('sell')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'sell' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sells
          </button>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TradeCard
              key={transaction.id}
              transaction={transaction}
              player={players[transaction.player_id]}
              user={user}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock size={48} className="mx-auto mb-3 opacity-50" />
            <p>No {filter !== 'all' ? filter : ''} transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function UserPage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [positions, setPositions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [players, setPlayers] = useState({});
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
        setPlayers(playerMap);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600">The user @{username} does not exist.</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalValue = positions.reduce((sum, pos) => {
    const player = players[pos.player_id];
    return sum + (player ? player.value * pos.quantity : 0);
  }, 0);

  const totalInvested = positions.reduce((sum, pos) => sum + (pos.average_cost * pos.quantity), 0);
  const profitLoss = totalValue - totalInvested;
  const profitPercent = totalInvested > 0 ? ((profitLoss / totalInvested) * 100).toFixed(2) : 0;

  const recentBuys = transactions.filter(t => t.transaction_type === 'BUY').length;
  const recentSells = transactions.filter(t => t.transaction_type === 'SELL').length;
  const netActivity = recentBuys - recentSells;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold shadow-lg">
              {user.username?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">@{user.username}</h1>
              {user.name && <p className="text-xl opacity-90">{user.name}</p>}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={DollarSign}
            label="Available Currency"
            value={`$${user.currency.toFixed(2)}`}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Portfolio Value"
            value={`$${totalValue.toFixed(2)}`}
            trend={profitLoss >= 0 ? 1 : -1}
            trendValue={`${profitPercent}%`}
            color="blue"
          />
          <StatCard
            icon={Briefcase}
            label="Active Positions"
            value={positions.length}
            color="purple"
          />
          <StatCard
            icon={Activity}
            label="Total Transactions"
            value={transactions.length}
            trend={netActivity >= 0 ? 1 : -1}
            trendValue={`${netActivity >= 0 ? '+' : ''}${netActivity}`}
            color="orange"
          />
        </div>

        {/* Portfolio Summary */}
        <div className="mb-6">
          <PortfolioSummary positions={positions} players={players} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Positions */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-green-600" />
              Active Positions ({positions.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {positions.length > 0 ? (
                positions.map(position => (
                  <PositionCard
                    key={position.id}
                    position={position}
                    player={players[position.player_id]}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No active positions</p>
                  <p className="text-sm mt-2">Start trading to build your portfolio</p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction History */}
          <TransactionHistory transactions={transactions} players={players} user={user} />
        </div>
      </div>
    </div>
  );
}

export default UserPage;