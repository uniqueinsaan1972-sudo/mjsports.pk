"use client";
import { useState } from "react";
import { CATEGORIES } from "@/lib/products";
import styles from "@/styles/admin.module.css";

export default function AdminPanel() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [editing, setEditing] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  const toggleVisible = (slug) => {
    setCategories(
      categories.map((cat) =>
        cat.slug === slug ? { ...cat, visible: !cat.visible } : cat
      )
    );
  };

  const startEdit = (cat) => {
    setEditing(cat.slug);
    setEditLabel(cat.label);
  };

  const saveEdit = (slug) => {
    setCategories(
      categories.map((cat) =>
        cat.slug === slug ? { ...cat, label: editLabel } : cat
      )
    );
    setEditing(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditLabel("");
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>Admin Panel</h1>
        <div className={styles.headerActions}>
          <button className={styles.btnView}>View Site</button>
          <button className={styles.btnLogout}>Logout</button>
        </div>
      </div>

      <div className={styles.adminTabs}>
        <button
          className={activeTab === "products" ? styles.tabActive : ""}
          onClick={() => setActiveTab("products")}
        >
          Products (12)
        </button>
        <button
          className={activeTab === "addProduct" ? styles.tabActive : ""}
          onClick={() => setActiveTab("addProduct")}
        >
          Add Product
        </button>
        <button
          className={activeTab === "categories" ? styles.tabActive : ""}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={activeTab === "coupons" ? styles.tabActive : ""}
          onClick={() => setActiveTab("coupons")}
        >
          Coupons
        </button>
      </div>

      {activeTab === "categories" && (
        <div className={styles.adminContent}>
          <h2>Manage Categories</h2>

          <div className={styles.categoriesList}>
            <div className={styles.note}>
              <p>
                ⚠️ <strong>Edit:</strong> Rename category name
              </p>
              <p>
                🟢 <strong>Live:</strong> Category visible on homepage
              </p>
              <p>
                🔴 <strong>Hidden:</strong> Category hidden from public
              </p>
            </div>

            {categories.map((cat) => (
              <div key={cat.slug} className={styles.categoryItem}>
                {editing === cat.slug ? (
                  <div className={styles.editMode}>
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className={styles.input}
                      placeholder="Category name"
                    />
                    <button
                      onClick={() => saveEdit(cat.slug)}
                      className={styles.btnSave}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className={styles.btnCancel}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className={styles.viewMode}>
                    <div className={styles.catInfo}>
                      <h3>{cat.label}</h3>
                      <p>Slug: {cat.slug}</p>
                    </div>

                    <div className={styles.catActions}>
                      <button
                        onClick={() => startEdit(cat)}
                        className={styles.btnEdit}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => toggleVisible(cat.slug)}
                        className={
                          cat.visible ? styles.btnHide : styles.btnShow
                        }
                      >
                        {cat.visible ? "🔴 Hide" : "🟢 Show"}
                      </button>

                      <span
                        className={
                          cat.visible
                            ? styles.statusLive
                            : styles.statusHidden
                        }
                      >
                        {cat.visible ? "🟢 Live" : "🔴 Hidden"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.warning}>
            <p>
              💾 <strong>Important:</strong> Click Edit/Hide to manage. To save
              permanently, update <code>lib/products.js</code> with these
              changes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}