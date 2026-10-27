import type { Project, Screenshot } from "./types";
const capture = (file: string, alt: string, caption: string): Screenshot => ({
  src: `/projects/captures/${file}`,
  alt,
  width: 1280,
  height: 720,
  caption,
});
const date = "2026-10-27";
const portfolioProjects: readonly Project[] = [
  {
    slug: "find-my-paw",
    name: "Find My Paw",
    number: "01",
    category: "Product development",
    summary:
      "One QR scan. A direct connection home. Pet identification that helps finders contact owners without installing an app.",
    stack: ["QR-linked profiles", "Owner contact", "Web product"],
    role: "Creator & developer",
    status: "product",
    placement: "primary",
    accent: "sage",
    demo: {
      url: "https://www.findmypaw.app/",
      kind: "live-app",
      checkedAt: date,
    },
    screenshots: [
      capture(
        "find-my-paw.jpg",
        "Find My Paw deployed landing page with QR pet identification",
        "Public product landing page · captured October 2026",
      ),
      capture(
        "find-my-paw-process.jpg",
        "Find My Paw explaining the scan-to-contact process",
        "The three-step product journey on the deployed site",
      ),
    ],
    caseStudy: {
      problem:
        "A lost pet needs a way for a stranger to reach its owner immediately, without installing a dedicated application.",
      contribution:
        "Created the QR-linked pet identification product and owner-contact journey. Preparing the product for wider public use.",
      architecture:
        "A physical QR tag connects the finder to a pet’s web profile and the owner-contact flow.",
      decisions: [
        "Keep the finder journey accessible from a standard smartphone camera.",
        "Use the web rather than requiring the finder to install an app.",
        "Test the idea with a small real audience before a public launch.",
      ],
      evidence: [
        { label: "Deployed public product", url: "https://www.findmypaw.app/" },
      ],
      outcome:
        "The prerelease test attracted 40+ users through one Facebook group. This is a prerelease result, not an active-user count.",
      limitations: [
        "Source code is private.",
        "Public screenshots show the landing and process pages; they do not independently verify every account or notification feature.",
      ],
    },
  },
  {
    slug: "vallet",
    name: "Vallet",
    number: "02",
    category: "AI systems · Team project",
    summary:
      "A financial-planning prototype that separates what an AI proposes from what an independent verifier permits.",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Typed contracts"],
    status: "prototype",
    placement: "primary",
    accent: "sand",
    sourceUrl: "https://github.com/akiibot/vallet",
    video: { kind: "youtube", id: "oH30ok8yAMM" },
    screenshots: [
      capture(
        "vallet-recorded-home.jpg",
        "Vallet home screen from its published hosted-demo evidence",
        "Recorded hosted-demo screenshot · project repository",
      ),
      capture(
        "vallet-recorded-proof.jpg",
        "Vallet verification screen from its published hosted-demo evidence",
        "Recorded verification screen · not a fresh execution",
      ),
    ],
  },
  {
    slug: "jointly",
    name: "Jointly",
    number: "03",
    category: "Developer tools",
    summary:
      "Find the collision a clean merge misses. Evidence-driven checks for parallel AI-generated code changes.",
    stack: ["TypeScript", "Git workspaces", "MCP", "Vitest"],
    role: "Developer",
    status: "hackathon",
    placement: "primary",
    accent: "lavender",
    sourceUrl: "https://github.com/akiibot/jointly",
    video: { kind: "file", src: "/projects/videos/jointly-demo.mp4" },
    demo: {
      url: "https://jointly-ai-merge.vercel.app/",
      kind: "sample-dashboard",
      checkedAt: date,
    },
    screenshots: [
      capture(
        "jointly.jpg",
        "Jointly deployed sample evidence dashboard",
        "Deployed sample dashboard · historical bundled evidence",
      ),
      capture(
        "jointly-investigation.jpg",
        "Jointly interaction-test investigation and failure evidence",
        "The documented coupon and payment-retry collision",
      ),
    ],
    caseStudy: {
      problem:
        "Two branches can pass their own tests and merge cleanly while disagreeing about how shared behavior should work.",
      contribution:
        "Built Git-isolated execution, a CLI and MCP server, verification workflows, and reusable agent skills for interaction testing and evidence-based merge decisions.",
      architecture:
        "Separate base, change A, change B, and combined workspaces feed existing tests, an interaction test, repair verification, and a structured evidence passport.",
      decisions: [
        "Keep source branches unchanged and scope repairs to an isolated combined workspace.",
        "Separate AI-authored hypotheses from deterministic execution evidence.",
        "Require evidence gates before issuing a merge-safety verdict.",
      ],
      evidence: [
        {
          label: "Sample evidence dashboard",
          url: "https://jointly-ai-merge.vercel.app/",
        },
        {
          label: "Source and documented test workflow",
          url: "https://github.com/akiibot/jointly",
        },
      ],
      limitations: [
        "The deployed dashboard displays historical bundled evidence and labels its passport legacy/unverified.",
        "The demonstrated local workflow handles two changes; it does not automatically merge or prove universal correctness.",
      ],
    },
  },
  {
    slug: "localrelay",
    name: "LocalRelay",
    number: "04",
    category: "Offline web · Team Protos",
    summary:
      "A visitor’s smartphone meets an operator’s basic phone. Reviewed, structured enquiries across English and Bangla.",
    stack: ["React", "TypeScript", "IndexedDB", "Web Workers", "Offline PWA"],
    status: "hackathon",
    placement: "primary",
    accent: "peach",
    sourceUrl: "https://github.com/akiibot/LocalRelay",
    demo: {
      url: "https://localrelay-test.vercel.app/demo",
      kind: "simulated-demo",
      checkedAt: date,
    },
    screenshots: [
      capture(
        "localrelay.jpg",
        "LocalRelay deployed two-phone simulated SMS demo",
        "Interactive demo · no real SMS is sent",
      ),
      capture(
        "localrelay-workflow.jpg",
        "LocalRelay visitor enquiry appearing on the simulated operator phone",
        "Reviewed Bangla enquiry in the simulated workflow",
      ),
    ],
  },
  {
    slug: "imprnt-ai",
    name: "Imprnt AI",
    number: "05",
    category: "Full-stack AI workflow",
    summary:
      "Brand guidelines in. On-brand Bangla and English posters out. AI imagery paired with precise HTML typography.",
    stack: ["Next.js", "FastAPI", "Supabase", "Docker", "Playwright"],
    role: "Developer",
    status: "hackathon",
    placement: "secondary",
    accent: "rose",
    sourceUrl: "https://github.com/akiibot/inprnt-ai",
    video: { kind: "youtube", id: "Tb8ayU6DSDo" },
    screenshots: [],
    caseStudy: {
      outcome:
        "Champion in Branding & Marketing (MarTech) at The Infinity AI Buildfest 2026, as Team Breaking BRAC.",
      problem:
        "Generated campaign images need recognizable brand styling and readable Bangla and English text across several formats.",
      contribution:
        "Built a full-stack campaign workflow with REST APIs, Supabase PostgreSQL and Storage, AI integrations, a containerized backend, and concurrent asset processing.",
      architecture:
        "A structured brand/campaign blueprint connects AI background generation to a deterministic HTML/CSS compositor rendered through Playwright.",
      decisions: [
        "Generate imagery separately from text, logos and calls to action.",
        "Use a structured blueprint to connect planning and composition.",
        "Support multiple export aspect ratios from the campaign workflow.",
      ],
      evidence: [
        {
          label: "Source and architecture",
          url: "https://github.com/akiibot/inprnt-ai",
        },
        {
          label: "AI Buildfest winner announcement",
          url: "/awards/buildfest-announcement.jpg",
        },
      ],
      limitations: [
        "The listed public deployment was unavailable at review.",
        "The editorial cover is an illustration of the workflow, not an app screenshot or an actual campaign output.",
      ],
    },
  },
  {
    slug: "now-todays-news",
    name: "Now Today’s News",
    number: "06",
    category: "Game development · IUT GameJam winner",
    summary:
      "Arrange the news. Change the city. A narrative puzzle game where each broadcast shapes what happens next.",
    stack: ["Godot 4", "GDScript", "Narrative systems"],
    role: "Game development contributor",
    status: "hackathon",
    placement: "secondary",
    accent: "blue",
    sourceUrl: "https://github.com/Alfa5nm/TrioJam",
    demo: {
      url: "https://notfullyblissful.itch.io/now-todays-news",
      kind: "downloadable-game",
      checkedAt: "2026-10-28",
    },
    video: { kind: "youtube", id: "fYtWlmTALKk" },
    screenshots: [
      {
        src: "/projects/captures/now-todays-news-city.jpg",
        alt: "Now Today's News side-scrolling city with a public broadcast and protesters",
        width: 1280,
        height: 724,
        caption: "Game screenshot from the team’s itch.io release page",
      },
      {
        src: "/projects/captures/now-todays-news-story.jpg",
        alt: "Hand-drawn narrative scene from Now Today's News",
        width: 1280,
        height: 743,
        caption: "Narrative scene · published itch.io screenshot",
      },
    ],
    caseStudy: {
      problem:
        "Explore how the same evidence can become different stories, and how those stories influence the world around them.",
      contribution:
        "Helped build the game as part of a three-person game-jam team, collaborating on a connected narrative and gameplay experience.",
      architecture:
        "Godot 4 scenes connect side-scrolling exploration, character interactions, and a broadcast interface. Players arrange photographs and characters into three-frame reports that influence later events.",
      decisions: [
        "Use a three-frame report to make news construction a playable puzzle.",
        "Connect broadcasts to visible changes in the city.",
        "Build reusable scenes to support a small team working in parallel.",
      ],
      evidence: [
        {
          label: "Published game and screenshots",
          url: "https://notfullyblissful.itch.io/now-todays-news",
        },
        {
          label: "Team source repository",
          url: "https://github.com/Alfa5nm/TrioJam",
        },
      ],
      outcome:
        "Winner of the IUT 12th ICT Fest 2026 GameJam, under the theme Kickoff.",
      limitations: [
        "A downloadable game for Windows and macOS; it does not run in the browser.",
        "The jam release contains short, introductory puzzles. The release page discloses AI-assisted assets alongside hand-drawn illustrations.",
      ],
    },
  },
  {
    slug: "cosmoscope",
    name: "CosmoScope",
    number: "07",
    category: "NASA Space Apps · Team project",
    summary:
      "Explore NASA imagery through a story-driven browser game and a 3D solar system.",
    stack: ["React", "Three.js", "MapLibre", "NASA APIs"],
    status: "hackathon",
    placement: "additional",
    accent: "blue",
    sourceUrl: "https://github.com/Alfa5nm/CosmoScope_v2",
    video: { kind: "youtube", id: "Bq883qNbjoI" },
    screenshots: [],
  },
];
const teamNotes: Record<string, NonNullable<Project["caseStudy"]>> = {
  vallet: {
    problem:
      "An AI planner can recommend an action without having the authority or reliable evidence to execute it.",
    contribution:
      "Led the project architecture and development, separating AI proposals from policy checks, verification, approval, and testnet execution.",
    architecture:
      "A Next.js interface and FastAPI backend connect typed proposals, independently recomputed verification, exact-action certificates, explicit approval, and a separate executor.",
    decisions: [
      "Treat the planner as a proposer, not the authority to act.",
      "Recheck trusted state and policy before issuing a certificate and again before execution.",
      "Link decisions and execution evidence while distinguishing test fixtures from genuine testnet records.",
    ],
    evidence: [
      {
        label: "Architecture, test workflow and limitations",
        url: "https://github.com/akiibot/vallet",
      },
    ],
    limitations: [
      "Single-user prototype with synthetic planning balances and Base Sepolia testnet execution; not a production financial product.",
      "The public preview currently stalls on session checking. Screenshots are existing hosted-demo records under the former ProofFi name.",
    ],
  },
  localrelay: {
    problem:
      "A visitor may have a smartphone and English-language request while a local operator uses a basic phone and Bangla.",
    contribution:
      "Led architecture and development of the reviewed enquiry workflow, offline browser experience, and visitor/operator agreement states.",
    architecture:
      "A React/TypeScript PWA combines local storage, a Web Worker for experimental local inference, fixed Bangla message templates, and explicit offer/acceptance/acknowledgement guards.",
    decisions: [
      "Put the application on the visitor’s smartphone, leaving the operator’s phone unchanged.",
      "Require human review of structured fields before preparing a message.",
      "Provide a manual fallback and make simulation distinct from real SMS.",
    ],
    evidence: [
      {
        label: "Interactive simulated demo",
        url: "https://localrelay-test.vercel.app/demo",
      },
      {
        label: "Source, protocol and evaluation notes",
        url: "https://github.com/akiibot/LocalRelay",
      },
    ],
    limitations: [
      "The browser demo sends no real SMS.",
      "Local inference is experimental; basic-phone compatibility and independent Bangla review remain unverified.",
    ],
  },
};
const generatedCovers: Record<string, Screenshot> = {
  "imprnt-ai": {
    src: "/projects/covers/imprnt-editorial.png",
    alt: "Editorial illustration of coordinated campaign poster formats for Imprnt AI",
    width: 1672,
    height: 941,
    caption:
      "AI-generated project illustration · not an app screenshot or actual campaign output",
  },
};
export const projects: readonly Project[] = portfolioProjects.map(
  (project) => ({
    ...project,
    role:
      project.slug === "now-todays-news"
        ? project.role
        : "Lead architect & developer",
    cover: generatedCovers[project.slug],
    caseStudy: project.caseStudy ?? teamNotes[project.slug],
  }),
);
export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
export const demoLabel = {
  "live-app": "Visit live site",
  "sample-dashboard": "Sample dashboard",
  "simulated-demo": "Simulated SMS demo",
  "login-required": "Protected preview",
  "downloadable-game": "Get the game",
};
