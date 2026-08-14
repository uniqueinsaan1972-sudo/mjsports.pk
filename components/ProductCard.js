"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";

export default function ProductCard({ product, category = "Bats" }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { name, willow, price, old, badge, grad, slug } = product;

  const goToProduct = () => {
    if (slug) router.push(`/bats/${slug}`);
  };

  return (
    <div className="product-card" onClick={goToProduct} style={{ cursor: slug ? "pointer" : "default" }}>
      <div className="product-thumb" style={{ background: `linear-gradient(160deg, ${grad[0]}, ${grad[1]})` }}>
        {badge && <span className={`badge ${badge === "New" ? "gold" : ""}`}>{badge}</span>}
        <span className="wishlist">&#9825;</span>
        <svg viewBox="0 0 60 140">
          <rect x="24" y="4" width="10" height="55" rx="5" fill="#7a4a22" />
          <path d="M18 60 Q18 110 30 136 Q42 110 42 60 Z" fill="#e8c48a" />
        </svg>
      </div>
      <div className="product-info">
        <div className="cat-name">{category}</div>
        <h4>{name}</h4>
        {willow && <div className="willow-tag">{willow}</div>}
        <div className="price-row">
          <div className="price">
            {old && <small>Rs {old.toLocaleString()}</small>}
            Rs {price.toLocaleString()}
          </div>
          <button
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation();
              addItem(product, 1);
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}