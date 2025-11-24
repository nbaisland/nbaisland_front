import './TradeCard.css';

function TradeCard({ holding, player, user_id }) {
  if (!holding || !player) {
    return (
      <div className="holding-card">
        <p>Could not display holding</p>
      </div>
    );
  }

  return (
    <div className="holding-card">
      <p className='quantity'>{holding.quantity}</p>
      <p className='buydate'>{holding.buy_date}</p>
      <p className="player">{player.name}</p>
    </div>
  );
}

export default TradeCard;
