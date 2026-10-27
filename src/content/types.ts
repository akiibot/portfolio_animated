export type Screenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};
export type CaseStudy = {
  problem: string;
  contribution: string;
  architecture: string;
  decisions: string[];
  evidence: { label: string; url?: string }[];
  limitations: string[];
  outcome?: string;
};
export type ProjectVideo =
  { kind: "youtube"; id: string } | { kind: "file"; src: string };
export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  stack: string[];
  role?: string;
  status: "product" | "prototype" | "hackathon";
  placement: "primary" | "secondary" | "additional";
  sourceUrl?: string;
  demo?: {
    url: string;
    kind:
      | "live-app"
      | "sample-dashboard"
      | "simulated-demo"
      | "login-required"
      | "downloadable-game";
    checkedAt: string;
  };
  video?: ProjectVideo;
  screenshots: Screenshot[];
  cover?: Screenshot;
  caseStudy?: CaseStudy;
  accent: string;
  number: string;
};
