import RecentActivity from '../components/RecentActivity';
import TopPlayersList from '../components/TopPlayersList';
import TopUsersList from '../components/UserList';

function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <TopPlayersList topN={10} />
      <TopUsersList topN={10}/>
      <RecentActivity/>
    </div>
    
  );
}

export default Home;
