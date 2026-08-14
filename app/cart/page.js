"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FooterSimple, WhatsappFloat } from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { getCartWhatsappLink } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, removeItem, updateQty, applyCoupon, coupon, subtotal, discount, total, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");

  const handleApply = () => {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    setCouponMsg(ok ? `Coupon applied — ${couponInput.trim().toUpperCase()}` : "Invalid coupon code");
  };

  const handleCheckout = () => {
    const link = getCartOrderWhatsappLink(items, { discount, total, couponCode: coupon?.code });
    window.open(link, "_blank", "noopener,noreferrer");
    clearCart();
  };

  return (
    <>
      <Navbar active="" />

      <div className="page-hero" style={{ paddingBottom: 14 }}>
        <div className="wrap">
          <div className="crumb"><Link href="/">Home</Link> / <span>Your Cart</span></div>
          <h1>Your Cart</h1>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link href="/bats" className="btn-primary">Shop Bats</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((i) => (
                <div key={i.key} className="cart-item">
                  <div className="cart-item-thumb" style={{ background: `linear-gradient(160deg, ${i.grad[0]}, ${i.grad[1]})` }}>
                    <svg viewBox="0 0 60 140">
                      <rect x="24" y="4" width="10" height="55" rx="5" fill="#7a4a22" />
                      <path d="M18 60 Q18 110 30 136 Q42 110 42 60 Z" fill="#e8c48a" />
                    </svg>
                  </div>
                  <div className="cart-item-info">
                    <h4>{i.name}</h4>
                    {i.weight && <div className="willow-tag">Weight: {i.weight}</div>}
                    <div className="cart-item-row">
                      <div className="pd-qty">
                        <button onClick={() => updateQty(i.key, i.qty - 1)}>&minus;</button>
                        <span>{i.qty}</span>
                        <button onClick={() => updateQty(i.key, i.qty + 1)}>+</button>
                      </div>
                      <span className="price">Rs {(i.price * i.qty).toLocaleString()}</span>
                      <button className="cart-remove" onClick={() => removeItem(i.key)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="coupon-row">
                <input
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                />
                <button onClick={handleApply}>Apply</button>
              </div>
              {couponMsg && <p className="coupon-msg">{couponMsg}</p>}

              <div className="summary-row"><span>Subtotal</span><b>Rs {subtotal.toLocaleString()}</b></div>
              {discount > 0 && (
                <div className="summary-row discount"><span>Discount</span><b>&minus;Rs {discount.toLocaleString()}</b></div>
              )}
              <div className="summary-row total"><span>Total</span><b>Rs {total.toLocaleString()}</b></div>

              <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                &#128172; Place Order via WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>

      <FooterSimple />
      <WhatsappFloat />
    </>
  );
}