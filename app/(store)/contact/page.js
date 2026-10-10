import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import { PhoneIcon, WhatsappIcon, PinIcon } from "@/components/Icons";
import { CONTACT } from "@/lib/siteConfig";

export const metadata = {
  title: "Contact MJ Sports",
  description: "Contact MJ Sports in Sialkot by WhatsApp or phone for orders, sizing and bulk requests, or visit our shop.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />
      <div className="container page-head"><h1>Get in touch</h1><p>Questions about an order, sizing or bulk requests? We are a message away.</p></div>
      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="contact-cards">
          <div className="contact-card"><WhatsappIcon /><strong>WhatsApp</strong><a href={`https://wa.me/${CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer">{CONTACT.phoneDisplay}</a></div>
          <div className="contact-card"><PhoneIcon /><strong>Call us</strong><a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a></div>
          <div className="contact-card"><PinIcon /><strong>Visit our shop</strong><span>{CONTACT.address}</span><a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></div>
        </div>
        <p className="notice" style={{ margin: "24px 0" }}>We do not offer Cash on Delivery. Orders are confirmed with advance payment, and we send a video of your exact article before packing.</p>
        <div style={{ maxWidth: 560 }}>
          <h2>Send us a message</h2>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
