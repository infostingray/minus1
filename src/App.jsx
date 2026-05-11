import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Projects from './components/Projects';
import Domes from './components/Domes';
import Catalogue from './components/Catalogue';
import Footer from './components/Footer';
import Preloader from './components/Preloader';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden';
  }, [loaded]);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <div className="relative bg-ink text-bone min-h-screen antialiased grain">
        <Navigation />
        <main>
          <Hero />
          <Manifesto />
          <Projects />
          <Domes />
          <Catalogue />
        </main>
        <Footer />
      </div>
    </>
  );
}
