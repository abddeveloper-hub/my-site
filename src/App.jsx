import Navbar       from "./components/Navbar";
import Hero         from "./components/Hero";
import About        from "./components/About";
import Stats        from "./components/Stats";
import Projects     from "./components/Projects";
import Process      from "./components/Process";
import Skills       from "./components/Skills";
import Testimonials from "./components/Testimonials";
import Contact      from "./components/Contact";
import Footer       from "./components/Footer";
import { CursorTrail } from "./components/UI";

export default function App() {
  return (
    <div className="relative min-h-screen bg-obsidian font-body text-paper">
      {/* Global overlays */}
      <div className="grain" />
      <CursorTrail />

      {/* Navigation */}
      <Navbar />

      {/* Sections */}
      <main>
        <Hero />
        <About />
        <Stats />
        <Projects />
        <Process />
        <Skills />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
