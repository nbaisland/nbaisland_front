import RecentActivity from '../components/RecentActivity';
import TopPlayersList from '../components/TopPlayersList';

function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <TopPlayersList topN={10} />
      <RecentActivity/>
    </div>
    
  );
}

export default Home;
