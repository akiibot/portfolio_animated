"use client";

import { useState } from "react";
import { Play, ArrowUpRight } from "lucide-react";
import type { ProjectVideo } from "@/content/types";
import DemoPlayer, { videoUrl } from "./DemoPlayer";

export default function ProjectDemo({
  name,
  video,
}: {
  name: string;
  video: ProjectVideo;
}) {
  const [open, setOpen] = useState(false);
  const url = videoUrl(video);
  return (
    <details
      className="project-demo"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        <Play size={15} /> Watch demo <span className="sr-only">of {name}</span>
      </summary>
      <div className="demo-panel">
        {open && <DemoPlayer name={name} video={video} />}
        <a href={url} target="_blank" rel="noreferrer">
          {video.kind === "youtube" ? "Open on YouTube" : "Open video file"}{" "}
          <ArrowUpRight size={13} />
        </a>
      </div>
    </details>
  );
}
