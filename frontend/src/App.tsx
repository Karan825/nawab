import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Menu from './components/Menu';
import Builder from './components/Builder';
import { Snacks, Merch, FindUs, InstagramWall, Footer, PopularStrip, Divider } from './components/Sections';

function App() {
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
