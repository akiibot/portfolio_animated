# AI Replication Prompt: Cinematic Portfolio Website

**Goal**: Build a highly polished, interactive, cinematic portfolio website mimicking this specific reference architecture.

## 1. Tech Stack
*   **Framework**: Next.js 14+ (App Router), React 18
*   **Styling**: Tailwind CSS
*   **Animation**: Framer Motion
*   **Icons**: Lucide React
*   **Language**: TypeScript

## 2. Core Architecture
The website consists of a **Cinematic Scroll Hero** section followed by a **Standard Document Flow**.

### The Main Page (`src/app/page.tsx`)
The page has a dark theme background (`bg-[#121212]`). It is structured as follows:
```tsx
<main className="min-h-screen bg-[#121212] selection:bg-white selection:text-black">
    <NavBar />

    {/* Cinematic scroll experience */}
    <section className="relative">
        <Overlay /> {/* Hero text overlay */}
        <ScrollyCanvas /> {/* Scroll-bound image sequence */}
    </section>

    {/* Normal document flow below the cinematic scroll container */}
    <About />
    <Experience />
    <EducationAwards />
    <Projects />
    <Contact />
</main>
```

## 3. The Core Challenge: `ScrollyCanvas.tsx`
This requires 144 pre-rendered sequence images (e.g., `frame_000.png` through `frame_143.png`) placed in the `public/sequence` folder.

**Implementation Details:**
1.  **Container Setup**: A wrapper `div` must be set to `h-[500vh]` (5 times the viewport height). Inside it, a `sticky top-0 h-screen` `div` holds a `<canvas>` element.
2.  **Scroll Tracking**: Use `framer-motion`'s `useScroll` tied to the container, and `useTransform` to map the scroll progress (0 to 1) to the frame index (0 to 143).
3.  **Image Preloading**: Provide a React `useEffect` to preload all 144 images and establish a loading state tracker (`loadingProgress` going from 0 to 100%). Display a full-screen sleek loading overlay (`Initializing Sequence...`) while loading.
4.  **Canvas Drawing**: Use a `resize` listener and bind to the `frameIndex` change to draw the active image to the `CanvasRenderingContext2D` using `requestAnimationFrame` or state change. 
5.  **Responsive Cover Math**: To simulate `object-fit: cover` on a canvas:
    *   Compare the canvas aspect ratio with the image aspect ratio.
    *   If the canvas is wider than the image (Desktop), set `drawHeight = canvas.width / imgRatio;` and vertically center.
    *   If the canvas is taller than the image (Mobile), set `drawWidth = canvas.height * imgRatio;` and horizontally center.

## 4. Section Details
*   **`Overlay.tsx`**: Must sit `absolute z-10 inset-0` pointing to the top of the 500vh container, but typically its content fades in and out based on `useScroll` tied to the top layout, or it remains sticky as well. Implement a hero title, subtitle, and primary CTA.
*   **Content Sections (`About`, `Experience`, `EducationAwards`, `Projects`, `Contact`)**:
    *   Dark mode design pattern (`#121212` background, text colors using raw Tailwind grays like `text-zinc-400` and `text-white`).
    *   Use `framer-motion` to wrap sections in `<motion.div>` with `initial={{ opacity: 0, y: 20 }}` and `whileInView={{ opacity: 1, y: 0 }}` for subtle fade-up reveals as the user scrolls past the 500vh hero section.

## 5. Instructions for the AI
1. Initialize the Next.js app, install dependencies (`framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`).
2. Provide the precise code for `ScrollyCanvas.tsx` implementing the canvas math and loading state detailed above.
3. Build out standard portfolio filler components for the sections below it using Framer motion reveal effects.
4. Instruct the user on how to extract an MP4 to a PNG sequence and place it in the `public/sequence` directory.
