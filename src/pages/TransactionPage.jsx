import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, TrendingUp, ShoppingCart, TrendingDown, DollarSign } from 'lucide-react';
import PurchaseSummary from '../components/transaction/PurchaseSummary';
import PlayerCard from '../components/transaction/PlayerCard';
import { getPlayers, transactionBuy, transactionSell, getUserPositions } from '../api';

function SellSummary({ position, player, quantity, onSell, onCancel }) {
  const totalValue = player.value * quantity;
  const invested = position.average_cost * quantity;
  const profitLoss = totalValue - invested;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Confirm Sale</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Player:</span>
            <span className="font-semibold">{player.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Price:</span>
            <span className="font-semibold">{player.value} coins</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-semibold">{quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Your Avg Cost:</span>
            <span className="font-semibold">{position.average_cost} coins</span>
          </div>
          <div className="flex justify-between pt-3 border-t-2">
            <span className="text-gray-600">You'll Receive:</span>
            <span className="font-bold text-xl text-green-600">{totalValue} coins</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Profit/Loss:</span>
            <span className={`font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} coins
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSell}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm Sale
          </button>
        </div>
      </div>
    </div>
  );
}

function HoldingCard({ position, player, onSell }) {
  const currentValue = player.value * position.quantity;
  const invested = position.average_cost * position.quantity;
  const profitLoss = currentValue - invested;
  const profitPercent = invested > 0 ? ((profitLoss / invested) * 100).toFixed(2) : 0;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{player.name}</h3>
          <p className="text-sm text-gray-500">Quantity: {position.quantity}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-semibold ${
          profitLoss >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {profitLoss >= 0 ? '+' : ''}{profitPercent}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-600">Avg Cost</p>
          <p className="font-semibold">${position.average_cost.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-600">Current Price</p>
          <p className="font-semibold">${player.value.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t">
        <div>
          <p className="text-xs text-gray-600">Total Value</p>
          <p className="font-bold text-lg">${currentValue.toFixed(2)}</p>
        </div>
        <button
          onClick={() => onSell(position, player)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          <TrendingDown size={18} />
          Sell
        </button>
      </div>
    </div>
  );
}

export default function PlayerPurchasePage() {
  const { user, fetchCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('buy'); // 'buy' or 'sell'
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [userPositions, setUserPositions] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showBuyConfirmation, setShowBuyConfirmation] = useState(false);
  const [showSellConfirmation, setShowSellConfirmation] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [notification, setNotification] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(10);

  useEffect(() => {
    async function load() {
      if (!user) return;
      
      try {
        const [playerData, positionsData] = await Promise.all([
          getPlayers(),
          getUserPositions(user.id)
        ]);
        
        if (!playerData) {
          console.error("Players not found");
          return;
        }
        setPlayers(playerData);
        setUserPositions(positionsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    }
    load();
  }, [user]);

  const playerMap = {};
  players.forEach(p => { playerMap[p.id] = p; });

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, displayLimit);

  const filteredPositions = (userPositions ?? []).filter(position => {
  const player = playerMap[position.player_id];
  return player?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });


  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  const handleBuyClick = () => {
    setShowBuyConfirmation(true);
  };

  const handleSellClick = (position, player) => {
    setSelectedPosition(position);
    setSelectedPlayer(player);
    setQuantity(1);
    setShowSellConfirmation(true);
  };

  const handleBuyPurchase = async () => {
    try {
      await transactionBuy(user.id, selectedPlayer.id, quantity);
      setNotification(`Successfully purchased ${quantity}x ${selectedPlayer.name}!`);
      setShowBuyConfirmation(false);
      setSelectedPlayer(null);
      setQuantity(1);
      
      const positionsData = await getUserPositions(user.id);
      setUserPositions(positionsData);
      await fetchCurrentUser();

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Purchase failed:", error);
      setNotification("Purchase failed. Please try again.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSellPurchase = async () => {
    try {
      await transactionSell(user.id, selectedPlayer.id, quantity);
      setNotification(`Successfully sold ${quantity}x ${selectedPlayer.name}!`);
      setShowSellConfirmation(false);
      setSelectedPosition(null);
      setSelectedPlayer(null);
      setQuantity(1);
      
      const positionsData = await getUserPositions(user.id);
      setUserPositions(positionsData);
      await fetchCurrentUser();

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Sale failed:", error);
      setNotification("Sale failed. Please try again.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Player Marketplace</h1>
          <div className="flex items-center gap-2 text-lg">
            <span className="text-gray-600">Your Balance:</span>
            <span className="font-bold text-green-600">${user.currency.toFixed(2)}</span>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {notification}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'buy'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ShoppingCart size={20} />
            Buy Players
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingDown size={20} />
            Sell Holdings
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={activeTab === 'buy' ? 'Search for players...' : 'Search your holdings...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Buy or Sell List */}
          <div className="lg:col-span-2">
            {activeTab === 'buy' ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Available Players</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPlayers.map(player => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      onSelect={setSelectedPlayer}
                      isSelected={selectedPlayer?.id === player.id}
                    />
                  ))}
                </div>
                {filteredPlayers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No players found matching your search.
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Your Holdings ({Array.isArray(userPositions) ? userPositions.length : 0})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPositions.map(position => (
                    <HoldingCard
                      key={`${position.player_id}-${position.user_id}`}
                      position={position}
                      player={playerMap[position.player_id]}
                      onSell={handleSellClick}
                    />
                  ))}
                </div>
                {filteredPositions.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <DollarSign size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No holdings found</p>
                    <p className="text-sm mt-2">Buy some players to build your portfolio!</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-lg shadow-lg p-6">
              {activeTab === 'buy' ? (
                <>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ShoppingCart size={24} />
                    Purchase Details
                  </h2>

                  {selectedPlayer ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Selected Player
                        </label>
                        <div className="p-3 bg-gray-50 rounded border">
                          <p className="font-semibold">{selectedPlayer.name}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price per Unit
                        </label>
                        <p className="text-2xl font-bold text-green-600">
                          ${selectedPlayer.value.toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          id="quantity"
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between mb-4">
                          <span className="text-gray-600">Total Cost:</span>
                          <span className="text-2xl font-bold">
                            ${(selectedPlayer.value * quantity).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={handleBuyClick}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          Purchase Now
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <ShoppingCart size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Select a player to purchase</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingDown size={24} />
                    Sell Details
                  </h2>

                  {selectedPosition && selectedPlayer ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Selected Holding
                        </label>
                        <div className="p-3 bg-gray-50 rounded border">
                          <p className="font-semibold">{selectedPlayer.name}</p>
                          <p className="text-sm text-gray-600">You own: {selectedPosition.quantity}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Price
                        </label>
                        <p className="text-2xl font-bold text-green-600">
                          ${selectedPlayer.value.toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <label htmlFor="sell-quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity to Sell
                        </label>
                        <input
                          id="sell-quantity"
                          type="number"
                          min="1"
                          max={selectedPosition.quantity}
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between mb-4">
                          <span className="text-gray-600">You'll Receive:</span>
                          <span className="text-2xl font-bold text-green-600">
                            ${(selectedPlayer.value * quantity).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => setShowSellConfirmation(true)}
                          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          Sell Now
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <TrendingDown size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Select a holding to sell</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {showBuyConfirmation && selectedPlayer && (
          <PurchaseSummary
            player={selectedPlayer}
            quantity={quantity}
            userCurrency={user.currency}
            onPurchase={handleBuyPurchase}
            onCancel={() => setShowBuyConfirmation(false)}
          />
        )}

        {showSellConfirmation && selectedPosition && selectedPlayer && (
          <SellSummary
            position={selectedPosition}
            player={selectedPlayer}
            quantity={quantity}
            onSell={handleSellPurchase}
            onCancel={() => setShowSellConfirmation(false)}
          />
        )}
      </div>
    </div>
  );
}