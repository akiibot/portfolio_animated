"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GitBranch, Layers, Play, X } from "lucide-react";
import type { Project } from "@/content/types";
import { demoLabel } from "@/content/projects";
import DemoPlayer, { videoUrl } from "./DemoPlayer";
export default function ProjectCard({ project }: { project: Project }) {
  const [playing, setPlaying] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const screenshot = project.cover ?? project.screenshots[0];
  const detail = !!project.caseStudy;
  return (
    <article className={`project-card accent-${project.accent}`}>
      <div className="project-preview">
        {screenshot ? (
          <>
            <div
              className={
                project.cover
                  ? "preview-chrome preview-illustration"
                  : "preview-chrome"
              }
            >
              <span>
                <i />
                <i />
                <i />
              </span>
              <span>
                {project.cover && !playing
                  ? "PROJECT ILLUSTRATION"
                  : project.name}
              </span>
              <ArrowUpRight size={12} />
            </div>
            <div
              className="preview-image"
              ref={screen}
              id={`preview-${project.slug}`}
            >
              {playing && project.video ? (
                <DemoPlayer
                  name={project.name}
                  video={project.video}
                  autoPlay
                />
              ) : detail ? (
                <Link
                  href={`/projects/${project.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    fill
                    unoptimized={!project.cover}
                    sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1280px) 45vw, 550px"
                  />
                </Link>
              ) : (
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  fill
                  unoptimized={!project.cover}
                  sizes="(max-width: 767px) calc(100vw - 40px), 45vw"
                />
              )}
            </div>
            <div className="preview-caption">
              {playing && project.video ? (
                <a
                  href={videoUrl(project.video)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.video.kind === "youtube"
                    ? "Open on YouTube"
                    : "Open video file"}{" "}
                  <ArrowUpRight size={12} />
                </a>
              ) : (
                screenshot.caption
              )}
            </div>
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
          {project.video && (
            <>
              <button
                type="button"
                className="card-demo-toggle"
                aria-label={`${playing ? "Show screenshot" : "Watch demo"} of ${project.name}`}
                aria-controls={`preview-${project.slug}`}
                aria-expanded={playing}
                onClick={() => {
                  setPlaying(!playing);
                  if (!playing)
                    screen.current?.scrollIntoView({
                      block: "center",
                      behavior: "instant",
                    });
                }}
              >
                {playing ? <X size={14} /> : <Play size={14} />}
                {playing ? "Show screenshot" : "Watch demo"}
              </button>
              <noscript>
                <style>{`.card-demo-toggle { display: none; }`}</style>
                <a
                  href={videoUrl(project.video)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch demo
                </a>
              </noscript>
            </>
          )}
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
