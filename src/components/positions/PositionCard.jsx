import './PositionCard.css';
import { Link } from 'react-router-dom'

function PositionCard({ position, player, user }) {
  if (!position || (!player && !user)) {
    return (
      <div className="position-card">
        <p>Could not display position</p>
      </div>
    );
  }

  return (
    <div className="position-card">
      { player && (
        <Link to={`/player/${player.slug}`} className="player-link">
        <div className="pos-player">{player.name}</div>
      </Link>
      )}
      <div className="pos-quantity">{position.quantity}</div>

      {user && (
        <Link to={`/user/${user.username}`} className="user-link">
          <div className="pos-user">{user.name}</div>
        </Link>
      )}
    </div>
  );
}

export default PositionCard;
