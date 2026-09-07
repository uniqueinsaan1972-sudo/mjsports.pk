"use client";
import { useState } from "react";
import { CATEGORIES } from "@/lib/products";
import styles from "@/styles/admin.module.css";

export default function ManageCategories() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [editing, setEditing] = useState(null);
  const [editLabel, setEditLabel] = useState("");

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
    <div className={styles.adminPanel}>
      <h1>Manage Categories</h1>
      
      <div className={styles.categoriesList}>
        {categories.map((cat) => (
          <div key={cat.slug} className={styles.categoryItem}>
            {editing === cat.slug ? (
              <>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className={styles.input}
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
              </>
            ) : (
              <>
                <div className={styles.catInfo}>
                  <h3>{cat.label}</h3>
                  <p>{cat.slug}</p>
                </div>

                <div className={styles.catActions}>
                  <button
                    onClick={() => startEdit(cat)}
                    className={styles.btnEdit}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleVisible(cat.slug)}
                    className={cat.visible ? styles.btnHide : styles.btnShow}
                  >
                    {cat.visible ? "Hide" : "Show"}
                  </button>

                  <span className={cat.visible ? styles.statusLive : styles.statusHidden}>
                    {cat.visible ? "🟢 Live" : "🔴 Hidden"}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.note}>
        <p>💡 Hidden categories won't appear on the public website.</p>
        <p>⚠️ Note: Changes are preview only. Update `lib/products.js` to save permanently.</p>
      </div>
    </div>
  );
}