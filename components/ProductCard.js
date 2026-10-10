"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useFavourites } from "@/components/FavouritesContext";
import { HeartIcon } from "@/components/Icons";
import { img } from "@/lib/images";
import { productPath } from "@/lib/categories";

export default function ProductCard({ product, categoryLabel, priority = false }) {
  const { addItem } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();
  const href = productPath(product);
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const fav = isFavourite(product.id);

  return (
    <article className="pcard">
      <div className="pcard-img">
        {product.badge && <span className="tag tag--sale">{product.badge}</span>}
        <button type="button" className="icon-btn fav-btn" aria-pressed={fav} aria-label={fav ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`} onClick={() => toggleFavourite(product.id)}>
          <HeartIcon size={20} />
        </button>
        {product.thumbnail ? (
          <img src={img(product.thumbnail, 600)} alt={product.name} width="600" height="600" loading={priority ? "eager" : "lazy"} decoding="async" />
        ) : null}
      </div>
      <div className="pcard-body">
        <span className="pcard-cat">{categoryLabel || product.category}</span>
        <h3 className="pcard-title"><Link href={href}>{product.name}</Link></h3>
        <div className="price">
          <strong>Rs {Number(product.price).toLocaleString()}</strong>
          {product.old ? <del>Rs {Number(product.old).toLocaleString()}</del> : null}
        </div>
        <div className="pcard-actions">
          {hasVariants ? (
            <Link href={href} className="btn btn-secondary">Choose options</Link>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => addItem(product, 1, {})}>Add to cart</button>
          )}
        </div>
      </div>
    </article>
  );
}
