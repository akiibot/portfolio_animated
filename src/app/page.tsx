import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Experience from "@/components/Experience";
import EducationAwards from "@/components/EducationAwards";
import Contact from "@/components/Contact";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] selection:bg-white selection:text-black">
      <NavBar />

      {/* The cinematic scroll experience */}
      <section className="relative">
        <Overlay />
        <ScrollyCanvas />
      </section>

      {/* Normal document flow below the 500vh container */}
      <About />
      <Experience />
      <EducationAwards />
      <Projects />
      <Contact />

    </main>
  );
}
