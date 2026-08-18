"use client";

import { useState } from "react";
import { addCoupon, deleteCoupon, subscribeCoupons } from "@/lib/firestoreCoupons";
import { useEffect } from "react";

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [limitType, setLimitType] = useState("unlimited");
  const [limitValue, setLimitValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = subscribeCoupons(setCoupons);
    return () => unsub();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");

    if (!code.trim()) return setError("Coupon code likhen.");
    if (!discountValue || Number(discountValue) <= 0)
      return setError("Discount value sahi likhen.");
    if (limitType === "limited" && (!limitValue || Number(limitValue) <= 0))
      return setError("Usage limit sahi likhen.");

    setLoading(true);
    try {
      await addCoupon({ code, discountType, discountValue, limitType, limitValue });
      setCode("");
      setDiscountValue("");
      setLimitValue("");
      setLimitType("unlimited");
      setDiscountType("percent");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Coupon add nahi hua, dobara try karen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm(`Coupon "${id}" delete karein?`)) return;
    try {
      await deleteCoupon(id);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting coupon");
    }
  }

  return (
    <div style={{ maxWidth: "760px" }}>
      <h2 style={{ fontSize: 22, marginBottom: 20, color: "var(--off)" }}>
        Coupons
      </h2>

      {/* ADD COUPON FORM */}
      <form
        onSubmit={handleAdd}
        style={{
          background: "var(--panel-2)",
          padding: 16,
          borderRadius: 8,
          marginBottom: 20,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {/* Coupon Code - Full Width */}
        <input
          type="text"
          placeholder="Coupon code e.g. MJ20"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            gridColumn: "1 / -1",
            background: "var(--panel-1)",
            border: "1px solid var(--line)",
            color: "var(--off)",
            padding: "11px 13px",
            borderRadius: 8,
            fontSize: 13.5,
            fontFamily: "inherit",
          }}
        />

        {/* Discount Type */}
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
          style={{
            background: "var(--panel-1)",
            border: "1px solid var(--line)",
            color: "var(--off)",
            padding: "11px 13px",
            borderRadius: 8,
            fontSize: 13.5,
            fontFamily: "inherit",
          }}
        >
          <option value="percent">Percent (%)</option>
          <option value="fixed">Fixed (Rs)</option>
        </select>

        {/* Discount Value */}
        <input
          type="number"
          placeholder="Discount value"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          style={{
            background: "var(--panel-1)",
            border: "1px solid var(--line)",
            color: "var(--off)",
            padding: "11px 13px",
            borderRadius: 8,
            fontSize: 13.5,
            fontFamily: "inherit",
          }}
        />

        {/* Limit Type */}
        <select
          value={limitType}
          onChange={(e) => setLimitType(e.target.value)}
          style={{
            gridColumn: "1 / -1",
            background: "var(--panel-1)",
            border: "1px solid var(--line)",
            color: "var(--off)",
            padding: "11px 13px",
            borderRadius: 8,
            fontSize: 13.5,
            fontFamily: "inherit",
          }}
        >
          <option value="unlimited">Unlimited use</option>
          <option value="limited">Limited use</option>
        </select>

        {/* Limit Value - Conditional */}
        {limitType === "limited" && (
          <input
            type="number"
            placeholder="Max uses e.g. 100"
            value={limitValue}
            onChange={(e) => setLimitValue(e.target.value)}
            style={{
              gridColumn: "1 / -1",
              background: "var(--panel-1)",
              border: "1px solid var(--line)",
              color: "var(--off)",
              padding: "11px 13px",
              borderRadius: 8,
              fontSize: 13.5,
              fontFamily: "inherit",
            }}
          />
        )}

        {/* Error Message */}
        {error && (
          <p
            style={{
              gridColumn: "1 / -1",
              color: "#ff6b6b",
              fontSize: 13,
              margin: "8px 0 0 0",
            }}
          >
            {error}
          </p>
        )}

        {/* Add Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            gridColumn: "1 / -1",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            padding: "11px 13px",
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            fontFamily: "inherit",
          }}
        >
          {loading ? "Adding..." : "Add Coupon"}
        </button>
      </form>

      {/* COUPONS LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {coupons.length === 0 ? (
          <p
            style={{
              color: "var(--muted)",
              fontSize: 13,
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            Abhi koi coupon nahi hai.
          </p>
        ) : (
          coupons.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--panel-2)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                padding: "16px 13px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 6px 0",
                    color: "var(--off)",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {c.id}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "var(--muted)",
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {c.discountType === "percent"
                    ? `${c.discountValue}% off`
                    : `Rs ${c.discountValue} off`}
                  {" · "}
                  {c.limit
                    ? `${c.usedCount}/${c.limit} used`
                    : "unlimited use"}
                  {" · "}
                  <span
                    style={{
                      color: c.active ? "#4ade80" : "#ff6b6b",
                      fontWeight: 500,
                    }}
                  >
                    {c.active ? "active" : "inactive"}
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ff6b6b",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "6px 12px",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
