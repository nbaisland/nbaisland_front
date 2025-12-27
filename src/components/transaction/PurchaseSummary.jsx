const PurchaseSummary = ({ player, quantity, userCurrency, onPurchase, onCancel }) => {
  const totalCost = player.value * quantity;
  const canAfford = userCurrency >= totalCost;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Confirm Purchase</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Player:</span>
            <span className="font-semibold">{player.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Unit Price:</span>
            <span className="font-semibold">{player.value} coins</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-semibold">{quantity}</span>
          </div>
          <div className="flex justify-between pt-3 border-t-2">
            <span className="text-gray-600">Total Cost:</span>
            <span className="font-bold text-xl">{totalCost} coins</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Your Balance:</span>
            <span className={userCurrency >= totalCost ? 'text-green-600' : 'text-red-600'}>
              {userCurrency} coins
            </span>
          </div>
          {!canAfford && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
              <AlertCircle size={20} />
              <span className="text-sm">Insufficient funds</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onPurchase}
            disabled={!canAfford}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              canAfford
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
}
export default PurchaseSummary;