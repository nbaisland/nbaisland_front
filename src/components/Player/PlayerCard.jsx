import './PlayerCard.css';
import { Link } from 'react-router-dom'

function PlayerCard({ player, showValue= true }) {
  return (
    <div className="player-card">
      <Link to={`/player/${player.slug}`} className="player-link">
        <p className="player">{player.name}</p>
      </Link>
      {showValue && (
        <p className="score">{player.value}</p>

      )}
    </div>
  );
}

export default PlayerCard;
