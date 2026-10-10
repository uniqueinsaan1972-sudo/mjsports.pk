import Link from "next/link";
import Logo from "@/components/Logo";
import { PhoneIcon, WhatsappIcon, PinIcon, TikTokIcon, FacebookIcon } from "@/components/Icons";
import { BRAND, CONTACT, SOCIAL } from "@/lib/siteConfig";

const SOCIAL_ICON = { tiktok: TikTokIcon, facebook: FacebookIcon };

export default function Footer({ categories, logoImage }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo logoImage={logoImage} />
          <p style={{ marginTop: 16, maxWidth: "32ch" }}>{BRAND.tagline}. Advance payment, a video of your exact article before packing, and a replacement guarantee.</p>
          <div className="footer-social">
            {SOCIAL.map((s) => {
              const Icon = SOCIAL_ICON[s.id];
              return (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`MJ Sports on ${s.label}`}>
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h3>Shop</h3>
          <ul>
            <li><Link href="/shop">All products</Link></li>
            {categories.map((c) => <li key={c.slug}><Link href={`/${c.slug}`}>{c.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3>Support</h3>
          <ul>
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy-policy">Privacy policy</Link></li>
            <li><Link href="/terms-and-conditions">Terms &amp; conditions</Link></li>
          </ul>
        </div>
        <div>
          <h3>Visit &amp; contact</h3>
          <ul>
            <li style={{ display: "flex", gap: 8 }}><PinIcon size={18} /><a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">{CONTACT.address}</a></li>
            <li style={{ display: "flex", gap: 8 }}><PhoneIcon size={18} /><a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a></li>
            <li style={{ display: "flex", gap: 8 }}><WhatsappIcon size={18} /><a href={`https://wa.me/${CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>&copy; {new Date().getFullYear()} MJ Sports. All rights reserved.</span>
        <span>Sialkot, Pakistan</span>
      </div>
    </footer>
  );
}
