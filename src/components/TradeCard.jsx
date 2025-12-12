import './TradeCard.css';
import { Link } from 'react-router-dom'

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
       <Link to={`/player/${player.slug}`} className="player-link">
          <p className="player">{player.name}</p>
        </Link>
      <Link to={`/user/${user.username}`} className="user-link">
          <p className="user">{user.name}</p>
      </Link>
    </div>
  );
}

export default TradeCard;
