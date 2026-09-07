"use client";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/products";
import styles from "@/styles/admin.module.css";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setCategories(CATEGORIES);
  }, []);

  const toggleVisible = (slug) => {
    const updated = categories.map((cat) =>
      cat.slug === slug ? { ...cat, visible: !cat.visible } : cat
    );
    setCategories(updated);
    setHasChanges(true);
  };

  const startEdit = (cat) => {
    setEditing(cat.slug);
    setEditLabel(cat.label);
  };

  const saveEdit = (slug) => {
    const updated = categories.map((cat) =>
      cat.slug === slug ? { ...cat, label: editLabel } : cat
    );
    setCategories(updated);
    setEditing(null);
    setHasChanges(true);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditLabel("");
  };

  const saveToDatabase = async () => {
    // Save changes to Firebase or database
    console.log("Saving categories:", categories);
    setHasChanges(false);
    alert("Categories updated successfully!");
  };

  return (
    <div className={styles.adminPanel}>
      <h1>Manage Categories</h1>

      {hasChanges && (
        <div className={styles.saveNote}>
          <p>⚠️ You have unsaved changes!</p>
          <button onClick={saveToDatabase} className={styles.btnSaveAll}>
            💾 Save All Changes
          </button>
        </div>
      )}
      
      <div className={styles.categoriesList}>
        {categories.map((cat) => (
          <div key={cat.slug} className={styles.categoryItem}>
            {editing === cat.slug ? (
              <div className={styles.editRow}>
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
                  ✓ Save
                </button>
                <button
                  onClick={cancelEdit}
                  className={styles.btnCancel}
                >
                  ✕ Cancel
                </button>
              </div>
            ) : (
              <>
                <div className={styles.catInfo}>
                  <h3>{cat.label}</h3>
                  <p className={styles.slug}>{cat.slug}</p>
                </div>

                <div className={styles.catActions}>
                  <button
                    onClick={() => startEdit(cat)}
                    className={styles.btnEdit}
                    title="Edit category name"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => toggleVisible(cat.slug)}
                    className={cat.visible ? styles.btnPrivate : styles.btnLive}
                    title={cat.visible ? "Make Private (hide from homepage)" : "Make Live (show on homepage)"}
                  >
                    {cat.visible ? "🔴 Private" : "🟢 Live"}
                  </button>

                  <span className={cat.visible ? styles.statusLive : styles.statusPrivate}>
                    {cat.visible ? "🟢 Live" : "🔴 Private"}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.note}>
        <p>💡 <strong>Edit:</strong> Change category name</p>
        <p>🟢 <strong>Live:</strong> Category visible on homepage</p>
        <p>🔴 <strong>Private:</strong> Category hidden from homepage</p>
        <p>💾 <strong>Save All Changes:</strong> Click button to save permanently</p>
      </div>
    </div>
  );
}