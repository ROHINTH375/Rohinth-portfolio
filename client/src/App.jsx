import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { About, Experience, Projects, Skills } from './components/Sections';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
