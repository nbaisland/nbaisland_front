import { useState, useEffect, useMemo } from "react";
import { Search, TrendingUp, TrendingDown, DollarSign, User, Trophy, Clock } from "lucide-react";
import { getUsers } from "../api";

function UserCard({ user }) {
  const hasProfit = user.totalValue > user.totalInvested;
  const profitLoss = user.totalValue - user.totalInvested;
  const profitPercent = user.totalInvested > 0 
    ? ((profitLoss / user.totalInvested) * 100).toFixed(2) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-xl">{user.name}</h3>
            {user.username && (
              <p className="text-sm text-gray-500">@{user.username}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Trophy size={20} />
          <span className="font-semibold">{user.rank || "-"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-1 text-green-600 text-sm mb-1">
            <DollarSign size={16} />
            <span className="font-medium">Currency</span>
          </div>
          <p className="text-xl font-bold text-green-700">
            {user.currency?.toLocaleString() || 0}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-1 text-blue-600 text-sm mb-1">
            <TrendingUp size={16} />
            <span className="font-medium">Portfolio</span>
          </div>
          <p className="text-xl font-bold text-blue-700">
            {user.totalValue?.toLocaleString() || 0}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center gap-1 text-purple-600 text-sm mb-1">
            <User size={16} />
            <span className="font-medium">Holdings</span>
          </div>
          <p className="text-xl font-bold text-purple-700">
            {user.activePositions || 0}
          </p>
        </div>

        <div className={`${hasProfit ? 'bg-green-50' : 'bg-red-50'} rounded-lg p-3`}>
          <div className={`flex items-center gap-1 ${hasProfit ? 'text-green-600' : 'text-red-600'} text-sm mb-1`}>
            {hasProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="font-medium">P/L</span>
          </div>
          <p className={`text-xl font-bold ${hasProfit ? 'text-green-700' : 'text-red-700'}`}>
            {profitPercent > 0 ? '+' : ''}{profitPercent}%
          </p>
        </div>
      </div>

      {user.recentTransactions && user.recentTransactions.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Clock size={16} />
            <span className="font-medium">Recent Activity</span>
          </div>
          <div className="space-y-2">
            {user.recentTransactions.slice(0, 3).map((txn, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 rounded p-2">
                <span className="font-medium text-gray-700">
                  {txn.type === 'BUY' ? '📈' : '📉'} {txn.playerName}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">x{txn.quantity}</span>
                  <span className={`font-semibold ${txn.type === 'BUY' ? 'text-red-600' : 'text-green-600'}`}>
                    {txn.type === 'BUY' ? '-' : '+'}{txn.totalValue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let res = users;
    if (search) {
      const s = search.toLowerCase();
      res = res.filter(u =>
        u.name.toLowerCase().includes(s) ||
        (u.username && u.username.toLowerCase().includes(s))
      );
    }
    res = [...res].sort((a, b) => {
      const dir = sortDir === "desc" ? -1 : 1;
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      if (aVal > bVal) return dir;
      if (aVal < bVal) return -dir;
      return 0;
    });
    return res;
  }, [users, search, sortKey, sortDir]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Leaderboard</h1>
          <p className="text-gray-600">Track player performance and rankings</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or username..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <select 
                value={sortKey} 
                onChange={e => setSortKey(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="name">Name</option>
                <option value="username">Username</option>
                <option value="currency">Currency</option>
                <option value="totalValue">Portfolio Value</option>
                <option value="rank">Rank</option>
              </select>
              
              <button
                onClick={() => setSortDir(prev => prev === "asc" ? "desc" : "asc")}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                {sortDir === "asc" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                <span>{sortDir === "asc" ? "Asc" : "Desc"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm mb-1">Active Traders</p>
            <p className="text-3xl font-bold text-gray-800">
              {users.filter(u => u.activePositions > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm mb-1">Total Volume</p>
            <p className="text-3xl font-bold text-gray-800">
              {users.reduce((sum, u) => sum + (u.totalValue || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}