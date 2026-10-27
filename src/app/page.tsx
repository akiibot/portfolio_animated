import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import About from "@/components/About";
import Experience from "@/components/Experience";
import EducationAwards from "@/components/EducationAwards";
import Contact from "@/components/Contact";
export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Projects />
      <Achievements />
      <About />
      <Experience />
      <EducationAwards />
      <Contact />
    </main>
  );
}
