"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FooterSimple, WhatsappFloat } from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar active="" />

      <div className="page-hero">
        <div className="wrap">
          <div className="crumb"><Link href="/">Home</Link> / <span>Our Story</span></div>
          <h1>The MJ Sports Story</h1>
          <p>Sialkot crafted &middot; Trusted worldwide</p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 50, paddingBottom: 80, maxWidth: 800 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, color: "var(--muted)", fontSize: 15, lineHeight: 1.9 }}>

          <p>
            MJ Sports was founded in <b style={{ color: "var(--off)" }}>2024 in Sialkot, Pakistan</b> — a city known worldwide for its cricket gear craftsmanship. Our founder, <b style={{ color: "var(--off)" }}>Muhammad Javed</b>, widely known as <b style={{ color: "var(--off)" }}>&quot;Meer Sahab,&quot;</b> built MJ Sports from the ground up with a simple promise: genuine quality, backed by a real replacement guarantee.
          </p>

          <p>
            The business is run end-to-end by <b style={{ color: "var(--off)" }}>Hamid Sadique</b> — owner, manager, and the person behind every online order and shop handle at MJ Sports.
          </p>

          <p>
            In a short span of time, MJ Sports has earned the trust of <b style={{ color: "var(--off)" }}>10,000+ customers</b> in Sialkot alone, selling <b style={{ color: "var(--off)" }}>20,000&ndash;30,000+ bats</b> &mdash; a milestone built entirely on quality craftsmanship and our replacement guarantee.
          </p>

          <p>
            We&apos;ve now opened our <b style={{ color: "var(--off)" }}>first physical branch in Sialkot</b>, alongside our online presence on{" "}
            <a href="https://mjsports.pk" style={{ color: "var(--gold-soft)" }}>Mjsports.pk</a>, Facebook, and TikTok.
          </p>

          <p>
            MJ Sports bats aren&apos;t just loved in Pakistan &mdash; they travel internationally to{" "}
            <b style={{ color: "var(--off)" }}>Oman, Netherlands, Korea, Bangladesh, Saudi Arabia, Iran, UK, Malaysia,</b> and <b style={{ color: "var(--off)" }}>Dubai</b>. Every single order, anywhere in Pakistan, ships with our full replacement guarantee.
          </p>

          <div className="admin-note">
            &#9989; <b>Our promise to you:</b> customers trust us fully, and we honor that trust fully. When you send advance payment and confirm your order, we record and send you a video of your exact article before packing &mdash; so what you see is exactly what you get. Alhamdulillah.
          </div>

          <p>
            We currently don&apos;t offer Cash on Delivery &mdash; COD payments go through the rider/courier company and rarely reach us properly, which is why we operate on advance payment. This keeps quality control tight and guarantees intact for every customer, especially those near Sialkot who can visit our shop directly.
          </p>

          <div className="why-card" style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 16, padding: 26, textAlign: "left" }}>
            <h3 style={{ marginBottom: 10 }}>&#128205; Visit Our Shop</h3>
            <p style={{ marginBottom: 14 }}>Come see the craftsmanship yourself, right here in Sialkot.</p>
            <a
              href="https://maps.app.goo.gl/PP4nqRD6gHyc4tvj9"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "inline-block" }}
            >
              Open in Google Maps
            </a>
          </div>

        </div>
      </div>

      <FooterSimple />
      <WhatsappFloat />
    </>
  );
}