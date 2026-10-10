import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FACTS, CONTACT } from "@/lib/siteConfig";

export const metadata = {
  title: "About MJ Sports",
  description: "MJ Sports was founded in 2024 in Sialkot, Pakistan. Learn about our replacement guarantee, advance-payment process and how we ship cricket bats worldwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
      <div className="container page-head"><span className="eyebrow">Sialkot crafted</span><h1>The MJ Sports story</h1></div>
      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="prose">
          <p>MJ Sports was founded in {FACTS.founded} in Sialkot, Pakistan, a city known worldwide for its cricket gear craftsmanship. Our founder, {FACTS.founder}, built MJ Sports with a simple promise: genuine quality, backed by a real replacement guarantee.</p>
          <p>The business is run end to end by {FACTS.manager}, owner and manager, who handles every online order and shop handle.</p>
          <p>We have earned the trust of {FACTS.customers} customers in Sialkot and sold {FACTS.batsSold} bats. We have now opened our first physical branch in Sialkot, alongside our online store.</p>

          <h2>Shipped worldwide</h2>
          <p>MJ Sports bats travel to {FACTS.shipsTo.slice(0, -1).join(", ")} and {FACTS.shipsTo.slice(-1)}. Every order within Pakistan ships with our full replacement guarantee.</p>

          <h2>How we work</h2>
          <p>When you send advance payment and confirm your order, we record and send you a video of your exact article before packing, so what you see is what you get.</p>
          <p>We do not offer Cash on Delivery. COD payments go through the rider or courier company and rarely reach us properly, so we operate on advance payment. This keeps quality control tight and the guarantee intact for every customer. Customers near Sialkot can visit our shop directly.</p>
          <p><Link href="/shop" className="btn btn-primary">Shop now</Link>{" "}<Link href="/contact" className="btn btn-secondary">Contact us</Link></p>
          <p className="note">Shop: <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">{CONTACT.address}</a></p>
        </div>
      </div>
    </>
  );
}
