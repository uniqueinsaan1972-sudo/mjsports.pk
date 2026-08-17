"use client";
import ScrollFadeUp from "@/components/ScrollFadeUp";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FooterFull, WhatsappFloat } from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { subscribeProducts } from "@/lib/firestoreProducts";
import SocialSection from "@/components/SocialSection";
import { getGeneralWhatsappLink } from "@/lib/whatsapp";

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const unsub = subscribeProducts(setProducts);
    return () => unsub();
  }, []);
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <Navbar active="Bats" />

      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Sialkot Crafted &middot; Since Day One</div>
            <h1>Gear Built<br />For The <span className="accent">Chase</span></h1>
            <p className="lede">
              MJ Sports crafts bats, caps and kits made for players who put in the overs.
              Straight from Sialkot&apos;s workshops to your crease &mdash; premium quality, honest prices.
            </p>
            <div className="hero-ctas">
              <Link href="/bats" className="btn-primary">Shop Bats</Link>
              <Link href="#categories" className="btn-outline">Browse Categories</Link>
            </div>
            <div className="hero-stats">
              <div><b>500+</b><span>Bats Delivered</span></div>
              <div><b>50K+</b><span>TikTok Family</span></div>
              <div><b>4.9&#9733;</b><span>Customer Rating</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div
              className="bat-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                perspective: "800px",
              }}
            >
              <img
                src="https://res.cloudinary.com/jt3vstt9/image/upload/v1786708265/bat_cutout4__1_-removebg-preview_nazehl.png"
                alt="MJ Sports Cricket Bat"
                style={{
                  maxHeight: "440px",
                  filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))",
                  transform: "rotate(-6deg) rotateY(8deg)",
                  transition: "transform 0.4s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(-2deg) rotateY(-4deg) scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(-6deg) rotateY(8deg) scale(1)")}
              />
            </div>
            <div className="float-tag t1">&#9989; Approved by Admin</div>
            <div className="float-tag t2">&#128666; Free Shipping PK-Wide</div>
          </div>
        </div>
      </section>

      <ScrollFadeUp>
        <section className="section" id="categories">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Shop By Category</div>
              <h2>Everything On The Kit List</h2>
              <p>From match-ready bats to matching caps &mdash; all in one place.</p>
            </div>
            <div className="cat-grid">
              <Link href="/bats" className="cat-card">
                <div className="ic">&#127955;</div><h3>Cricket Bats</h3><span className="count">English &amp; Kashmir Willow</span>
              </Link>
              <Link href="/caps" className="cat-card">
                <div className="ic">&#128081;</div><h3>Caps &amp; Hats</h3><span className="count">Team &amp; Casual Styles</span>
              </Link>
              <Link href="/kit-bags" className="cat-card">
                <div className="ic">&#127959;</div><h3>Kit Bags</h3><span className="count">Duffel &amp; Wheelie</span>
              </Link>
              <Link href="/gloves" className="cat-card">
                <div className="ic">&#129508;</div><h3>Gloves</h3><span className="count">Batting &amp; Wicket Keeping</span>
              </Link>
              <Link href="/balls" className="cat-card">
                <div className="ic">&#9917;</div><h3>Balls</h3><span className="count">Tape, Hard &amp; Tennis</span>
              </Link>
              <Link href="/apparel" className="cat-card">
                <div className="ic">&#128100;</div><h3>Apparel</h3><span className="count">Jerseys &amp; Trousers</span>
              </Link>
            </div>
          </div>
        </section>
      </ScrollFadeUp>

      <ScrollFadeUp delay={100}>
        <section className="section" id="products" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Featured Picks</div>
              <h2>This Week&apos;s Best Sellers</h2>
            </div>
            <div className="product-grid">
              {featured.length === 0 ? (
                <p style={{ color: "var(--muted)" }}>No featured products yet — add some from Admin Panel.</p>
              ) : (
                featured.map((p) => <ProductCard key={p.id} product={p} category={p.category} />)
              )}
            </div>
          </div>
        </section>
      </ScrollFadeUp>

      <ScrollFadeUp>
        <div className="stats-band">
          <div className="stats-inner">
            <div className="stat"><b>10+</b><span>Years Crafting</span></div>
            <div className="stat"><b>500+</b><span>Bats Sold</span></div>
            <div className="stat"><b>50K+</b><span>TikTok Followers</span></div>
            <div className="stat"><b>4.9/5</b><span>Avg. Rating</span></div>
            <div className="stat"><b>PK</b><span>Wide Delivery</span></div>
          </div>
        </div>
      </ScrollFadeUp>

      <ScrollFadeUp>
        <section className="section" id="why">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Why MJ Sports</div>
              <h2>Straight From The Workshop</h2>
            </div>
            <div className="why-grid">
              <div className="why-card"><div className="ic">&#128737;</div><h3>Secure Checkout</h3><p>COD &amp; online payment, your order protected end to end.</p></div>
              <div className="why-card"><div className="ic">&#128666;</div><h3>Fast Shipping</h3><p>Dispatched from Sialkot within 24-48 hours.</p></div>
              <div className="why-card"><div className="ic">&#128257;</div><h3>Easy Exchange</h3><p>Size or damage issue? Hassle-free replacement.</p></div>
              <div className="why-card"><div className="ic">&#9989;</div><h3>Genuine Quality</h3><p>Every bat graded and checked before it ships.</p></div>
            </div>
          </div>
        </section>
      </ScrollFadeUp>

      <ScrollFadeUp>
        <section className="section" id="visit">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Visit Our Shop</div>
              <h2>Pakistan&apos;s First Class Bats</h2>
              <p>Straight from our Sialkot workshop &mdash; come see the craftsmanship yourself.</p>
            </div>
            <div className="why-grid">
              <a
                href="https://wa.me/923127538519"
                target="_blank"
                rel="noopener noreferrer"
                className="why-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="ic">&#128241;</div>
                <h3>Chat On WhatsApp</h3>
                <p>+92 312 7538519</p>
              </a>
              <a href="tel:+923127538519" className="why-card" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="ic">&#128222;</div>
                <h3>Call Us</h3>
                <p>+92 312 7538519</p>
              </a>
              <a
                href="https://maps.google.com/maps/search/CV62%2BQQX%2C%20Kingra%20Mor%2C%20Pakistan/@32.4119,74.852,17z?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="why-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="ic">&#128205;</div>
                <h3>Visit Our Shop</h3>
                <p>Kingra Mor, Pakistan</p>
              </a>
            </div>
          </div>
        </section>
      </ScrollFadeUp>

      <ScrollFadeUp>
        <SocialSection />
      </ScrollFadeUp>

      <ScrollFadeUp>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="cta-band">
            <h2>Ready To Walk Out To Bat?</h2>
            <p>Message us on WhatsApp for custom bat weight, grip and willow grade requests.</p>
            <Link href={getGeneralWhatsappLink()} target="_blank" className="btn-primary" style={{ padding: "14px 30px" }}>Chat On WhatsApp</Link>
          </div>
        </section>
      </ScrollFadeUp>

      <FooterFull />
      <WhatsappFloat />
    </>
  );
}