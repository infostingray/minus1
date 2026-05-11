import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Projects from './components/Projects';
import Domes from './components/Domes';
import Gallery from './components/Gallery';
import Catalogue from './components/Catalogue';
import Begin from './components/Begin';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Concierge from './components/Concierge';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden';
  }, [loaded]);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <Concierge />
      <div className="relative bg-ink text-bone min-h-screen antialiased grain">
        <Navigation />
        <main>
          <Hero />
          <Manifesto />
          <Projects />
          <Domes />
          <Gallery />
          <Catalogue />
          <Begin />
        </main>
        <Footer />
      </div>
    </>
  );
}
