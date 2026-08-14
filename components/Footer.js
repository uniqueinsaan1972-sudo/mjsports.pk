import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { getCartWhatsappLink } from "@/lib/whatsapp";

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
        </div>
        <div>
          <h4>Shop</h4>
          <Link href="/bats">Bats</Link>
          <Link href="#">Caps</Link>
          <Link href="#">Kit Bags</Link>
          <Link href="#">Gloves</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="#">About Us</Link>
          <Link href="#">Contact</Link>
          <Link href="#">Return Policy</Link>
          <Link href="#">FAQs</Link>
        </div>
        <div>
          <h4>Get In Touch</h4>
          <span>Sialkot, Gujranwala &mdash; Pakistan</span>
          <span>TikTok: @mj.sports99</span>
          <span>WhatsApp Support</span>
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
      <div className="footer-bottom">
        <span>&copy; 2026 MJ Sports. All rights reserved.</span>
        <span>Built with Claude</span>
      </div>
    </footer>
  );
}

export function WhatsappFloat() {
  return (
    <a href={getCartWhatsappLink()} target="_blank" rel="noopener noreferrer" className="whatsapp-float">
      &#128172;
    </a>
  );
}