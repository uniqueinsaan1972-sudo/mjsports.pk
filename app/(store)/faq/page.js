import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { DELIVERY_FEE, FACTS } from "@/lib/siteConfig";

const FAQS = [
  { q: "How do I place an order?", a: "Add products to your cart, choose pickup or home delivery, and press the confirm button. Your order opens on WhatsApp, where we confirm it with you. You can also message us directly on WhatsApp." },
  { q: "Do you offer Cash on Delivery?", a: "No. COD payments go through the rider or courier company and rarely reach us properly, so we work on advance payment. This keeps quality control tight and the guarantee intact for every customer." },
  { q: "Will I see my product before it is packed?", a: "Yes. After you send advance payment and confirm your order, we record and send you a video of your exact article before packing." },
  { q: "What does the replacement guarantee cover?", a: "Every MJ Sports order comes with our replacement guarantee. Message us on WhatsApp with your order details and we will confirm the replacement terms for your article." },
  { q: "How much is delivery?", a: `Home delivery costs Rs ${DELIVERY_FEE.toLocaleString()} per order. Pickup from our shop in Sialkot is free.` },
  { q: "Can I collect my order from the shop?", a: "Yes. Choose pickup in your cart and collect from our shop in Sialkot. The address and map link are on the contact page." },
  { q: "Do you ship outside Pakistan?", a: `Yes. MJ Sports bats have been sent to ${FACTS.shipsTo.join(", ")}. Message us on WhatsApp for international orders.` },
  { q: "How do coupon codes work?", a: "Enter your code in the cart before confirming your order. The discount is shown in the order summary." },
];

export const metadata = {
  title: "FAQ: Ordering, Delivery & Replacement",
  description: "Answers about ordering from MJ Sports: advance payment, video before packing, delivery fee, shop pickup, international shipping and the replacement guarantee.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ", href: "/faq" }]} />
      <div className="container page-head"><h1>Frequently asked questions</h1></div>
      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="faq prose">
          {FAQS.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
        <p style={{ marginTop: 28 }}>Still have a question? <Link href="/contact" className="link-arrow">Contact us</Link></p>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </>
  );
}
