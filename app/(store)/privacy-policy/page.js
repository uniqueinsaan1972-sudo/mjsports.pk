import Breadcrumbs from "@/components/Breadcrumbs";
import { CONTACT } from "@/lib/siteConfig";

export const metadata = {
  title: "Privacy Policy",
  description: "How MJ Sports handles information on mjsports.pk: cart and favourites stored in your browser, WhatsApp orders, analytics and third-party services.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy policy", href: "/privacy-policy" }]} />
      <div className="container page-head"><h1>Privacy policy</h1><p className="note">Last updated: October 2026</p></div>
      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="prose">
          <p>This policy explains what information mjsports.pk (&ldquo;MJ Sports&rdquo;, &ldquo;we&rdquo;) handles when you use the website.</p>
          <h2>Information stored in your browser</h2>
          <p>Your cart and your favourites are saved in your own browser (local storage) so they are still there when you return. We do not receive this data on a server. Clearing your browser data removes it.</p>
          <h2>Orders and messages</h2>
          <p>We do not take payments or collect customer accounts on this website. When you confirm an order or send a message, the website opens WhatsApp with your message. The details you type there (such as name, phone number and delivery address) are shared with us through WhatsApp and are used only to process your order and reply to you.</p>
          <h2>Analytics</h2>
          <p>We use Google Analytics to understand how visitors use the website, such as which pages are viewed. Google may set cookies for this purpose. You can block these cookies in your browser settings.</p>
          <h2>Third-party services</h2>
          <p>The website uses Google Firebase to store our product catalogue and Cloudinary to deliver product images. These services may receive technical information such as your IP address when your browser loads data from them.</p>
          <h2>Sharing</h2>
          <p>We do not sell your personal information. We only share order details with courier companies when needed to deliver your order.</p>
          <h2>Your choices</h2>
          <p>You can ask us to delete any order details you sent us on WhatsApp by contacting us.</p>
          <h2>Contact</h2>
          <p>Questions about this policy: <a href={`https://wa.me/${CONTACT.whatsappNumber}`}>WhatsApp {CONTACT.phoneDisplay}</a> or <a href={`tel:${CONTACT.phoneTel}`}>call us</a>.</p>
        </div>
      </div>
    </>
  );
}
