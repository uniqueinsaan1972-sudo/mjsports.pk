"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { MinusIcon, PlusIcon, WhatsappIcon, ArrowIcon } from "@/components/Icons";
import { getCheckoutWhatsappLink } from "@/lib/whatsapp";
import { DELIVERY_FEE } from "@/lib/siteConfig";
import { img } from "@/lib/images";
import { productPath } from "@/lib/categories";

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, applyCoupon, coupon, subtotal, discount, deliveryFee, deliveryMethod, setDeliveryMethod, total } = useCart();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [checking, setChecking] = useState(false);

  async function onApply(e) {
    e.preventDefault();
    setChecking(true);
    const res = await applyCoupon(code);
    setCouponError(res.ok ? "" : res.error);
    setChecking(false);
  }

  return (
    <div className="container">
      <div className="page-head"><h1>Your cart</h1></div>
      {items.length === 0 ? (
        <div className="empty" style={{ marginBottom: 80 }}>
          <h2>Your cart is empty</h2>
          <p>Add a bat, cap or kit bag and it will appear here.</p>
          <Link href="/shop" className="btn btn-primary">Shop products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section aria-label="Cart items">
            {items.map((i) => (
              <div className="cart-item" key={i.key}>
                {i.thumbnail ? <img src={img(i.thumbnail, 200)} alt={i.name} width="88" height="88" /> : <div style={{ width: 88, height: 88 }} />}
                <div>
                  <h3>{i.category ? <Link href={productPath(i)}>{i.name}</Link> : i.name}</h3>
                  {Object.keys(i.variants || {}).length > 0 && <p className="variants">{Object.entries(i.variants).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>}
                  <div className="qty" style={{ marginTop: 6 }}>
                    <button type="button" aria-label={`Decrease quantity of ${i.name}`} onClick={() => updateQty(i.key, i.qty - 1)}><MinusIcon size={16} /></button>
                    <span>{i.qty}</span>
                    <button type="button" aria-label={`Increase quantity of ${i.name}`} onClick={() => updateQty(i.key, i.qty + 1)}><PlusIcon size={16} /></button>
                  </div>
                  <button type="button" className="linklike" onClick={() => removeItem(i.key)}>Remove</button>
                </div>
                <strong>Rs {(i.price * i.qty).toLocaleString()}</strong>
              </div>
            ))}
            <button type="button" className="linklike" style={{ marginTop: 12 }} onClick={clearCart}>Clear cart</button>
          </section>

          <aside className="summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <form onSubmit={onApply} className="field">
              <label htmlFor="coupon">Coupon code</label>
              <div className="inline-form">
                <input id="coupon" className="input" value={code} maxLength={40} onChange={(e) => { setCode(e.target.value); setCouponError(""); }} autoComplete="off" />
                <button className="btn btn-secondary" disabled={checking || !code.trim()}>{checking ? "..." : "Apply"}</button>
              </div>
              {couponError && <span className="error-text" role="alert">{couponError}</span>}
              {coupon && <span className="ok-text">{coupon.code} applied</span>}
            </form>

            <fieldset className="opt" style={{ margin: "0 0 16px" }}>
              <legend>Delivery method</legend>
              <label className="radio-card"><input type="radio" name="delivery" checked={deliveryMethod === "pickup"} onChange={() => setDeliveryMethod("pickup")} /><span><strong>Pick up from our shop</strong><br /><span className="note">Free</span></span></label>
              <label className="radio-card"><input type="radio" name="delivery" checked={deliveryMethod === "home"} onChange={() => setDeliveryMethod("home")} /><span><strong>Home delivery</strong><br /><span className="note">+ Rs {DELIVERY_FEE.toLocaleString()}</span></span></label>
            </fieldset>

            <div className="sum-row"><span>Subtotal</span><span>Rs {subtotal.toLocaleString()}</span></div>
            {discount > 0 && <div className="sum-row"><span>Discount ({coupon.code})</span><span>-Rs {discount.toLocaleString()}</span></div>}
            {deliveryFee > 0 && <div className="sum-row"><span>Delivery</span><span>+Rs {deliveryFee.toLocaleString()}</span></div>}
            <div className="sum-row sum-total"><span>Total</span><span>Rs {total.toLocaleString()}</span></div>

            <a className="btn btn-primary btn-block" style={{ marginTop: 16 }} target="_blank" rel="noopener noreferrer"
              href={getCheckoutWhatsappLink(items, { subtotal, discount, deliveryFee, deliveryMethod, total, coupon })}>
              <WhatsappIcon size={18} /> {deliveryMethod === "pickup" ? "Confirm pickup order" : "Confirm home delivery order"}
            </a>
            <p className="note" style={{ marginTop: 12 }}>Your order is confirmed on WhatsApp. We take advance payment, then send a video of your exact article before packing. We do not offer cash on delivery.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
