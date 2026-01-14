import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { getPlayerPriceHistory } from '../../api';

function PlayerPriceChart({ playerId, playerName }) {
  const [priceData, setPriceData] = useState([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadPriceHistory() {
      setLoading(true);
      try {
        const data = await getPlayerPriceHistory(playerId, timeRange);
        
        const formattedData = data.map(point => ({
          timestamp: new Date(point.timestamp).getTime(),
          date: new Date(point.timestamp).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          price: parseFloat(point.price)
        }));

        setPriceData(formattedData);

        if (formattedData.length > 0) {
          const prices = formattedData.map(d => d.price);
          const firstPrice = prices[0];
          const lastPrice = prices[prices.length - 1];
          const change = lastPrice - firstPrice;
          const changePercent = ((change / firstPrice) * 100).toFixed(2);
          const high = Math.max(...prices);
          const low = Math.min(...prices);

          setStats({
            current: lastPrice,
            change,
            changePercent,
            high,
            low,
            firstPrice
          });
        }
      } catch (error) {
        console.error('Failed to load price history:', error);
      } finally {
        setLoading(false);
      }
    }

    if (playerId) {
      loadPriceHistory();
    }
  }, [playerId, timeRange]);

  const timeRanges = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '1M' },
    { value: '90d', label: '3M' },
    { value: '1y', label: '1Y' },
    { value: 'all', label: 'All' }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!priceData || priceData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4">Price History</h3>
        <div className="text-center py-12 text-gray-500">
          <Calendar size={48} className="mx-auto mb-3 opacity-50" />
          <p>No price history available</p>
        </div>
      </div>
    );
  }

  const isPositive = stats && stats.change >= 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Price History</h3>
          {stats && (
            <div className="flex items-center gap-4">
              <div>
                <p className="text-3xl font-bold text-gray-800">
                  ${stats.current.toFixed(2)}
                </p>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>
                    {isPositive ? '+' : ''}${stats.change.toFixed(2)} ({isPositive ? '+' : ''}{stats.changePercent}%)
                  </span>
                </div>
              </div>
              <div className="hidden md:block border-l pl-4">
                <p className="text-xs text-gray-500">High</p>
                <p className="font-bold text-gray-700">${stats.high.toFixed(2)}</p>
              </div>
              <div className="hidden md:block border-l pl-4">
                <p className="text-xs text-gray-500">Low</p>
                <p className="font-bold text-gray-700">${stats.low.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mt-4 md:mt-0">
          {timeRanges.map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={priceData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0.3}
              />
              <stop 
                offset="95%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fill="url(#colorPrice)"
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Mobile Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 md:hidden">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">High</p>
          <p className="font-bold text-gray-700">${stats?.high.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Low</p>
          <p className="font-bold text-gray-700">${stats?.low.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerPriceChart;