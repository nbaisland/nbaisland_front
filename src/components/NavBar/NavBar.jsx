import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  BarChart3, 
  Trophy,
  Menu,
  X,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import logo from '../../assets/logo.png';

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
    { path: '/players', label: 'Players', icon: TrendingUp },
    { path: '/portfolio', label: 'Portfolio', icon: BarChart3 },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/users', label: 'Users', icon: Users },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="NBA Island" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-800 hidden sm:block">NBA Island</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-semibold text-green-700">$10,000</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">{user.username}</span>
              </button>
              {profileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setProfileMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    <Link
                      to={`/user/${user.username}`}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User size={18} className="text-gray-600" />
                      <span className="text-gray-700">Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Settings size={18} className="text-gray-600" />
                      <span className="text-gray-700">Settings</span>
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        // #TODO: Add logout logic
                      }}
                    >
                      <LogOut size={18} className="text-red-600" />
                      <span className="text-red-600">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.username}</p>
                <p className="text-sm text-green-600 font-semibold">$10,000</p>
              </div>
            </div>

            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}

            <div className="border-t border-gray-200 my-3"></div>
            <Link
              to={`/user/${user.username}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <User size={20} />
              <span className="font-medium">Profile</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                // Add logout logic
              }}
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;