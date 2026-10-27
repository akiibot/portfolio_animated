export type AwardPhoto = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};
export type AwardAlbum = {
  id: string;
  title: string;
  subtitle: string;
  fit: "cover" | "contain";
  position?: string;
  photos: readonly AwardPhoto[];
};
export const awardAlbums: readonly AwardAlbum[] = [
  {
    id: "buildfest",
    title: "AI Buildfest 2026",
    subtitle: "MarTech champion · Imprnt AI · Team Breaking BRAC",
    fit: "cover",
    position: "center 42%",
    photos: [
      {
        src: "/awards/buildfest-trophy.jpg",
        alt: "AI Buildfest champion trophy and presentation cheque at the event",
        caption:
          "Champion trophy and presentation cheque at The Infinity AI Buildfest 2026.",
        width: 1536,
        height: 2048,
      },
      {
        src: "/awards/buildfest-announcement.jpg",
        alt: "AI Buildfest winner announcement naming Breaking BRAC and Imprnt AI",
        caption:
          "Winner announcement: Branding & Marketing (MarTech), Team Breaking BRAC, project Imprnt AI.",
        width: 1080,
        height: 1350,
      },
      {
        src: "/awards/buildfest-team.jpeg",
        alt: "Team Breaking BRAC with the AI Buildfest trophy and champion cheque",
        caption: "Team Breaking BRAC featured by TBS Graduates, 14 June 2026.",
        width: 1080,
        height: 1350,
      },
    ],
  },
  {
    id: "nasa",
    title: "NASA Space Apps 2025",
    subtitle: "Global finalist · Team Vitruvian 6 · CosmoScope",
    fit: "contain",
    photos: [
      {
        src: "/awards/nasa-finalist-announcement.jpg",
        alt: "NASA Space Apps Global Finalists announcement for Team Vitruvian 6 from Dhaka",
        caption:
          "Global finalist announcement for Team Vitruvian 6, Dhaka, Bangladesh.",
        width: 2048,
        height: 2048,
      },
      {
        src: "/awards/nasa-team-profile.jpg",
        alt: "Global Finalist team profile naming Vitruvian 6 and the Embiggen Your Eyes challenge",
        caption:
          "Vitruvian 6’s finalist profile describes CosmoScope and the Embiggen Your Eyes! challenge.",
        width: 932,
        height: 1492,
      },
    ],
  },
  {
    id: "iut",
    title: "IUT GameJam 2026",
    subtitle: "Champion · Team Oranges · 12th IUT ICT Fest",
    fit: "cover",
    position: "center 42%",
    photos: [
      {
        src: "/awards/iut-gamejam-trophy.jpg",
        alt: "IUT GameJam champion trophy and Team Oranges presentation cheque",
        caption:
          "Champion trophy and Team Oranges cheque at the 12th IUT ICT Fest 2026 GameJam.",
        width: 1530,
        height: 1530,
      },
      {
        src: "/awards/iut-gamejam-team.jpg",
        alt: "Team Oranges holding the IUT GameJam champion trophy and cheque",
        caption:
          "Team Oranges with the GameJam champion trophy and presentation cheque.",
        width: 1931,
        height: 2048,
      },
    ],
  },
  {
    id: "prompt",
    title: "Prompt engineering",
    subtitle: "Champion · BRACU ROBU Traction 2025",
    fit: "cover",
    position: "center",
    photos: [
      {
        src: "/awards/prompt-engineering-champion.jpg",
        alt: "Prompt Engineering champion prize presentation at BRACU ROBU Traction",
        caption:
          "Champion prize presentation for the Prompt Engineering competition at BRACU ROBU Traction 2025.",
        width: 1454,
        height: 960,
      },
    ],
  },
  {
    id: "duke",
    title: "Camp recognition",
    subtitle: "Duke of Edinburgh expedition · Best Camper & Best Team",
    fit: "contain",
    photos: [
      {
        src: "/awards/duke-expedition.jpg",
        alt: "Best Camper Award and Best Team trophies from the Duke of Edinburgh expedition",
        caption:
          "Best Camper & Best Team recognition during the Duke of Edinburgh expedition.",
        width: 960,
        height: 1280,
      },
    ],
  },
];
