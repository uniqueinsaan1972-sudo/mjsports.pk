"use client";

import { useState } from "react";
import { WhatsappIcon, CheckIcon } from "@/components/Icons";
import { CONTACT } from "@/lib/siteConfig";

export default function ContactForm() {
  const [state, setState] = useState({ name: "", message: "", website: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (state.website) return; // honeypot: bots fill hidden fields
    const name = state.name.trim();
    const message = state.message.trim();
    const errs = {};
    if (name.length < 2) errs.name = "Please enter your name.";
    if (message.length < 5) errs.message = "Please write a short message.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const text = `Hi MJ Sports, my name is ${name}.\n\n${message}`;
    window.open(`https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent)
    return (
      <div className="notice" role="status">
        <CheckIcon size={18} /> WhatsApp has opened with your message. Press send there and we will reply to you. <button type="button" className="linklike" onClick={() => { setSent(false); setState({ name: "", message: "", website: "" }); }}>Write another</button>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="c-name">Your name</label>
        <input id="c-name" className="input" maxLength={80} value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} aria-invalid={!!errors.name} autoComplete="name" />
        {errors.name && <span className="error-text" role="alert">{errors.name}</span>}
      </div>
      <div className="field">
        <label htmlFor="c-msg">Message</label>
        <textarea id="c-msg" className="textarea" maxLength={1000} value={state.message} onChange={(e) => setState({ ...state, message: e.target.value })} aria-invalid={!!errors.message} />
        {errors.message && <span className="error-text" role="alert">{errors.message}</span>}
      </div>
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label>Website<input tabIndex={-1} autoComplete="off" value={state.website} onChange={(e) => setState({ ...state, website: e.target.value })} /></label>
      </div>
      <button className="btn btn-primary" type="submit"><WhatsappIcon size={18} /> Send on WhatsApp</button>
    </form>
  );
}
