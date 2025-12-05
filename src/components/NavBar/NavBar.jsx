import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from '../../assets/logo.png';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="NBA Island" />
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/players">Players</Link>
        <Link to="/users">Users</Link>
      </div>
    </nav>
  );
}

export default NavBar;
