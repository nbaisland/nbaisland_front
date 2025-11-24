import './PlayerCard.css';

function PlayerCard({ player, showValue= true }) {
  return (
    <div className="player-card">
      <h2>{player.name}</h2>
      {showValue && (
        <p className="score">{player.value}</p>

      )}
    </div>
  );
}

export default PlayerCard;
