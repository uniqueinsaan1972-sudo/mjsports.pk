"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import Link from "next/link";

const CartContext = createContext(null);

// Simple coupon table
const COUPONS = {
  MJ10: 0.10,
  WELCOME5: 0.05,
};

// ✅ FIXED: Delivery fee constant
const DELIVERY_FEE = 700; // Rs 700

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // "pickup" | "home"
  const timerRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast({ message, id: Date.now() });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 5000);
  }, []);

  const addItem = useCallback((product, qty = 1, variants = {}) => {
    setItems((prev) => {
      const variantKey = Object.entries(variants || {})
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([k, v]) => `${k}:${v}`)
        .join("|");
      const key = `${product.slug}-${variantKey || "default"}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          slug: product.slug,
          name: product.name,
          price: product.price,
          variants: variants || {},
          qty,
          grad: product.grad,
          thumbnail: product.thumbnail,
        },
      ];
    });
    showToast(`${product.name} added to cart`);
  }, [showToast]);

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const updateQty = (key, qty) => setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));
  const clearCart = () => { 
    setItems([]); 
    setCoupon(null); 
    setDeliveryMethod("pickup");
  };

  const applyCoupon = (code) => {
    const upper = code.trim().toUpperCase();
    if (COUPONS[upper]) {
      setCoupon({ code: upper, rate: COUPONS[upper] });
      return true;
    }
    setCoupon(null);
    return false;
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = coupon ? Math.round(subtotal * coupon.rate) : 0;
  
  // ✅ FIXED: Conditional delivery fee (free for pickup, 700 for home delivery)
  const deliveryFee = deliveryMethod === "home" ? DELIVERY_FEE : 0;
  const total = subtotal - discount + deliveryFee;
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQty, 
        clearCart, 
        applyCoupon, 
        coupon, 
        subtotal, 
        discount, 
        deliveryFee,
        deliveryMethod,
        setDeliveryMethod,
        total, 
        count 
      }}
    >
      {children}
      <div className={`mj-toast ${toast ? "show" : ""}`}>
        {toast && (
          <>
            <span>&#9989; {toast.message}</span>
            <Link href="/cart" onClick={() => setToast(null)}>View Cart</Link>
          </>
        )}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}