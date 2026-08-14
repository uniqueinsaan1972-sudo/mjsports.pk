"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { ADMIN_UID } from "@/lib/adminConfig";
import { CATEGORIES as BASE_CATEGORIES } from "@/lib/products";
import {
  subscribeProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/firestoreProducts";
import { subscribeCategories, addCategory, deleteCategory } from "@/lib/firestoreCategories";

const EMPTY_FORM = { title: "", price: "", discount: "", description: "", category: "Bats", thumbnail: "", featured: false };

export default function AdminPanel() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  const allCategoryNames = [...BASE_CATEGORIES.map((c) => c.label), ...customCategories];

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/admin-login");
      return;
    }
    if (user.uid !== ADMIN_UID) {
      alert("Access Denied!");
      router.push("/");
      return;
    }
    setIsAdmin(true);
  }, [user, loading, router]);

  useEffect(() => {
    if (!isAdmin) return;
    const unsubP = subscribeProducts(setProducts);
    const unsubC = subscribeCategories(setCustomCategories);
    return () => {
      unsubP();
      unsubC();
    };
  }, [isAdmin]);

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTab("products");
  }

  function openEdit(product) {
    setEditingId(product.id);
    setForm({
      title: product.name,
      price: product.price,
      discount: product.badge ? product.badge.replace(/[^0-9]/g, "") : "",
      description: product.description || "",
      category: product.category,
      thumbnail: product.thumbnail || "",
      featured: !!product.featured,
    });
    setTab("add");
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title || !form.price || !form.category) {
      alert("Fill all required fields!");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
        setToast({ show: true, message: `✅ "${form.title}" updated successfully!` });
      } else {
        await addProduct(form);
        setToast({ show: true, message: `✅ "${form.title}" added to ${form.category}!` });
      }
      setTimeout(() => {
        resetForm();
        setToast({ show: false, message: "" });
      }, 2000);
    } catch (err) {
      setToast({ show: true, message: `❌ Error: ${err.message}` });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    await deleteProduct(id);
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    const catName = newCategory.trim();
    await addCategory(catName);
    setToast({ show: true, message: `✅ "${catName}" category added!` });
    setNewCategory("");
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  }

  async function handleDeleteCategory(cat) {
    if (!confirm(`Delete "${cat}" category?`)) return;
    await deleteCategory(cat);
  }

  if (loading || !isAdmin) {
    return (
      <div className="mj auth-wrap" style={{ minHeight: "100vh" }}>
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mj" style={{ minHeight: "100vh" }}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
          color: "white",
          padding: "16px 24px",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          zIndex: 1000,
          fontSize: 14,
          fontWeight: 600,
          animation: "slideDown 0.4s ease-out",
          backdropFilter: "blur(10px)",
        }}>
          {toast.message}
        </div>
      )}
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>

      {/* Admin header */}
      <div className="admin-header">
        <div className="admin-header-brand">
          <div className="mark">MJ</div>
          <div>
            <p className="admin-header-title">Admin Panel</p>
            <p className="admin-header-sub">MJ Sports</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/" className="btn-outline" style={{ padding: "9px 16px", fontSize: 13 }}>View Site</Link>
          <button
            className="btn-outline"
            style={{ padding: "9px 16px", fontSize: 13 }}
            onClick={async () => { await logout(); router.push("/admin-login"); }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>
          Products ({products.length})
        </button>
        <button className={tab === "add" ? "active" : ""} onClick={() => setTab("add")}>
          {editingId ? "Edit Product" : "Add Product"}
        </button>
        <button className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>
          Categories
        </button>
      </div>

      <div className="wrap" style={{ maxWidth: 760, paddingTop: 30, paddingBottom: 60 }}>
        {/* ===== PRODUCTS TAB ===== */}
        {tab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22 }}>All Products</h2>
              <button className="btn-primary" style={{ padding: "10px 18px", fontSize: 13 }} onClick={() => { resetForm(); setTab("add"); }}>
                + Add New
              </button>
            </div>

            {products.length === 0 ? (
              <div className="admin-empty">No products yet. Add your first product!</div>
            ) : (
              <div className="admin-list">
                {products.map((p) => (
                  <div key={p.id} className="admin-list-item">
                    <div className="admin-list-thumb">
                      {p.thumbnail ? <img src={p.thumbnail} alt={p.name} /> : <span>&#127955;</span>}
                    </div>
                    <div className="admin-list-info">
                      <p className="admin-list-name">{p.name}{p.featured && <span className="admin-featured-tag">Featured</span>}</p>
                      <p className="admin-list-price">Rs {Number(p.price).toLocaleString()}</p>
                      <p className="admin-list-cat">{p.category}</p>
                    </div>
                    <div className="admin-list-actions">
                      <button onClick={() => openEdit(p)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== ADD/EDIT TAB ===== */}
        {tab === "add" && (
          <div className="admin-form">
            <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSave}>
              <label>
                Product Name *
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. MJ Special Edition Bat" />
              </label>
              <div className="admin-form-grid">
                <label>
                  Price (Rs) *
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="15000" />
                </label>
                <label>
                  Discount (%)
                  <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="0" />
                </label>
              </div>
              <label>
                Category (Folder) *
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {allCategoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label>
                Description
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
              </label>
              <label>
                Thumbnail Image URL
                <input type="url" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." />
              </label>
              {form.thumbnail && <img src={form.thumbnail} alt="preview" className="admin-thumb-preview" />}
              <label className="filter-opt" style={{ marginBottom: 20 }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured Product (show on homepage)
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                </button>
                <button type="button" className="btn-outline" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* ===== CATEGORIES TAB ===== */}
        {tab === "categories" && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Categories</h2>
            <div className="admin-form" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="New category name..."
                  style={{ flex: 1, background: "var(--panel-2)", border: "1px solid var(--line)", color: "var(--off)", padding: "11px 13px", borderRadius: 8, fontSize: 13.5 }}
                />
                <button className="btn-primary" style={{ padding: "0 20px" }} onClick={handleAddCategory}>Add</button>
              </div>
            </div>

            <div className="admin-note" style={{ marginBottom: 20 }}>
              &#9888;&#65039; Base categories (Bats, Caps, Kit Bags, Gloves, Balls) already have their own shop pages
              and can&apos;t be deleted here. Categories you add show up as a folder option when adding products.
            </div>

            <div className="admin-list">
              {BASE_CATEGORIES.map((c) => (
                <div key={c.slug} className="admin-list-item">
                  <div className="admin-list-info">
                    <p className="admin-list-name">{c.label} <span className="admin-featured-tag" style={{ background: "var(--panel-2)", color: "var(--muted)" }}>Base</span></p>
                    <p className="admin-list-cat">{products.filter((p) => p.category === c.label).length} admin products</p>
                  </div>
                </div>
              ))}
              {customCategories.map((cat) => (
                <div key={cat} className="admin-list-item">
                  <div className="admin-list-info">
                    <p className="admin-list-name">{cat}</p>
                    <p className="admin-list-cat">{products.filter((p) => p.category === cat).length} products</p>
                  </div>
                  <div className="admin-list-actions">
                    <button className="danger" onClick={() => handleDeleteCategory(cat)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}