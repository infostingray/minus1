import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Projects from './components/Projects';
import Catalogue from './components/Catalogue';
import Footer from './components/Footer';

export default function App() {
  return (
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
  );
}
