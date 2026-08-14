"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import BrandMark from "@/components/BrandMark";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mj auth-wrap" style={{ minHeight: "100vh" }}>
      <div className="auth-card">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <BrandMark />
        </div>
        <h1 style={{ textAlign: "center" }}>Admin Panel</h1>
        <p className="auth-sub" style={{ textAlign: "center" }}>Restricted access &mdash; MJ Sports team only.</p>
        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@mjsports.pk" />
          </label>
          <label>
            Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          </label>
          {error && <p style={{ color: "#e57373", fontSize: 13, marginBottom: 16 }}>{error}</p>}
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}