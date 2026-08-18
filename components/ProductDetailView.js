"use client";

import { useEffect, useState } from "react";
import { getOrderWhatsappLink, getInquiryWhatsappLink } from "@/lib/whatsapp";
import { useCart } from "@/components/CartContext";
import { subscribeProducts } from "@/lib/firestoreProducts";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailView({ product }) {
  if (!product) return null;

  const { name, willow, price = 0, old, description, specs, grad, thumbnail, images, category, id } = product;

  const bgGrad = Array.isArray(grad) && grad.length >= 2 ? grad : ["#1a1a1a", "#2a2a2a"];
  const gallery = Array.isArray(images) && images.length > 0 ? images : thumbnail ? [thumbnail] : [];

  const [activeImage, setActiveImage] = useState(0);

  const productVariants = Array.isArray(product.variants) ? product.variants : [];
  const [selectedVariants, setSelectedVariants] = useState(() => {
    const initial = {};
    productVariants.forEach((v) => {
      if (v.options && v.options.length) initial[v.name] = v.options[0];
    });
    return initial;
  });

  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const safePrice = Math.max(0, price || 0);

  const [related, setRelated] = useState([]);
  useEffect(() => {
    const unsub = subscribeProducts((all) => {
      const filtered = all.filter((p) => p.category === category && p.id !== id).slice(0, 4);
      setRelated(filtered);
    });
    return () => unsub();
  }, [category, id]);

  const renderImage = (src, alt) =>
    src ? (
      <img
        src={src}
        alt={alt || "Product Image"}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      <svg viewBox="0 0 60 140" style={{ width: "60px", height: "140px" }}>
        <rect x="24" y="4" width="10" height="55" rx="5" fill="#7a4a22" />
        <path d="M18 60 Q18 110 30 136 Q42 110 42 60 Z" fill="#e8c48a" />
      </svg>
    );

  return (
    <div className="pd-stack">

      <div className="pd-top-title">
        {willow && <div className="cat-name">{willow}</div>}
        <h1 className="pd-title">{name}</h1>
        <div className="pd-price-row">
          <span className="pd-price">Rs {safePrice.toLocaleString()}</span>
          {old && <span className="pd-old-price">Rs {old.toLocaleString()}</span>}
        </div>
      </div>

      <div className="pd-gallery">
        <div
          className="pd-main-image"
          style={{ background: `linear-gradient(160deg, ${bgGrad[0]}, ${bgGrad[1]})` }}
        >
          {renderImage(gallery[activeImage], name)}
        </div>
        {gallery.length > 1 && (
          <div className="pd-thumbs">
            {gallery.map((img, i) => (
              <div
                key={i}
                className="pd-thumb"
                onClick={() => setActiveImage(i)}
                style={{
                  background: `linear-gradient(160deg, ${bgGrad[0]}, ${bgGrad[1]})`,
                  cursor: "pointer",
                  outline: activeImage === i ? "2px solid var(--gold)" : "2px solid transparent",
                  outlineOffset: "-2px",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {renderImage(img, name)}
              </div>
            ))}
          </div>
        )}
      </div>

      {productVariants.map((v) => (
        <div className="pd-variant-block" key={v.name}>
          <h4>{v.name}</h4>
          <div className="pd-variant-row">
            {v.options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`pd-variant-opt ${selectedVariants[v.name] === opt ? "active" : ""}`}
                onClick={() => setSelectedVariants((s) => ({ ...s, [v.name]: opt }))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {specs && (specs.handle !== "-" || specs.edge !== "-") && (
        <div className="pd-specs">
          {specs.handle && specs.handle !== "-" && (
            <div><span>Handle</span><b>{specs.handle}</b></div>
          )}
          {specs.edge && specs.edge !== "-" && (
            <div><span>Edge</span><b>{specs.edge}</b></div>
          )}
          {specs.playerType && (
            <div><span>Player Type</span><b>{specs.playerType}</b></div>
          )}
        </div>
      )}

      <div className="pd-action-row">
        <div className="pd-qty">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>&minus;</button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(qty + 1)}>+</button>
        </div>
        <button
          type="button"
          className="btn-primary pd-add-btn"
          onClick={() => addItem(product, qty, selectedVariants)}
        >
          Add to Cart
        </button>
      </div>

      <a
        href={getOrderWhatsappLink(product, { variants: selectedVariants, qty })}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline pd-order-direct"
      >
        &#128172; Order This Directly via WhatsApp
      </a>

      <a
        href={getInquiryWhatsappLink(product)}
        target="_blank"
        rel="noopener noreferrer"
        className="pd-whatsapp-link"
      >
        &#128172; Ask a question about this product
      </a>

      {description && (
        <div className="pd-desc-block">
          <h4>Description</h4>
          <p className="pd-desc" style={{ marginBottom: 0 }}>{description}</p>
        </div>
      )}

      {related.length > 0 && (
        <div className="pd-related">
          <h3>You Might Also Like</h3>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} category={p.category} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}