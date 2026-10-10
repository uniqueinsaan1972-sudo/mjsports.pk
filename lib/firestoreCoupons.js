import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  updateDoc,
  increment,
} from "firebase/firestore";

const COUPONS_COLLECTION = "coupons";

/**
 * Add a new coupon
 * @param {Object} data - { code, discountType, discountValue, limitType, limitValue }
 */
export async function addCoupon(data) {
  const { code, discountType, discountValue, limitType, limitValue } = data;
  const couponId = code.trim().toUpperCase();

  const couponData = {
    id: couponId,
    code: couponId,
    discountType, // "percent" or "fixed"
    discountValue: Number(discountValue),
    limit: limitType === "unlimited" ? null : Number(limitValue),
    usedCount: 0,
    active: true,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, COUPONS_COLLECTION, couponId), couponData);
    return couponData;
  } catch (err) {
    console.error("Error adding coupon:", err);
    throw err;
  }
}

/**
 * Delete a coupon by ID
 * @param {string} id - Coupon ID (which is the code)
 */
export async function deleteCoupon(id) {
  try {
    await deleteDoc(doc(db, COUPONS_COLLECTION, id));
  } catch (err) {
    console.error("Error deleting coupon:", err);
    throw err;
  }
}

/**
 * Get a single coupon by code
 * @param {string} code - Coupon code (uppercase)
 * @returns {Promise<Object|null>} Coupon object or null
 */
export async function getCoupon(code) {
  const couponId = code.trim().toUpperCase();
  try {
    const docSnap = await getDoc(doc(db, COUPONS_COLLECTION, couponId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error("Error getting coupon:", err);
    throw err;
  }
}

/**
 * Real-time subscription to all coupons
 * @param {Function} callback - Called with array of coupons
 * @returns {Function} Unsubscribe function
 */
export function subscribeCoupons(callback) {
  try {
    const q = query(collection(db, COUPONS_COLLECTION));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coupons = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      callback(coupons);
    });
    return unsubscribe;
  } catch (err) {
    console.error("Error subscribing to coupons:", err);
    throw err;
  }
}

/**
 * Increment coupon usage count
 * @param {string} code - Coupon code
 */
export async function incrementCouponUsage(code) {
  const couponId = code.trim().toUpperCase();
  try {
    await updateDoc(doc(db, COUPONS_COLLECTION, couponId), {
      usedCount: increment(1),
    });
  } catch (err) {
    console.error("Error incrementing coupon usage:", err);
    throw err;
  }
}

/**
 * Deactivate a coupon
 * @param {string} id - Coupon ID
 */
export async function deactivateCoupon(id) {
  try {
    await updateDoc(doc(db, COUPONS_COLLECTION, id), {
      active: false,
    });
  } catch (err) {
    console.error("Error deactivating coupon:", err);
    throw err;
  }
}

/**
 * Reactivate a coupon
 * @param {string} id - Coupon ID
 */
export async function reactivateCoupon(id) {
  try {
    await updateDoc(doc(db, COUPONS_COLLECTION, id), {
      active: true,
    });
  } catch (err) {
    console.error("Error reactivating coupon:", err);
    throw err;
  }
}