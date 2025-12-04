import './UserCard.css';

function UserCard({ user, showValue= true }) {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      {showValue && (
        <p className="score">{user.currency}</p>

      )}
    </div>
  );
}

export default UserCard;
