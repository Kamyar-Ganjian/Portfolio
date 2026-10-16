import { ImageResponse } from "next/og";

export const alt = "Kamyar Ganjian — Software Engineer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#f7f9fc",
          color: "#101828",
          padding: "72px 82px",
          fontFamily: "Arial, sans-serif",
          border: "18px solid #e1e7ef",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, color: "#1d4ed8" }}>
          <span style={{ width: 38, height: 2, background: "#2563eb" }} />
          SOFTWARE ENGINEERING · BABOL, IRAN
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.04em" }}>
          <span>Kamyar Ganjian</span>
          <span style={{ color: "#2563eb" }}>
            Software Engineer
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Arial, sans-serif", fontSize: 23, color: "#536176" }}>
          <span>Frontend · Full-stack · AI Engineering</span>
          <span>kamyar-ganjian-portfolio.vercel.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
