"use client";

export default function Error({ reset }) {
  return (
    <div className="container not-found">
      <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>Something went wrong</h1>
      <p style={{ color: "var(--c-muted)", margin: "0 auto 24px", maxWidth: "46ch" }}>Please try again. If the problem continues, message us on WhatsApp.</p>
      <button className="btn btn-primary" onClick={() => reset()}>Try again</button>
    </div>
  );
}
