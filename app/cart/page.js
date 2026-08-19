"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FooterSimple, WhatsappFloat } from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { getCartWhatsappLink } from "@/lib/whatsapp";
import { incrementCouponUsage } from "@/lib/firestoreCoupons";

export default function CartPage() {
  const { items, removeItem, updateQty, applyCoupon, coupon, subtotal, discount, total, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    if (!couponInput.trim()) return;
    setApplying(true);

    const result = await applyCoupon(couponInput);

    if (result === "ok") {
      setCouponMsg(`Coupon applied — ${couponInput.trim().toUpperCase()}`);
    } else if (result === "limit") {
      setCouponMsg("This coupon has reached its usage limit");
    } else if (result === "error") {
      setCouponMsg("Something went wrong, try again");
    } else {
      setCouponMsg("Invalid coupon code");
    }

    setApplying(false);
  };

  const handleCheckout = async () => {
    const link = getCartWhatsappLink(items, { subtotal, discount, total, coupon });
    window.open(link, "_blank", "noopener,noreferrer");

    if (coupon) {
      try {
        await incrementCouponUsage(coupon.code);
      } catch (err) {
        console.error("Failed to increment coupon usage:", err);
      }
    }

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
                  <div
                    className="cart-item-thumb"
                    style={
                      i.thumbnail
                        ? { backgroundImage: `url(${i.thumbnail})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : { background: `linear-gradient(160deg, ${i.grad[0]}, ${i.grad[1]})` }
                    }
                  >
                    {!i.thumbnail && (
                      <svg viewBox="0 0 60 140">
                        <rect x="24" y="4" width="10" height="55" rx="5" fill="#7a4a22" />
                        <path d="M18 60 Q18 110 30 136 Q42 110 42 60 Z" fill="#e8c48a" />
                      </svg>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h4>{i.name}</h4>

                    {i.variants && Object.keys(i.variants).length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "6px 0" }}>
                        {Object.entries(i.variants).map(([k, v]) => (
                          <span
                            key={k}
                            style={{
                              background: "rgba(217,164,65,0.15)",
                              color: "var(--gold-soft)",
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "3px 9px",
                              borderRadius: 20,
                              border: "1px solid rgba(217,164,65,0.3)",
                            }}
                          >
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}

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
                <button onClick={handleApply} disabled={applying}>
                  {applying ? "Checking..." : "Apply"}
                </button>
              </div>
              {couponMsg && <p className="coupon-msg">{couponMsg}</p>}

              <div className="summary-row"><span>Subtotal</span><b>Rs {subtotal.toLocaleString()}</b></div>
              {discount > 0 && (
                <div className="summary-row discount"><span>Discount</span><b>&minus;Rs {discount.toLocaleString()}</b></div>
              )}
              <div className="summary-row total"><span>Total</span><b>Rs {total.toLocaleString()}</b></div>

              <div className="admin-note" style={{ marginTop: 16, marginBottom: 4 }}>
                ⚠️ Hum abhi Cash on Delivery (COD) offer nahi kar rahe — hamara COD wala koi account nahi hai jis wajah se agar hum COD par order bhejte hain to rider payment nahi dete, jis se humein loss hota hai. Is liye apna order poora karne ke liye advance payment karein. Is takleef ke liye maazrat.
              </div>

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