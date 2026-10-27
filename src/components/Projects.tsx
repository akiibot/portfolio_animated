import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import ProjectCard from "./ProjectCard";
import ProjectDemo from "./ProjectDemo";
export default function Projects() {
  return (
    <section
      id="projects"
      className="section wrap"
      aria-labelledby="projects-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / SELECTED PROJECTS</p>
          <h2 id="projects-title">
            Selected work<span>.</span>
          </h2>
        </div>
        <p>
          Real problems. Thoughtful systems.
          <br />A few things I’ve been building.
        </p>
      </div>
      <div className="project-grid">
        {projects
          .filter((p) => p.placement === "primary")
          .map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
      </div>
      <div className="secondary-heading">
        <span>MORE TO EXPLORE</span>
        <span>02 FURTHER PROJECTS</span>
      </div>
      <div className="project-grid">
        {projects
          .filter((p) => p.placement === "secondary")
          .map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
      </div>
      <div className="additional-work">
        <h3>Also on my workbench</h3>
        {projects
          .filter((p) => p.placement === "additional")
          .map((p) => (
            <article key={p.slug}>
              <a href={p.sourceUrl} target="_blank" rel="noreferrer">
                <span>
                  {p.name}
                  <small>{p.category}</small>
                </span>
                <span className="additional-summary">{p.summary}</span>
                <ArrowUpRight size={19} />
              </a>
              {p.video && <ProjectDemo name={p.name} video={p.video} />}
            </article>
          ))}
      </div>
    </section>
  );
}
