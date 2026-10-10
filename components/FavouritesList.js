"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useFavourites } from "@/components/FavouritesContext";

export default function FavouritesList({ products }) {
  const { favourites } = useFavourites();
  const list = products.filter((p) => favourites.includes(p.id));
  if (!list.length)
    return (
      <div className="empty">
        <h2>No favourites yet</h2>
        <p>Tap the heart on any product to save it here.</p>
        <Link href="/shop" className="btn btn-primary">Shop products</Link>
      </div>
    );
  return <div className="product-grid">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>;
}
