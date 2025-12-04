import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import UserPage from './pages/UserPage';
import PlayerPage from './pages/PlayerPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/user/:username" element={<UserPage/>}/>
        <Route path="/player/:playername" element={<PlayerPage/>}/>
      </Routes>
    </Router>
  )
}

export default App;
