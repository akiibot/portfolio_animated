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
    screenshots: [],
    caseStudy: {
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
      ],
      limitations: [
        "The listed public deployment was unavailable at review.",
        "The editorial cover is an illustration of the workflow, not an app screenshot or an actual campaign output.",
      ],
    },
  },
  {
    slug: "researchlens",
    name: "ResearchLens V2",
    number: "06",
    category: "Research tooling",
    summary:
      "From a thesis idea to related papers, research-gap dimensions, and potential supervisors—with evidence in view.",
    stack: ["Next.js", "TypeScript", "Supabase", "Gemini / Vertex AI"],
    role: "Developer",
    status: "prototype",
    placement: "secondary",
    accent: "blue",
    sourceUrl: "https://github.com/akiibot/researchLensV2",
    screenshots: [
      capture(
        "researchlens-v1.jpg",
        "Earlier ResearchLens V1 public interface with research-idea form",
        "Earlier public interface (V1) · not a V2 deployment capture",
      ),
    ],
    caseStudy: {
      problem:
        "Thesis students need to compare an idea with existing research and identify useful directions and relevant researchers.",
      contribution:
        "Integrated scholarly retrieval, deduplication and ranking; defined PostgreSQL migrations, relationships, JSONB, indexes and owner-scoped API access.",
      architecture:
        "OpenAlex, Semantic Scholar and DataCite retrieval feeds ranking and gap analysis, with Gemini/Vertex AI analysis and optional Supabase persistence.",
      decisions: [
        "Combine multiple scholarly metadata sources and deduplicate results.",
        "Keep retrieved evidence visible alongside generated analysis.",
        "Scope saved reports per browser while making the prototype’s authentication limits explicit.",
      ],
      evidence: [
        {
          label: "V2 source and implementation notes",
          url: "https://github.com/akiibot/researchLensV2",
        },
      ],
      limitations: [
        "The V2 preview requires Vercel access. The pictured public interface is explicitly V1.",
        "Opaque browser-owner tokens are not a full account-authentication system.",
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
    screenshots: [],
  },
  {
    slug: "cropguard-ai",
    name: "CropGuard AI",
    number: "08",
    category: "Monitoring prototype",
    summary:
      "A bilingual crop-monitoring prototype with deterministic risk scoring, live updates, and AI narration.",
    stack: ["Next.js", "FastAPI", "WebSockets", "Pytest"],
    status: "prototype",
    placement: "additional",
    accent: "sage",
    sourceUrl: "https://github.com/akiibot/CropGuard-AI",
    screenshots: [],
  },
  {
    slug: "queuejhor",
    name: "QueueJhor",
    number: "09",
    category: "Backend API",
    summary:
      "Investigate support complaints against transaction evidence, with deterministic routing and optional AI fallback.",
    stack: ["Python", "FastAPI", "Docker"],
    status: "hackathon",
    placement: "additional",
    accent: "sand",
    sourceUrl: "https://github.com/akiibot/QueueJhor",
    screenshots: [],
  },
  {
    slug: "onetap-bus",
    name: "OneTap Bus",
    number: "10",
    category: "Full-stack · Team project",
    summary:
      "Bus routes, fare estimates, and a simulated seat-booking journey for Dhaka commuters.",
    stack: ["PHP", "MySQL", "JavaScript", "Leaflet"],
    status: "prototype",
    placement: "additional",
    accent: "peach",
    sourceUrl: "https://github.com/akiibot/OneTap-Bus",
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
  researchlens: {
    src: "/projects/covers/researchlens-editorial.png",
    alt: "Editorial illustration of research papers and a lens highlighting a research gap",
    width: 1672,
    height: 941,
    caption:
      "AI-generated project illustration · not a ResearchLens V2 screenshot",
  },
};
export const projects: readonly Project[] = portfolioProjects.map(
  (project) => ({
    ...project,
    role: "Lead architect & developer",
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
};
