import './UserCard.css';
import { Link } from 'react-router-dom';

function UserCard({ user, showValue= true }) {
  return (
    <div className="user-card">
      {
        <Link to={`/user/${user.username}`} className="user-link">
          <h2>{user.name}</h2>
        </Link>
      }
      {showValue && (
        <p className="score">{user.currency}</p>

      )}
    </div>
  );
}

export default UserCard;
