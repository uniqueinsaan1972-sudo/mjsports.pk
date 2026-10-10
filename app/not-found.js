import Link from "next/link";
import StoreShell from "@/components/StoreShell";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <StoreShell>
      <div className="container not-found">
        <div className="big" aria-hidden="true">4<span>0</span>4</div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>Page not found</h1>
        <p style={{ color: "var(--c-muted)", maxWidth: "46ch", margin: "0 auto 24px" }}>That page does not exist or has moved. Head back to the shop to find bats, caps, kit bags and more.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/shop" className="btn btn-secondary">Shop products</Link>
        </div>
      </div>
    </StoreShell>
  );
}
