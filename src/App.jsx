import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Register';
import UserPage from './pages/UserPage';
import UsersPage from './pages/UsersPage';
import PlayerPage from './pages/PlayerPage';
import PlayersPage from './pages/PlayersPage';
import TransactionPage from './pages/TransactionPage';
import NavBar from './components/NavBar/NavBar';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          

          <Route path="/*" element={
              <ProtectedRoute>
                <NavBar />
                <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="/user/:username" element={<UserPage/>}/>
                  <Route path="/player/:playerSlug" element={<PlayerPage/>}/>
                  <Route path="/players" element={<PlayersPage/>}/>
                  <Route path="/users" element={<UsersPage/>}/>
                  <Route path="/marketplace" element={<TransactionPage/>}/>
                  <Route path="/transactions" element={<TransactionPage/>}/>
                </Routes>
              </ProtectedRoute>
            } />

          
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
