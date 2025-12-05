import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import UserPage from './pages/UserPage';
import PlayerPage from './pages/PlayerPage';
import NavBar from './components/NavBar/NavBar';


function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/user/:username" element={<UserPage/>}/>
        <Route path="/player/:playerSlug" element={<PlayerPage/>}/>
      </Routes>
    </Router>
  )
}

export default App;
