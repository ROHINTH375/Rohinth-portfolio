import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { About, Experience, Projects } from './components/Sections';
import SkillsSection from './components/SkillsSection';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <SkillsSection />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
