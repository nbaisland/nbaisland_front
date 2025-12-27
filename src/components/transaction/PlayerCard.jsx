import { Search, User, TrendingUp, ShoppingCart, AlertCircle } from 'lucide-react';
const PlayerCard = ({ player, onSelect, isSelected }) => (
  <div
    onClick={() => onSelect(player)}
    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
      isSelected
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
    }`}
  >
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="font-bold text-lg">{player.name}</h3>
        <p className="text-sm text-gray-600">{player.description}</p>
      </div>
      <User className="text-gray-400" size={24} />
    </div>
    <div className="flex justify-between items-center mt-3 pt-3 border-t">
      <div className="flex items-center gap-1 text-green-600 font-semibold">
        <TrendingUp size={16} />
        <span>{player.value} coins</span>
      </div>
      <div className="text-sm text-gray-500">
        Capacity: {player.capacity}
      </div>
    </div>
  </div>
)
export default PlayerCard;