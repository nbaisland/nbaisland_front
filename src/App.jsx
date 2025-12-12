import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import UserPage from './pages/UserPage';
import UsersPage from './pages/UsersPage';
import PlayerPage from './pages/PlayerPage';
import PlayersPage from './pages/PlayersPage';
import NavBar from './components/NavBar/NavBar';


function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/user/:username" element={<UserPage/>}/>
        <Route path="/player/:playerSlug" element={<PlayerPage/>}/>
        <Route path="/players" element={<PlayersPage/>}/>
        <Route path="/users" element={<UsersPage/>}/>
      </Routes>
    </Router>
  )
}

export default App;
