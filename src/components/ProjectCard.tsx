import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GitBranch, Layers } from "lucide-react";
import type { Project } from "@/content/types";
import { demoLabel } from "@/content/projects";
export default function ProjectCard({ project }: { project: Project }) {
  const screenshot = project.screenshots[0];
  const detail = !!project.caseStudy;
  return (
    <article className={`project-card accent-${project.accent}`}>
      <div className="project-preview">
        {screenshot ? (
          <>
            <div className="preview-chrome">
              <span>
                <i />
                <i />
                <i />
              </span>
              <span>{project.name}</span>
              <ArrowUpRight size={12} />
            </div>
            <div className="preview-image">
              {detail ? (
                <Link
                  href={`/projects/${project.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    fill
                    sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1280px) 45vw, 550px"
                  />
                </Link>
              ) : (
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 40px), 45vw"
                />
              )}
            </div>
            <p className="preview-caption">{screenshot.caption}</p>
          </>
        ) : (
          <div
            className="architecture-preview"
            aria-label="Architecture illustration, not a product screenshot"
          >
            <Layers size={28} />
            <strong>From brief to brand.</strong>
            <div>
              <span>Brand blueprint</span>
              <b>→</b>
              <span>AI imagery</span>
              <b>→</b>
              <span>HTML compositor</span>
            </div>
            <small>ARCHITECTURE OVERVIEW</small>
          </div>
        )}
      </div>
      <div className="project-info">
        <div className="project-meta">
          <span>
            {project.number} / {project.category}
          </span>
          <span className="project-status">{project.status}</span>
        </div>
        <div className="project-title">
          <h3>
            {detail ? (
              <Link href={`/projects/${project.slug}`}>{project.name}</Link>
            ) : (
              project.name
            )}
          </h3>
          {detail && (
            <Link
              className="project-arrow"
              href={`/projects/${project.slug}`}
              aria-label={`Read ${project.name} case study`}
            >
              <ArrowUpRight size={24} />
            </Link>
          )}
        </div>
        <p className="project-summary">{project.summary}</p>
        <div className="tag-list">
          {project.stack.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="project-actions">
          {detail && (
            <Link href={`/projects/${project.slug}`}>
              Project story <ArrowUpRight size={14} />
            </Link>
          )}
          {project.demo && (
            <a href={project.demo.url} target="_blank" rel="noreferrer">
              {demoLabel[project.demo.kind]} <ArrowUpRight size={14} />
            </a>
          )}
          {project.sourceUrl && (
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.name} source code`}
            >
              <GitBranch size={13} /> Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
