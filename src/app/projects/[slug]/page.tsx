import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, GitBranch, Layers } from "lucide-react";
import { projects, getProjectBySlug, demoLabel } from "@/content/projects";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p?.caseStudy)
    return {
      title: "Project not found",
      robots: { index: false, follow: false },
    };
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: `${p.name} · Akib`,
      description: p.summary,
      url: `/projects/${slug}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project?.caseStudy) notFound();
  const story = project.caseStudy;
  const heroImage = project.cover ?? project.screenshots[0];
  return (
    <main id="main-content" className={`case-page accent-${project.accent}`}>
      <div className="wrap">
        <Link className="back-link" href="/#projects">
          <ArrowLeft size={16} />
          Back to selected work
        </Link>
        <header className="case-header">
          <p className="eyebrow">
            {project.category} / {project.status}
          </p>
          <h1>
            {project.name}
            <span>.</span>
          </h1>
          <p>{project.summary}</p>
          <div className="case-actions">
            {project.demo && (
              <a
                className="button button-light"
                href={project.demo.url}
                target="_blank"
                rel="noreferrer"
              >
                {demoLabel[project.demo.kind]}
                <ArrowUpRight size={16} />
              </a>
            )}
            {project.sourceUrl && (
              <a
                className="button button-outline"
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                <GitBranch size={16} />
                Source code
              </a>
            )}
          </div>
        </header>
        <div className="case-facts">
          <div>
            <span>ROLE</span>
            <p>{project.role}</p>
          </div>
          <div>
            <span>TOOLS & TECHNOLOGY</span>
            <p>{project.stack.join(" · ")}</p>
          </div>
          <div>
            <span>PROJECT TYPE</span>
            <p>{project.status}</p>
          </div>
        </div>
        {heroImage && (
          <figure className="case-main-image">
            <Image
              src={heroImage.src}
              unoptimized={!project.cover}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              sizes="(max-width: 1200px) 100vw, 1120px"
              priority
            />
            <figcaption>{heroImage.caption}</figcaption>
          </figure>
        )}
        <div className="case-content">
          <aside>
            <p className="eyebrow">PROJECT NOTES</p>
            <a href="#problem">The problem</a>
            <a href="#contribution">My contribution</a>
            <a href="#architecture">The architecture</a>
            <a href="#evidence">Evidence & limits</a>
          </aside>
          <div className="case-story">
            <section id="problem">
              <h2>The problem</h2>
              <p>{story.problem}</p>
            </section>
            <section id="contribution">
              <h2>My contribution</h2>
              <p>{story.contribution}</p>
            </section>
            <section id="architecture">
              <h2>How it fits together</h2>
              <p>{story.architecture}</p>
              <div className="system-note">
                <Layers size={23} />
                <span>{project.stack.join(" → ")}</span>
              </div>
              <h3>Decisions that matter</h3>
              <ul>
                {story.decisions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            {project.screenshots.slice(project.cover ? 0 : 1).map((image) => (
              <figure key={image.src}>
                <Image
                  src={image.src}
                  unoptimized
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 767px) 100vw, 760px"
                />
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
            <section id="evidence">
              <h2>Evidence & honest limits</h2>
              {story.outcome && <p className="outcome">{story.outcome}</p>}
              <div className="evidence-links">
                {story.evidence.map((item) =>
                  item.url ? (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                      <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <p key={item.label}>{item.label}</p>
                  ),
                )}
              </div>
              <ul>
                {story.limitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
        <div className="case-footer">
          <p>Have a question about this project?</p>
          <Link className="button button-light" href="/#contact">
            Let’s talk
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
