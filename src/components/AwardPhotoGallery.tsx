"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Expand,
  X,
} from "lucide-react";
import type { AwardAlbum } from "@/content/award-photos";
const subscribeToHydration = () => () => {};
function Album({ album }: { album: AwardAlbum }) {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const current = album.photos[index];
  const count = album.photos.length;
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  function show() {
    setIndex(0);
    setOpen(true);
    dialog.current?.showModal();
  }
  function step(direction: number) {
    setIndex((value) => (value + direction + count) % count);
  }
  const first = album.photos[0];
  return (
    <article className={`event-album event-album-${album.id}`}>
      <button
        type="button"
        className="album-cover"
        onClick={show}
        disabled={!hydrated}
        aria-label={`View ${album.title} photos`}
      >
        <span className="album-preview">
          <Image
            src={first.src}
            alt={first.alt}
            fill
            unoptimized
            sizes="(max-width:767px) 90vw, (max-width:1000px) 45vw, 350px"
            style={{
              objectFit: album.fit,
              objectPosition: album.position || "center",
            }}
          />
        </span>
        <span className="album-photo-count">
          <Expand size={13} />
          {count} {count === 1 ? "photo" : "photos"}
        </span>
      </button>
      <h3>{album.title}</h3>
      <p>{album.subtitle}</p>
      <noscript>
        <div className="album-originals">
          {album.photos.map((photo, i) => (
            <a
              key={photo.src}
              href={photo.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${album.title} original photo ${i + 1}`}
            >
              Photo {i + 1} ↗
            </a>
          ))}
        </div>
      </noscript>
      <dialog
        ref={dialog}
        className="award-dialog"
        aria-labelledby={`${album.id}-photo-title`}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        <div className="award-dialog-panel">
          <header>
            <div>
              <p className="eyebrow">EVENT PHOTOGRAPHS</p>
              <h2 id={`${album.id}-photo-title`}>{album.title} photos</h2>
            </div>
            <button
              type="button"
              className="photo-control"
              aria-label="Close photos"
              onClick={() => dialog.current?.close()}
            >
              <X size={21} />
            </button>
          </header>
          {open && (
            <>
              <div className="award-photo-stage">
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  unoptimized
                  sizes="100vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="award-photo-toolbar">
                <div className="photo-navigation">
                  {count > 1 && (
                    <button
                      type="button"
                      className="photo-control"
                      aria-label="Previous photo"
                      onClick={() => step(-1)}
                    >
                      <ChevronLeft size={21} />
                    </button>
                  )}
                  <span aria-live="polite">
                    {index + 1} / {count}
                  </span>
                  {count > 1 && (
                    <button
                      type="button"
                      className="photo-control"
                      aria-label="Next photo"
                      onClick={() => step(1)}
                    >
                      <ChevronRight size={21} />
                    </button>
                  )}
                </div>
                <a href={current.src} target="_blank" rel="noreferrer">
                  Open original image
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="award-photo-caption">{current.caption}</p>
            </>
          )}
        </div>
      </dialog>
    </article>
  );
}
export default function AwardPhotoGallery({
  albums,
}: {
  albums: readonly AwardAlbum[];
}) {
  return (
    <div className="event-gallery">
      <div className="event-gallery-heading">
        <p className="eyebrow">THE MOMENTS BEHIND THE MILESTONES</p>
        <p>From the stage, the team, and the journey.</p>
      </div>
      <div className="event-photo-grid">
        {albums.map((album) => (
          <Album key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}
