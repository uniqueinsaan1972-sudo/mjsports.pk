"use client";

import { useEffect, useState, useRef } from "react";
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
import { uploadProductImagesToCloudinary } from "@/lib/cloudinaryUpload";
import { subscribeCategories, addCategory, deleteCategory } from "@/lib/firestoreCategories";
import CouponManager from "@/components/CouponManager";

const EMPTY_FORM = { title: "", price: "", discount: "", description: "", category: "Bats", featured: false, variants: [] };
const MAX_IMAGES = 6;

export default function AdminPanel() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [newFiles, setNewFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [optionDraft, setOptionDraft] = useState({});

  const allCategoryNames = [...BASE_CATEGORIES.map((c) => c.label), ...customCategories];
  const totalImages = existingImages.length + newFiles.length;
  const canAddMore = totalImages < MAX_IMAGES;

  // Auth check
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

  // Subscribe to data
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
    setNewFiles([]);
    setExistingImages([]);
    setOptionDraft({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openEdit(product) {
    setEditingId(product.id);
    const originalPrice = product.old || product.price;
    const discountPct = product.badge ? product.badge.replace(/[^0-9]/g, "") : "";
    setForm({
      title: product.name,
      price: originalPrice,
      discount: discountPct,
      description: product.description || "",
      category: product.category,
      featured: !!product.featured,
      variants: product.variants || [],
    });
    setExistingImages(
      product.images && product.images.length
        ? product.images
        : product.thumbnail
        ? [product.thumbnail]
        : []
    );
    setNewFiles([]);
    setOptionDraft({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTab("add");
  }

  function handleFilePick(e) {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    const availableSlots = MAX_IMAGES - totalImages;
    if (picked.length > availableSlots) {
      alert(
        `Available slots: ${availableSlots}. Only first ${availableSlots} file(s) will be added.`
      );
    }

    setNewFiles((prev) => [
      ...prev,
      ...picked.slice(0, Math.max(0, availableSlots)),
    ]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeNewFile(idx) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeExistingImage(idx) {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function triggerAddMore() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  // ===== VARIANT BUILDER HELPERS =====
  function addVariantType() {
    setForm((f) => ({ ...f, variants: [...f.variants, { name: "", options: [] }] }));
  }
  function updateVariantName(idx, name) {
    setForm((f) => {
      const variants = [...f.variants];
      variants[idx] = { ...variants[idx], name };
      return { ...f, variants };
    });
  }
  function addVariantOption(idx, optionText) {
    if (!optionText.trim()) return;
    setForm((f) => {
      const variants = [...f.variants];
      variants[idx] = { ...variants[idx], options: [...variants[idx].options, optionText.trim()] };
      return { ...f, variants };
    });
  }
  function removeVariantOption(vIdx, oIdx) {
    setForm((f) => {
      const variants = [...f.variants];
      variants[vIdx] = { ...variants[vIdx], options: variants[vIdx].options.filter((_, i) => i !== oIdx) };
      return { ...f, variants };
    });
  }
  function removeVariantType(idx) {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));
  }

  // MAIN SAVE FUNCTION
  async function handleSave(e) {
    e.preventDefault();

    // Validation
    if (!form.title || !form.price || !form.category) {
      alert("Fill all required fields!");
      return;
    }

    setSaving(true);

    try {
      // Upload new images if any
      let uploadedUrls = [];
      if (newFiles.length > 0) {
        uploadedUrls = await uploadProductImagesToCloudinary(newFiles);
      }

      // Combine old and new images
      const finalImages = [...existingImages, ...uploadedUrls].slice(0, MAX_IMAGES);

      // Only keep variant types that have a name AND at least one option
      const cleanVariants = form.variants.filter((v) => v.name.trim() && v.options.length > 0);

      // Prepare product data
      const productData = {
        ...form,
        images: finalImages,
        variants: cleanVariants,
      };

      // Save to Firestore
      if (editingId) {
        await updateProduct(editingId, productData);
      } else {
        await addProduct(productData);
      }

      // Show success message
      const message = editingId
        ? `✅ "${form.title}" updated successfully!`
        : `✅ "${form.title}" added to catalog!`;

      setSuccessMsg(message);
      setSaving(false);

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setSuccessMsg("");
        resetForm();
        setTab("products");
      }, 3000);
    } catch (err) {
      setSaving(false);
      console.error("Product save failed:", err);
      alert(
        "Error saving product: " +
        (err.message || "Something went wrong. Check console for details.")
      );
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) {
      alert("Enter category name");
      return;
    }
    try {
      await addCategory(newCategory.trim());
      setNewCategory("");
    } catch (err) {
      alert("Error adding category: " + err.message);
    }
  }

  async function handleDeleteCategory(cat) {
    if (!confirm(`Delete "${cat}" category?`)) return;
    try {
      await deleteCategory(cat);
    } catch (err) {
      alert("Error deleting category: " + err.message);
    }
  }

  // Loading state
  if (loading || !isAdmin) {
    return (
      <div className="mj auth-wrap" style={{ minHeight: "100vh" }}>
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mj" style={{ minHeight: "100vh" }}>
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header-brand">
          <div className="mark">MJ</div>
          <div>
            <p className="admin-header-title">Admin Panel</p>
            <p className="admin-header-sub">MJ Sports</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/"
            className="btn-outline"
            style={{ padding: "9px 16px", fontSize: 13 }}
          >
            View Site
          </Link>
          <button
            className="btn-outline"
            style={{ padding: "9px 16px", fontSize: 13 }}
            onClick={async () => {
              await logout();
              router.push("/admin-login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Success Toast Notification */}
      <div className={`mj-toast ${successMsg ? "show" : ""}`}>
        {successMsg && <span>{successMsg}</span>}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          Products ({products.length})
        </button>
        <button
          className={tab === "add" ? "active" : ""}
          onClick={() => setTab("add")}
        >
          {editingId ? "Edit Product" : "Add Product"}
        </button>
                <button
          className={tab === "categories" ? "active" : ""}
          onClick={() => setTab("categories")}
        >
          Categories
        </button>
        <button
          className={tab === "coupons" ? "active" : ""}
          onClick={() => setTab("coupons")}
        >
          Coupons
        </button>
      </div>

      <div className="wrap" style={{ maxWidth: 760, paddingTop: 30, paddingBottom: 60 }}>
        {/* ===== PRODUCTS TAB ===== */}
        {tab === "products" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 22 }}>All Products</h2>
              <button
                className="btn-primary"
                style={{ padding: "10px 18px", fontSize: 13 }}
                onClick={() => {
                  resetForm();
                  setTab("add");
                }}
              >
                + Add New
              </button>
            </div>

            {products.length === 0 ? (
              <div className="admin-empty">
                No products yet. Add your first product!
              </div>
            ) : (
              <div className="admin-list">
                {products.map((p) => (
                  <div key={p.id} className="admin-list-item">
                    <div className="admin-list-thumb">
                      {p.thumbnail ? (
                        <img src={p.thumbnail} alt={p.name} />
                      ) : (
                        <span>&#127955;</span>
                      )}
                    </div>
                    <div className="admin-list-info">
                      <p className="admin-list-name">
                        {p.name}
                        {p.featured && (
                          <span className="admin-featured-tag">Featured</span>
                        )}
                      </p>
                      <p className="admin-list-price">
                        Rs {Number(p.price).toLocaleString()}
                      </p>
                      <p className="admin-list-cat">{p.category}</p>
                    </div>
                    <div className="admin-list-actions">
                      <button onClick={() => openEdit(p)}>Edit</button>
                      <button
                        className="danger"
                        onClick={() => handleDelete(p.id, p.name)}
                      >
                        Delete
                      </button>
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
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. MJ Special Edition Bat"
                />
              </label>

              <div className="admin-form-grid">
                <label>
                  Price (Rs) *
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 1000"
                  />
                </label>
                <label>
                  Discount (%)
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) =>
                      setForm({ ...form, discount: e.target.value })
                    }
                    placeholder="e.g. 40"
                  />
                </label>
              </div>

              {form.price > 0 && (
                <div className="admin-price-preview">
                  {Number(form.discount) > 0 ? (
                    <>
                      <span>Customer pays:</span>
                      <b>
                        Rs{" "}
                        {Math.round(
                          Number(form.price) *
                          (1 - Number(form.discount) / 100)
                        ).toLocaleString()}
                      </b>
                      <span className="crossed">
                        Rs {Number(form.price).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Customer pays:</span>
                      <b>Rs {Number(form.price).toLocaleString()}</b>
                    </>
                  )}
                </div>
              )}

              <label>
                Category (Folder) *
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {allCategoryNames.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Product description..."
                />
              </label>

              {/* IMAGE UPLOAD SECTION */}
              <div
                style={{
                  background: "var(--panel-2)",
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <label style={{ margin: 0, fontSize: 13.5, fontWeight: 500 }}>
                    Product Images ({totalImages}/{MAX_IMAGES})
                  </label>
                  {canAddMore && (
                    <button
                      type="button"
                      onClick={triggerAddMore}
                      style={{
                        background: "var(--accent)",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 4,
                        fontSize: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      + Add More Images
                    </button>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilePick}
                  style={{ display: "none" }}
                />

                {/* Initial uploader (when no images) */}
                {totalImages === 0 && (
                  <label
                    style={{
                      display: "block",
                      border: "2px dashed var(--line)",
                      borderRadius: 8,
                      padding: 24,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = "var(--accent)";
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--line)";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = "var(--line)";
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontWeight: 500,
                      }}
                    >
                      Click to upload or drag & drop
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "var(--muted)",
                      }}
                    >
                      PNG, JPG, GIF (Max {MAX_IMAGES} images)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFilePick}
                      style={{ display: "none" }}
                    />
                  </label>
                )}

                {/* Image Preview Grid */}
                {totalImages > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    {existingImages.map((url, i) => (
                      <div
                        key={`ex-${i}`}
                        style={{
                          position: "relative",
                          paddingBottom: "100%",
                          borderRadius: 8,
                          overflow: "hidden",
                          background: "var(--panel-1)",
                          border: "1px solid var(--line)",
                        }}
                      >
                        <img
                          src={url}
                          alt=""
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            fontSize: 14,
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {newFiles.map((file, i) => (
                      <div
                        key={`new-${i}`}
                        style={{
                          position: "relative",
                          paddingBottom: "100%",
                          borderRadius: 8,
                          overflow: "hidden",
                          background: "var(--panel-1)",
                          border: "2px solid var(--accent)",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            background: "var(--accent)",
                            color: "#fff",
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 3,
                            fontWeight: 600,
                          }}
                        >
                          NEW
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewFile(i)}
                          style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            fontSize: 14,
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ===== VARIANTS SECTION (Size / Colour / Weight / Length — optional) ===== */}
              <div
                style={{
                  background: "var(--panel-2)",
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <label style={{ margin: 0, fontSize: 13.5, fontWeight: 500 }}>
                    Variants (Optional) — Size, Colour, Weight, Length etc.
                  </label>
                  <button
                    type="button"
                    onClick={addVariantType}
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    + Add Variant Type
                  </button>
                </div>

                {form.variants.map((v, vIdx) => (
                  <div
                    key={vIdx}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <input
                        type="text"
                        placeholder="Variant name e.g. Size"
                        value={v.name}
                        onChange={(e) => updateVariantName(vIdx, e.target.value)}
                        style={{
                          flex: 1,
                          background: "var(--panel-1)",
                          border: "1px solid var(--line)",
                          color: "var(--off)",
                          padding: "8px 10px",
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantType(vIdx)}
                        style={{
                          background: "none",
                          border: "1px solid var(--line)",
                          color: "#e57373",
                          borderRadius: 6,
                          padding: "0 10px",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    {v.options.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                        {v.options.map((opt, oIdx) => (
                          <span
                            key={oIdx}
                            style={{
                              background: "var(--panel-1)",
                              border: "1px solid var(--line)",
                              borderRadius: 20,
                              padding: "5px 10px",
                              fontSize: 12,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {opt}
                            <button
                              type="button"
                              onClick={() => removeVariantOption(vIdx, oIdx)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--muted)",
                                cursor: "pointer",
                                fontSize: 14,
                                lineHeight: 1,
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        placeholder="e.g. Small, or Red, or 900g"
                        value={optionDraft[vIdx] || ""}
                        onChange={(e) =>
                          setOptionDraft((d) => ({ ...d, [vIdx]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addVariantOption(vIdx, optionDraft[vIdx] || "");
                            setOptionDraft((d) => ({ ...d, [vIdx]: "" }));
                          }
                        }}
                        style={{
                          flex: 1,
                          background: "var(--panel-1)",
                          border: "1px solid var(--line)",
                          color: "var(--off)",
                          padding: "8px 10px",
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addVariantOption(vIdx, optionDraft[vIdx] || "");
                          setOptionDraft((d) => ({ ...d, [vIdx]: "" }));
                        }}
                        style={{
                          background: "var(--panel-1)",
                          border: "1px solid var(--line)",
                          color: "var(--off)",
                          borderRadius: 6,
                          padding: "0 14px",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <label className="filter-opt" style={{ marginBottom: 20, marginTop: 6 }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                />
                Featured Product (show on homepage)
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Add Product"}
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    resetForm();
                    setTab("products");
                  }}
                >
                  Cancel
                </button>
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
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddCategory()
                  }
                  placeholder="New category name..."
                  style={{
                    flex: 1,
                    background: "var(--panel-2)",
                    border: "1px solid var(--line)",
                    color: "var(--off)",
                    padding: "11px 13px",
                    borderRadius: 8,
                    fontSize: 13.5,
                  }}
                />
                <button
                  className="btn-primary"
                  style={{ padding: "0 20px" }}
                  onClick={handleAddCategory}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="admin-note" style={{ marginBottom: 20 }}>
              &#9888;&#65039; Base categories (Bats, Caps, Kit Bags, Gloves,
              Balls) already have their own shop pages and can&apos;t be deleted
              here. Categories you add show up as a folder option when adding
              products.
            </div>

            <div className="admin-list">
              {BASE_CATEGORIES.map((c) => (
                <div key={c.slug} className="admin-list-item">
                  <div className="admin-list-info">
                    <p className="admin-list-name">
                      {c.label}{" "}
                      <span
                        className="admin-featured-tag"
                        style={{
                          background: "var(--panel-2)",
                          color: "var(--muted)",
                        }}
                      >
                        Base
                      </span>
                    </p>
                    <p className="admin-list-cat">
                      {products.filter((p) => p.category === c.label).length}{" "}
                      products
                    </p>
                  </div>
                </div>
              ))}

              {customCategories.map((cat) => (
                <div key={cat} className="admin-list-item">
                  <div className="admin-list-info">
                    <p className="admin-list-name">{cat}</p>
                    <p className="admin-list-cat">
                      {products.filter((p) => p.category === cat).length}{" "}
                      products
                    </p>
                  </div>
                  <div className="admin-list-actions">
                    <button
                      className="danger"
                      onClick={() => handleDeleteCategory(cat)}
                    >
                      Delete
                   </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "coupons" && <CouponManager />}
      </div>
    </div>
  );
}