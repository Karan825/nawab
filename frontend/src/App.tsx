import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Menu from './components/Menu';
import Builder from './components/Builder';
import { Snacks, Merch, FindUs, InstagramWall, Footer, PopularStrip, Divider } from './components/Sections';
import KDSPage from './pages/KDSPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (route === '/kds') {
    return <KDSPage />;
  }

  if (route === '/admin') {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Menu />
        <Divider />
        <PopularStrip />
        <Builder />
        <Divider flip />
        <Snacks />
        <Merch />
        <FindUs />
        <InstagramWall />
      </main>
      <Footer />
    </div>
  );
}

export default App;
