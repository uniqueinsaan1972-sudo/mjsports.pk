"use client";

import { useEffect, useState } from "react";
import { getOrderWhatsappLink, getInquiryWhatsappLink } from "@/lib/whatsapp";
import { useCart } from "@/components/CartContext";
import { useFavourites } from "@/components/FavouritesContext";
import { ShieldIcon, VideoIcon, TruckIcon, ShopIcon, PlusIcon, MinusIcon, HeartIcon, WhatsappIcon, CloseIcon, ChevronIcon } from "@/components/Icons";
import { DELIVERY_FEE } from "@/lib/siteConfig";
import { img } from "@/lib/images";

export default function ProductDetailView({ product }) {
  const { name, price = 0, old, badge, description, specs, images, thumbnail, variants = [] } = product;
  const gallery = images && images.length ? images : thumbnail ? [thumbnail] : [];
  const weights = specs?.weights?.length ? specs.weights : null;

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [selected, setSelected] = useState({});
  const [weight, setWeight] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const { addItem } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + gallery.length) % gallery.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoom, gallery.length]);

  const chosen = { ...(weights && weight ? { Weight: weight } : {}), ...selected };
  const missing = [...variants.filter((v) => !selected[v.name]).map((v) => v.name), ...(weights && !weight ? ["Weight"] : [])];

  function handleAdd() {
    if (missing.length) { setError(`Please select: ${missing.join(", ")}`); return; }
    setError("");
    addItem(product, qty, chosen);
  }
  function waLink(e) {
    if (missing.length) { e.preventDefault(); setError(`Please select: ${missing.join(", ")}`); }
  }
  const fav = isFavourite(product.id);

  return (
    <div className="pdp">
      <div>
        <button type="button" className="gallery-main" onClick={() => gallery.length && setZoom(true)} aria-label="Enlarge product image">
          {gallery[active] ? <img src={img(gallery[active], 1000)} alt={`${name} - image ${active + 1} of ${gallery.length}`} width="1000" height="1000" /> : null}
        </button>
        {gallery.length > 1 && (
          <div className="thumbs">
            {gallery.map((src, i) => (
              <button key={src + i} type="button" aria-current={i === active} aria-label={`Show image ${i + 1}`} onClick={() => setActive(i)}>
                <img src={img(src, 160)} alt="" width="76" height="76" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pdp-info">
        <h1>{name}</h1>
        <div className="pdp-price">
          <strong>Rs {Number(price).toLocaleString()}</strong>
          {old ? <del>Rs {Number(old).toLocaleString()}</del> : null}
          {badge ? <span className="tag">{badge}</span> : null}
        </div>
        <p className="note">Prices in PKR.</p>

        {weights && (
          <fieldset className="opt">
            <legend>Weight</legend>
            <div className="opt-row">
              {weights.map((w) => (
                <button key={w} type="button" className="opt-btn" aria-pressed={weight === w} onClick={() => { setWeight(w); setError(""); }}>{w}</button>
              ))}
            </div>
          </fieldset>
        )}
        {variants.map((v) => (
          <fieldset className="opt" key={v.name}>
            <legend>{v.name}{selected[v.name] ? `: ${selected[v.name]}` : ""}</legend>
            <div className="opt-row">
              {v.options.map((o) => (
                <button key={o} type="button" className="opt-btn" aria-pressed={selected[v.name] === o} onClick={() => { setSelected((s) => ({ ...s, [v.name]: o })); setError(""); }}>{o}</button>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="opt">
          <span className="opt-label">Quantity</span>
          <div className="qty">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}><MinusIcon size={18} /></button>
            <span aria-live="polite">{qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(99, q + 1))}><PlusIcon size={18} /></button>
          </div>
        </div>

        {error && <p className="error-text" role="alert">{error}</p>}
        <div className="buy-row">
          <button type="button" className="btn btn-primary" onClick={handleAdd}>Add to cart</button>
          <button type="button" className="btn btn-secondary" aria-pressed={fav} onClick={() => toggleFavourite(product.id)}>
            <HeartIcon size={18} style={fav ? { fill: "currentColor" } : undefined} /> {fav ? "Saved" : "Save"}
          </button>
        </div>
        <div className="buy-row">
          <a className="btn btn-secondary btn-block" href={getOrderWhatsappLink(product, { variants: chosen, qty })} onClick={waLink} target="_blank" rel="noopener noreferrer">
            <WhatsappIcon size={18} /> Order on WhatsApp
          </a>
        </div>

        <div className="info-box">
          <div><ShieldIcon /><p style={{ margin: 0 }}><strong>Replacement guarantee</strong><span>Every order is covered by the MJ Sports replacement guarantee.</span></p></div>
          <div><VideoIcon /><p style={{ margin: 0 }}><strong>Video before packing</strong><span>After advance payment, we send a video of your exact article before it is packed.</span></p></div>
          <div><TruckIcon /><p style={{ margin: 0 }}><strong>Home delivery: Rs {DELIVERY_FEE.toLocaleString()}</strong><span>Delivered across Pakistan. We do not offer cash on delivery.</span></p></div>
          <div><ShopIcon /><p style={{ margin: 0 }}><strong>Shop pickup: free</strong><span>Collect from our shop in Sialkot.</span></p></div>
        </div>

        {description ? (
          <section style={{ marginTop: 28 }} aria-labelledby="desc-h">
            <h2 id="desc-h" style={{ fontSize: "1.5rem" }}>Product details</h2>
            <p style={{ whiteSpace: "pre-line" }}>{description}</p>
          </section>
        ) : null}
        {(specs?.handle && specs.handle !== "-") || (specs?.edge && specs.edge !== "-") || (specs?.playerType && specs.playerType !== "All") ? (
          <table className="specs"><tbody>
            {specs.handle && specs.handle !== "-" && <tr><th>Handle</th><td>{specs.handle}</td></tr>}
            {specs.edge && specs.edge !== "-" && <tr><th>Edge</th><td>{specs.edge}</td></tr>}
            {specs.playerType && specs.playerType !== "All" && <tr><th>Player type</th><td>{specs.playerType}</td></tr>}
          </tbody></table>
        ) : null}
        <p className="note" style={{ marginTop: 20 }}>
          Have a question? <a href={getInquiryWhatsappLink(product)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Ask us on WhatsApp</a>.
        </p>
      </div>

      {zoom && gallery[active] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Product image" onClick={() => setZoom(false)}>
          <img src={img(gallery[active], 1600)} alt={`${name} enlarged`} onClick={(e) => e.stopPropagation()} />
          <button className="icon-btn" style={{ top: 12, right: 12 }} aria-label="Close" onClick={() => setZoom(false)}><CloseIcon /></button>
          {gallery.length > 1 && (
            <>
              <button className="icon-btn" style={{ left: 8, top: "50%" }} aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setActive((i) => (i - 1 + gallery.length) % gallery.length); }}><ChevronIcon style={{ transform: "rotate(90deg)" }} /></button>
              <button className="icon-btn" style={{ right: 8, top: "50%" }} aria-label="Next image" onClick={(e) => { e.stopPropagation(); setActive((i) => (i + 1) % gallery.length); }}><ChevronIcon style={{ transform: "rotate(-90deg)" }} /></button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
