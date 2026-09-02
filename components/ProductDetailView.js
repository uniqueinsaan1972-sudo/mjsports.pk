"use client";

import { useState } from "react";
import { getOrderWhatsappLink, getInquiryWhatsappLink } from "@/lib/whatsapp";
import { useCart } from "@/components/CartContext";

export default function ProductDetailView({ product }) {
  if (!product) return null;

  const { name, willow, price = 0, old, description, specs, grad, images, thumbnail } = product;

  // ✅ FIXED: Safe fallback for grad array
  const bgGrad = Array.isArray(grad) && grad.length >= 2 ? grad : ["#1a1a1a", "#2a2a2a"];

  // ✅ FIXED: Use images array if available, fallback to thumbnail
  const allImages = images && images.length > 0 ? images : thumbnail ? [thumbnail] : [];
  const [mainImage, setMainImage] = useState(allImages[0] || null);
  
  // ✅ FIXED: Variants from new structure
  const [selectedVariants, setSelectedVariants] = useState({});
  
  const weights = specs?.weights?.length ? specs.weights : null;
  const [weight, setWeight] = useState(weights ? weights[0] : null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const image = (src, className) =>
    src ? (
      <img
        src={src}
        alt={name || "Product Image"}
        className={className}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      <svg viewBox="0 0 60 140" style={{ width: "60px", height: "140px" }}>
        <rect x="24" y="4" width="10" height="55" rx="5" fill="#7a4a22" />
        <path d="M18 60 Q18 110 30 136 Q42 110 42 60 Z" fill="#e8c48a" />
      </svg>
    );

  // ✅ FIXED: Handle variant selection
  function selectVariant(variantName, option) {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: option }));
  }

  // Combine selected variants for cart
  const allSelectedVariants = weight ? { Weight: weight, ...selectedVariants } : selectedVariants;

  return (
    <div className="pd-layout">
      {/* Gallery Section */}
      <div className="pd-gallery">
        <div
          className="pd-main-image"
          style={{ background: `linear-gradient(160deg, ${bgGrad[0]}, ${bgGrad[1]})` }}
        >
          {image(mainImage)}
        </div>
        
        {/* ✅ FIXED: Show all images as thumbnails, not hardcoded 3x repeat */}
        {allImages.length > 0 && (
          <div className="pd-thumbs">
            {allImages.map((img, i) => (
              <div
                key={i}
                className={`pd-thumb ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
                style={{ 
                  background: `linear-gradient(160deg, ${bgGrad[0]}, ${bgGrad[1]})`,
                  cursor: "pointer",
                  opacity: mainImage === img ? 1 : 0.6,
                  transition: "opacity 0.2s ease"
                }}
              >
                {image(img)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="pd-info">
        {willow && <div className="cat-name">{willow}</div>}
        <h1 className="pd-title">{name}</h1>

        <div className="pd-price-row">
          <span className="pd-price">Rs {price?.toLocaleString()}</span>
          {old && <span className="pd-old-price">Rs {old?.toLocaleString()}</span>}
        </div>

        {description && <p className="pd-desc">{description}</p>}

        {/* ✅ FIXED: Old Weight variant */}
        {weights && (
          <div className="pd-variant-block">
            <h4>Weight</h4>
            <div className="pd-variant-row">
              {weights.map((w) => (
                <button
                  key={w}
                  className={`pd-variant-opt ${weight === w ? "active" : ""}`}
                  onClick={() => setWeight(w)}
                  type="button"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ✅ FIXED: New Variants from product.variants */}
        {product.variants && product.variants.length > 0 && (
          <div>
            {product.variants.map((variantType, idx) => (
              <div key={idx} className="pd-variant-block">
                <h4>{variantType.name}</h4>
                <div className="pd-variant-row">
                  {variantType.options.map((option) => (
                    <button
                      key={option}
                      className={`pd-variant-opt ${selectedVariants[variantType.name] === option ? "active" : ""}`}
                      onClick={() => selectVariant(variantType.name, option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Specifications */}
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

        {/* Action Buttons */}
        <div className="pd-action-row">
          <div className="pd-qty">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>&minus;</button>
            <span>{qty}</span>
            <button type="button" onClick={() => setQty(qty + 1)}>+</button>
          </div>
          <button
            type="button"
            className="btn-primary pd-add-btn"
            onClick={() => addItem(product, qty, allSelectedVariants)}
          >
            Add to Cart
          </button>
        </div>

        {/* WhatsApp Direct Links */}
        <a
          href={getOrderWhatsappLink(product, { ...allSelectedVariants, qty })}
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
      </div>
    </div>
  );
}