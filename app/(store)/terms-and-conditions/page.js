import Breadcrumbs from "@/components/Breadcrumbs";
import { DELIVERY_FEE, CONTACT } from "@/lib/siteConfig";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms for ordering from MJ Sports: advance payment, no cash on delivery, delivery fee, shop pickup and the replacement guarantee.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms & conditions", href: "/terms-and-conditions" }]} />
      <div className="container page-head"><h1>Terms &amp; conditions</h1><p className="note">Last updated: October 2026</p></div>
      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="prose">
          <p>By ordering from MJ Sports you agree to these terms.</p>
          <h2>Orders and payment</h2>
          <p>Orders are placed and confirmed through WhatsApp. We work on advance payment and do not offer Cash on Delivery. An order is confirmed once you send advance payment and we acknowledge it. Before packing, we send you a video of your exact article.</p>
          <h2>Prices</h2>
          <p>All prices are in Pakistani rupees (PKR). Prices and availability can change, and the price confirmed with you on WhatsApp applies to your order.</p>
          <h2>Delivery</h2>
          <p>Home delivery within Pakistan costs Rs {DELIVERY_FEE.toLocaleString()} per order. Pickup from our shop in Sialkot is free. For international orders, contact us for shipping details.</p>
          <h2>Replacement guarantee</h2>
          <p>Every MJ Sports order is covered by our replacement guarantee. The replacement terms for your article are confirmed with you on WhatsApp. Contact us with your order details to make a claim.</p>
          <h2>Use of the website</h2>
          <p>Product images and descriptions are provided for information. Do not copy, resell or misuse the website content or attempt to access areas that are not public.</p>
          <h2>Limitation</h2>
          <p>We make reasonable efforts to keep the website accurate and available but do not guarantee it will be error-free or uninterrupted.</p>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of Pakistan.</p>
          <h2>Contact</h2>
          <p><a href={`https://wa.me/${CONTACT.whatsappNumber}`}>WhatsApp {CONTACT.phoneDisplay}</a></p>
        </div>
      </div>
    </>
  );
}
