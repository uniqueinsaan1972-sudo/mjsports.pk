"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FooterFull, WhatsappFloat } from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { getCheckoutWhatsappLink, getInquiryWhatsappLink } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, removeItem, updateQty, applyCoupon, coupon, subtotal, discount, deliveryFee, deliveryMethod, setDeliveryMethod, total } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  function handleApplyCoupon() {
    if (!couponCode.trim()) {
      setCouponError("Enter a coupon code");
      return;
    }
    if (applyCoupon(couponCode)) {
      setCouponError("");
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code");
    }
  }

  return (
    <>
      <Navbar active="Cart" />

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 30 }}>
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>Home</Link>
          <span style={{ color: "var(--muted)" }}>/</span>
          <span>Your Cart</span>
        </div>

        <h1 style={{ fontSize: 32, marginBottom: 30 }}>Your Cart</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60, paddingBottom: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🛒</div>
            <h2 style={{ fontSize: 20, marginBottom: 10 }}>Your cart is empty</h2>
            <p style={{ color: "var(--muted)", marginBottom: 30 }}>
              Start shopping to add items to your cart.
            </p>
            <Link href="/bats" className="btn-primary" style={{ display: "inline-block", padding: "12px 28px" }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 30, marginBottom: 40 }}>
            {/* Cart Items */}
            <div>
              {items.map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 100px",
                    gap: 20,
                    alignItems: "center",
                    padding: 20,
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      overflow: "hidden",
                      background: "var(--panel-2)",
                    }}
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        📦
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: 6 }}>{item.name}</p>
                    {Object.keys(item.variants).length > 0 && (
                      <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
                        {Object.entries(item.variants)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" • ")}
                      </p>
                    )}
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>
                      Rs {item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Qty + Remove */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginBottom: 10 }}>
                      <button
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        style={{
                          width: 28,
                          height: 28,
                          border: "1px solid var(--line)",
                          borderRadius: 4,
                          background: "var(--panel-2)",
                          color: "var(--off)",
                          cursor: "pointer",
                          fontSize: 14,
                        }}
                      >
                        −
                      </button>
                      <span style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        style={{
                          width: 28,
                          height: 28,
                          border: "1px solid var(--line)",
                          borderRadius: 4,
                          background: "var(--panel-2)",
                          color: "var(--off)",
                          cursor: "pointer",
                          fontSize: 14,
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e57373",
                        cursor: "pointer",
                        fontSize: 12,
                        textDecoration: "underline",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              style={{
                background: "var(--panel-2)",
                padding: 20,
                borderRadius: 12,
                height: "fit-content",
              }}
            >
              <h3 style={{ fontSize: 16, marginBottom: 20, fontWeight: 600 }}>Order Summary</h3>

              {/* Coupon Section */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError("");
                    }}
                    placeholder="Coupon code"
                    style={{
                      flex: 1,
                      background: "var(--panel-1)",
                      border: "1px solid var(--line)",
                      color: "var(--off)",
                      padding: "8px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p style={{ fontSize: 11, color: "#e57373" }}>{couponError}</p>}
                {coupon && <p style={{ fontSize: 11, color: "var(--accent)" }}>✓ {coupon.code} applied</p>}
              </div>

              {/* ✅ FIXED: Delivery Method - Professional Options */}
              <div style={{ marginBottom: 20, padding: 12, background: "var(--panel-1)", borderRadius: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Delivery Method</p>
                <label style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                  />
                  <span style={{ fontSize: 13 }}>🏪 Come to Our Shop (Free)</span>
                </label>
                <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "home"}
                    onChange={() => setDeliveryMethod("home")}
                  />
                  <span style={{ fontSize: 13 }}>🚚 Home Delivery (+Rs 700)</span>
                </label>
              </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "var(--accent)" }}>
                    <span>Discount ({coupon.code})</span>
                    <span>−Rs {discount.toLocaleString()}</span>
                  </div>
                )}
                {deliveryFee > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 13, color: "var(--accent)" }}>
                    <span>Delivery Fee</span>
                    <span>+Rs {deliveryFee.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
                <span>Total</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>

              {/* ✅ FIXED: Conditional message based on delivery method */}
              {deliveryMethod === "pickup" ? (
                <a
                  href={getCheckoutWhatsappLink(items, {
                    subtotal,
                    discount,
                    deliveryFee,
                    deliveryMethod,
                    total,
                    coupon,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px",
                    background: "var(--accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    textAlign: "center",
                    textDecoration: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  ✓ Confirm Pickup Order
                </a>
              ) : (
                <a
                  href={getCheckoutWhatsappLink(items, {
                    subtotal,
                    discount,
                    deliveryFee,
                    deliveryMethod,
                    total,
                    coupon,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px",
                    background: "var(--accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    textAlign: "center",
                    textDecoration: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  🚚 Confirm Home Delivery Order
                </a>
              )}

              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12, textAlign: "center" }}>
                Safe & Secure Checkout
              </p>
            </div>
          </div>
        )}
      </div>

      <FooterFull />
      <WhatsappFloat />
    </>
  );
}