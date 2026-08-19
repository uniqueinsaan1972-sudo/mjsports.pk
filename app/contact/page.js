"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FooterSimple, WhatsappFloat } from "@/components/Footer";

const PHONE_DISPLAY = "+92 312 7538519";
const WHATSAPP_LINK_BASE = "https://wa.me/923127538519";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const text = `Hi MJ Sports! My name is ${name || "..."}.\n\n${message}`;
    window.open(`${WHATSAPP_LINK_BASE}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Navbar active="" />

      <div className="page-hero">
        <div className="wrap">
          <div className="crumb"><Link href="/">Home</Link> / <span>Contact Us</span></div>
          <h1>Get In Touch</h1>
          <p>Questions about an order, sizing, or bulk requests &mdash; we&apos;re a message away.</p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 50, paddingBottom: 80 }}>
        <div className="contact-layout">
          <div className="contact-info">
            <div className="contact-info-block">
              <h4>&#128172; WhatsApp</h4>
              <p>
                <a href={WHATSAPP_LINK_BASE} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-soft)" }}>
                  {PHONE_DISPLAY}
                </a>
              </p>
            </div>
            <div className="contact-info-block">
              <h4>&#128222; Call Us</h4>
              <p><a href="tel:+923127538519" style={{ color: "var(--muted)" }}>{PHONE_DISPLAY}</a></p>
            </div>
            <div className="contact-info-block">
              <h4>&#128205; Visit Our Shop</h4>
              <p>Sialkot, Pakistan</p>
              <p>
                <a href="https://maps.app.goo.gl/PP4nqRD6gHyc4tvj9" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-soft)" }}>
                  Open in Google Maps
                </a>
              </p>
            </div>
            <div className="admin-note">
              &#9888;&#65039; We don&apos;t offer Cash on Delivery &mdash; orders are confirmed via advance payment, with a video of your exact article sent before packing.
            </div>
          </div>

          <div className="contact-form">
            <h3>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Your Name
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ali Raza" required />
              </label>
              <label>
                Message
                <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" required />
              </label>
              <button type="submit" className="btn-primary contact-submit">
                &#128172; Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>

      <FooterSimple />
      <WhatsappFloat />
    </>
  );
}