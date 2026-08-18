const PHONE_NUMBER = "923127538519";

function buildLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${PHONE_NUMBER}?text=${encoded}`;
}

// "Order this directly" button on a single product page
export function getOrderWhatsappLink(product, { variants, qty } = {}) {
  const variantLines =
    variants && Object.keys(variants).length
      ? Object.entries(variants).map(([k, v]) => `${k}: ${v}`)
      : [];

  const lines = [
    `Hi MJ Sports! I want to order:`,
    ``,
    `🏏 ${product.name}`,
    ...variantLines,
    `Qty: ${qty || 1}`,
    `Price: Rs ${(product.price * (qty || 1)).toLocaleString()}`,
    ``,
    `Please confirm availability and delivery details.`,
  ].filter(Boolean);
  return buildLink(lines.join("\n"));
}

// "Ask a question" link on a single product page
export function getInquiryWhatsappLink(product) {
  const lines = [
    `Hi MJ Sports! I have a question about:`,
    `🏏 ${product.name}`,
    ``,
    `Question: `,
  ];
  return buildLink(lines.join("\n"));
}

// General WhatsApp inquiry (for floating button, etc.)
export function getGeneralWhatsappLink() {
  const message = `Hi MJ Sports! I'd like to know more about your products.`;
  return buildLink(message);
}

// Full cart checkout — generates a formatted order slip
export function getCartWhatsappLink(items = [], { subtotal = 0, discount = 0, total = 0, coupon } = {}) {
  // If no items, just send a general inquiry
  if (!items || items.length === 0) {
    return getGeneralWhatsappLink();
  }

  const lines = [
    `Hi MJ Sports! I'd like to place this order:`,
    ``,
    ...items.map((i) => {
      const variantStr =
        i.variants && Object.keys(i.variants).length
          ? ` (${Object.values(i.variants).join(", ")})`
          : "";
      return `🏏 ${i.name}${variantStr} x${i.qty} — Rs ${(i.price * i.qty).toLocaleString()}`;
    }),
    ``,
    `Subtotal: Rs ${subtotal.toLocaleString()}`,
    coupon ? `Coupon (${coupon.code}): -Rs ${discount.toLocaleString()}` : null,
    `Total: Rs ${total.toLocaleString()}`,
    ``,
    `Name: `,
    `Address: `,
    `Phone: `,
  ].filter(Boolean);
  return buildLink(lines.join("\n"));
}