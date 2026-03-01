import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] selection:bg-white selection:text-black">

      {/* The cinematic scroll experience */}
      <section className="relative">
        <Overlay />
        <ScrollyCanvas />
      </section>

      {/* Normal document flow below the 500vh container */}
      <Projects />

    </main>
  );
}
