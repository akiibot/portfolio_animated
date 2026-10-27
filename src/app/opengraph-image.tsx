import { ImageResponse } from "next/og";
export const alt = "Akib — Software Engineer & Product Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "70px",
        background: "#11130f",
        color: "#eeece5",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: "#c4d4ac",
        }}
      >
        <span>YEANUL HAQUE KHAN</span>
        <span>DHAKA, BANGLADESH</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 180,
          fontWeight: 700,
          letterSpacing: -12,
        }}
      >
        Akib<span style={{ color: "#c4d4ac" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 30,
        }}
      >
        <span>Software engineer. Product builder.</span>
        <span style={{ color: "#c4d4ac" }}>akiibotportfolio.vercel.app</span>
      </div>
    </div>,
    size,
  );
}
