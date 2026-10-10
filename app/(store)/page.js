import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ShieldIcon, VideoIcon, TruckIcon, ShopIcon, ArrowIcon, PinIcon, PhoneIcon, WhatsappIcon } from "@/components/Icons";
import { getAllProducts, getNavCategories } from "@/lib/serverData";
import { categorySlug } from "@/lib/categories";
import { img } from "@/lib/images";
import { HERO_IMAGE, FACTS, DELIVERY_FEE, CONTACT } from "@/lib/siteConfig";

export const metadata = {
  title: { absolute: "MJ Sports | Cricket Bats, Kit Bags & Gear from Sialkot" },
  description: "Buy cricket bats, caps, kit bags, gloves and sports gear from MJ Sports, Sialkot. Advance payment, video of your exact article before packing, replacement guarantee.",
  alternates: { canonical: "/" },
  openGraph: { title: "MJ Sports | Cricket gear from Sialkot", description: "Cricket bats and sports gear from Sialkot with a replacement guarantee.", url: "/" },
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([getAllProducts(), getNavCategories()]);
  const featured = products.filter((p) => p.featured);
  const showcase = (featured.length ? featured : products).slice(0, 8);
  const labels = Object.fromEntries(categories.map((c) => [c.slug, c.label]));
  const thumbFor = (slug) => products.find((p) => categorySlug(p.category) === slug && p.thumbnail)?.thumbnail;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Sialkot &middot; Since {FACTS.founded}</span>
            <h1 id="hero-title">Cricket bats <em>made in Sialkot</em></h1>
            <p className="lead">Every order ships with our replacement guarantee. Before we pack, we send you a video of your exact bat.</p>
            <div className="hero-actions">
              <Link href="/bats" className="btn btn-primary">Shop bats <ArrowIcon size={18} /></Link>
              <Link href="/faq" className="btn btn-light">How ordering works</Link>
            </div>
          </div>
          <div className="hero-art">
            <img src={img(HERO_IMAGE.src, 900)} alt={HERO_IMAGE.alt} width="560" height="560" fetchPriority="high" />
          </div>
        </div>
      </section>

      <section className="trust" aria-label="Why buy from MJ Sports">
        <div className="container trust-grid">
          <div className="trust-item"><ShieldIcon /><div><strong>Replacement guarantee</strong><span>On every order across Pakistan</span></div></div>
          <div className="trust-item"><VideoIcon /><div><strong>Video before packing</strong><span>See your exact article first</span></div></div>
          <div className="trust-item"><TruckIcon /><div><strong>Home delivery</strong><span>Rs {DELIVERY_FEE.toLocaleString()} per order</span></div></div>
          <div className="trust-item"><ShopIcon /><div><strong>Shop pickup</strong><span>Free, from our Sialkot shop</span></div></div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="section" aria-labelledby="cats-h">
          <div className="container">
            <div className="section-head"><h2 id="cats-h">Shop by category</h2><Link href="/shop" className="link-arrow">All products <ArrowIcon size={16} /></Link></div>
            <div className="cat-grid">
              {categories.map((c) => {
                const t = thumbFor(c.slug);
                return (
                  <Link key={c.slug} href={`/${c.slug}`} className="cat-tile">
                    <div className="thumb">{t ? <img src={img(t, 400)} alt="" width="400" height="300" loading="lazy" /> : <span aria-hidden="true">{c.label.charAt(0)}</span>}</div>
                    <div className="label"><span>{c.label}</span><small>{c.count} {c.count === 1 ? "item" : "items"}</small></div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section section--white" aria-labelledby="feat-h">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">{featured.length ? "Featured" : "Latest"}</span><h2 id="feat-h">{featured.length ? "Featured products" : "New in the shop"}</h2></div>
            <Link href="/shop" className="link-arrow">View all <ArrowIcon size={16} /></Link>
          </div>
          {showcase.length ? (
            <div className="product-grid">
              {showcase.map((p, i) => <ProductCard key={p.id} product={p} categoryLabel={labels[categorySlug(p.category)]} priority={i < 4} />)}
            </div>
          ) : (
            <div className="empty"><h3>Products are on the way</h3><p>Our catalogue is being updated. Message us on WhatsApp and we will help you directly.</p></div>
          )}
        </div>
      </section>

      <section className="section section--ink" aria-labelledby="story-h">
        <div className="container split">
          <div>
            <span className="eyebrow">Our story</span>
            <h2 id="story-h">Built in Sialkot, trusted across Pakistan</h2>
            <p>MJ Sports was founded in {FACTS.founded} in Sialkot, a city known worldwide for its cricket gear. We back every order with a replacement guarantee.</p>
            <Link href="/about" className="btn btn-light">About MJ Sports</Link>
          </div>
          <div className="stats">
            <div className="stat"><strong>{FACTS.customers}</strong><span>customers in Sialkot</span></div>
            <div className="stat"><strong>{FACTS.batsSold}</strong><span>bats sold</span></div>
            <div className="stat"><strong>{FACTS.founded}</strong><span>year founded</span></div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="visit-h">
        <div className="container">
          <h2 id="visit-h">Visit or message us</h2>
          <div className="contact-cards">
            <div className="contact-card"><PinIcon /><strong>Our shop</strong><span>{CONTACT.address}</span><a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></div>
            <div className="contact-card"><WhatsappIcon /><strong>WhatsApp</strong><span>Orders, sizing and bulk requests</span><a href={`https://wa.me/${CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer">{CONTACT.phoneDisplay}</a></div>
            <div className="contact-card"><PhoneIcon /><strong>Call us</strong><span>Talk to the team directly</span><a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a></div>
          </div>
        </div>
      </section>
    </>
  );
}
