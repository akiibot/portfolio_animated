import type { ProjectVideo } from "@/content/types";

export function videoUrl(video: ProjectVideo) {
  return video.kind === "youtube"
    ? `https://www.youtube.com/watch?v=${video.id}`
    : video.src;
}

export default function DemoPlayer({
  name,
  video,
  autoPlay = false,
}: {
  name: string;
  video: ProjectVideo;
  autoPlay?: boolean;
}) {
  return video.kind === "youtube" ? (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${video.id}${autoPlay ? "?autoplay=1" : ""}`}
      title={`${name} video demo`}
      allow="autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  ) : (
    <video
      controls
      playsInline
      autoPlay={autoPlay}
      preload="metadata"
      aria-label={`${name} video demo`}
    >
      <source src={video.src} type="video/mp4" />
      Your browser cannot play this video. Open the recording below.
    </video>
  );
}
