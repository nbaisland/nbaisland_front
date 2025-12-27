import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPlayerByName, getPlayerPositions, getPlayerTransactions, getUsers } from '../api';
import { 
  TrendingUp, 
  TrendingDown, 
  Users as UsersIcon, 
  Activity, 
  DollarSign,
  BarChart3,
  User,
  Clock,
  ArrowLeft,
  ShoppingCart
} from "lucide-react";
import TradeCard from "../components/TradeCard";
import PositionCard from "../components/positions/PositionCard";
import IslandCanvas from "../components/Island/IslandCanvas";

function StatBox({ icon: Icon, label, value, subValue, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
  };

  return (
    <div className={`${colorClasses[color]} border-2 rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={20} />
        <span className="text-sm font-medium opacity-90">{label}</span>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {subValue && <p className="text-xs opacity-75">{subValue}</p>}
    </div>
  );
}

function MarketActivity({ transactions, users }) {
  const [filter, setFilter] = useState('all');
  
  const recentTxns = transactions
    .filter(txn => filter === 'all' || txn.transaction_type.toLowerCase() === filter)
    .slice(0, 10);

  const totalVolume = transactions.reduce((sum, t) => sum + (t.price * t.quantity), 0);
  const buys = transactions.filter(t => t.transaction_type === 'BUY').length;
  const sells = transactions.filter(t => t.transaction_type === 'SELL').length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity size={24} className="text-blue-600" />
        Market Activity
      </h3>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Total Volume</p>
          <p className="text-lg font-bold text-gray-800">${totalVolume.toFixed(2)}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-green-600 mb-1">Buys</p>
          <p className="text-lg font-bold text-green-700">{buys}</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-xs text-red-600 mb-1">Sells</p>
          <p className="text-lg font-bold text-red-700">{sells}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('buy')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'buy' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Buys
        </button>
        <button
          onClick={() => setFilter('sell')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'sell' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Sells
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recentTxns.length > 0 ? (
          recentTxns.map(transaction => (
            <TradeCard
              key={transaction.id}
              transaction={transaction}
              user={users[transaction.user_id]}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity size={48} className="mx-auto mb-3 opacity-50" />
            <p>No {filter !== 'all' ? filter : ''} transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Shareholders({ positions, users }) {
  const sortedPositions = [...positions].sort((a, b) => b.quantity - a.quantity);
  const topHolders = sortedPositions.slice(0, 10);

  const totalShares = positions.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <UsersIcon size={24} className="text-purple-600" />
        Top Shareholders
      </h3>

      <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-600 mb-1">Total Shares Outstanding</p>
        <p className="text-2xl font-bold text-purple-700">{totalShares}</p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {topHolders.length > 0 ? (
          topHolders.map((position, idx) => {
            const user = users[position.user_id];
            const percentage = totalShares > 0 ? ((position.quantity / totalShares) * 100).toFixed(1) : 0;
            return (
              <div key={`${position.player_id}-${position.user_id}`} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Link 
                    to={`/user/${user?.username}`}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      idx === 0 ? 'bg-yellow-500' :
                      idx === 1 ? 'bg-gray-400' :
                      idx === 2 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="font-semibold">{user?.username || 'Unknown'}</span>
                  </Link>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{position.quantity} shares</p>
                    <p className="text-xs text-gray-500">{percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <UsersIcon size={48} className="mx-auto mb-3 opacity-50" />
            <p>No shareholders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerPage() {
  const { playerSlug } = useParams();
  const [player, setPlayer] = useState(null);
  const [positions, setPositions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState({});
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
        
        const [positionsData, tradesData, usersData] = await Promise.all([
          getPlayerPositions(playerId),
          getPlayerTransactions(playerId),
          getUsers()
        ]);
        
        const userMap = {};
        usersData.forEach(u => { userMap[u.id] = u; });
        
        setPositions(positionsData);
        setTransactions(tradesData);
        setUsers(userMap);
      } catch (error) {
        console.error("Error loading player data:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [playerSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading player...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Player Not Found</h2>
          <p className="text-gray-600">The player "{playerSlug}" does not exist.</p>
          <Link to="/players" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            ← Back to Players
          </Link>
        </div>
      </div>
    );
  }

  // Calculate market stats
  const totalShares = positions.reduce((sum, p) => sum + p.quantity, 0);
  const uniqueHolders = positions.length;
  const marketCap = player.value * totalShares;
  const avgHoldingSize = uniqueHolders > 0 ? (totalShares / uniqueHolders).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/players" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Players
        </Link>

        {/* Player Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-6 text-white">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{player.name}</h1>
              {player.team && (
                <p className="text-xl opacity-90 mb-3">{player.team}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                {player.position && (
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    {player.position}
                  </span>
                )}
                {player.number && (
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    #{player.number}
                  </span>
                )}
              </div>
            </div>
            <Link 
              to="/marketplace"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
            >
              <ShoppingCart size={20} />
              Trade Now
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatBox
            icon={DollarSign}
            label="Current Value"
            value={`$${player.value.toFixed(2)}`}
            subValue="per share"
            color="green"
          />
          <StatBox
            icon={BarChart3}
            label="Market Cap"
            value={`$${marketCap.toFixed(2)}`}
            subValue={`${totalShares} shares`}
            color="blue"
          />
          <StatBox
            icon={UsersIcon}
            label="Shareholders"
            value={uniqueHolders}
            subValue={`Avg: ${avgHoldingSize} shares`}
            color="purple"
          />
          <StatBox
            icon={Activity}
            label="Transactions"
            value={transactions.length}
            subValue="all time"
            color="orange"
          />
        </div>

        {/* Island Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Island Visualization</h3>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <IslandCanvas seed={playerSlug} />
          </div>
        </div>

        {/* Additional Stats */}
        {(player.points || player.rebounds || player.assists) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Season Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {player.points && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Points</p>
                  <p className="text-2xl font-bold text-blue-700">{player.points}</p>
                </div>
              )}
              {player.rebounds && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Rebounds</p>
                  <p className="text-2xl font-bold text-green-700">{player.rebounds}</p>
                </div>
              )}
              {player.assists && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Assists</p>
                  <p className="text-2xl font-bold text-purple-700">{player.assists}</p>
                </div>
              )}
              {player.capacity && (
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-600 mb-1">Capacity</p>
                  <p className="text-2xl font-bold text-orange-700">{player.capacity}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Shareholders positions={positions} users={users} />
          <MarketActivity transactions={transactions} users={users} />
        </div>
      </div>
    </div>
  );
}

export default PlayerPage;