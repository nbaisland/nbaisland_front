import './TradeCard.css';

function TradeCard({ transaction, player, user }) {
  if (!transaction || !player || !user) {
    return (
      <div className="transaction-card">
        <p>Could not display transaction</p>
      </div>
    );
  }

  return (
    <div className="transaction-card">
      <p className='quantity'>{transaction.quantity}</p>
      <p className='timestamp'>
        {new Date(transaction.timestamp).toLocaleString()}
      </p>
      <p className='price'>{transaction.price}</p>
      <p className={`type ${transaction.type.toLowerCase()}`}>{transaction.type}</p>
      <p className="player">{player.name}</p>
      <p className="user">{user?.name ?? 'Unknown user'}</p>
    </div>
  );
}

export default TradeCard;
