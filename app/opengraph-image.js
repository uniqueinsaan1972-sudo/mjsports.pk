import { ImageResponse } from "next/og";

export const alt = "MJ Sports - cricket gear from Sialkot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0c2219", color: "#fff", borderBottom: "18px solid #c9922a" }}>
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 10, color: "#c9922a", textTransform: "uppercase" }}>Sialkot, Pakistan</div>
        <div style={{ display: "flex", fontSize: 150, fontWeight: 800, lineHeight: 1, marginTop: 16 }}>MJ SPORTS</div>
        <div style={{ display: "flex", fontSize: 44, marginTop: 24, color: "#d5e0d9" }}>Cricket bats and sports gear</div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 36, color: "#c9922a" }}>mjsports.pk</div>
      </div>
    ),
    size
  );
}
