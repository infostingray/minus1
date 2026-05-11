import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Projects from './components/Projects';
import Catalogue from './components/Catalogue';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [loaded]);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <CustomCursor />
      <SmoothScroll>
        <div className="relative bg-ink text-bone min-h-screen antialiased grain">
          <Navigation />
          <main>
            <Hero />
            <Manifesto />
            <Projects />
            <Catalogue />
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </>
  );
}
