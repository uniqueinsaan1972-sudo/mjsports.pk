import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { getGeneralWhatsappLink } from "@/lib/whatsapp";

const FACEBOOK_URL = "https://www.facebook.com/people/MJ-Sports/61554667569001/";
const TIKTOK_URL = "https://www.tiktok.com/@mj.sports99";

function SocialRow() {
  return (
    <div className="social-row">
      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.9.25-1.5 1.5-1.5h1.5V4.35C16.25 4.25 15.19 4 14 4c-2.5 0-4 1.5-4 4.5V10.5H7.5v3H10V21h3.5z"/></svg>
      </a>
      <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.4 2 1.9 3.5 4 3.8v3c-1.5 0-2.9-.4-4-1.2v6.4c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .8 0 1.2.1v3.1c-.4-.1-.8-.2-1.2-.2-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3V3h3z"/></svg>
      </a>
    </div>
  );
}

export function FooterFull() {
  return (
    <footer id="footer">
      <div className="footer-grid">
        <div>
          <div style={{ marginBottom: 16 }}>
            <BrandMark />
          </div>
          <p style={{ maxWidth: 280 }}>
            Premium cricket gear crafted in Sialkot &mdash; bats, caps, kits and accessories for every level of the game.
          </p>
          <SocialRow />
        </div>
        <div>
          <h4>Shop</h4>
          <Link href="/bats">Bats</Link>
          <Link href="/caps">Caps</Link>
          <Link href="/kits">Kit Bags</Link>
          <Link href="/gloves">Gloves</Link>
          <Link href="/balls">Balls</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="#">Return Policy</Link>
          <Link href="#">FAQs</Link>
        </div>
        <div>
          <h4>Get In Touch</h4>
          <span>Sialkot, Gujranwala &mdash; Pakistan</span>
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">TikTok: @mj.sports99</a>
          <a href={getGeneralWhatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 MJ Sports. All rights reserved.</span>
        <span>Built with Claude</span>
      </div>
    </footer>
  );
}

export function FooterSimple() {
  return (
    <footer>
      <div className="footer-bottom" style={{ alignItems: "center" }}>
        <span>&copy; 2026 MJ Sports. All rights reserved.</span>
        <SocialRow />
      </div>
    </footer>
  );
}

export function WhatsappFloat() {
  return (
    <a href={getGeneralWhatsappLink()} target="_blank" rel="noopener noreferrer" className="whatsapp-float">&#128172;</a>
  );
}