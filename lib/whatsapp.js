const PHONE_NUMBER = "923127538519";
const SHOP_ADDRESS = "CV62+QQX, Kingra Mor, Sialkot, Pakistan";
const SHOP_PHONE = "+92 312 7538519";

function buildLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${PHONE_NUMBER}?text=${encoded}`;
}

// ✅ FIXED: "Order this directly" button on a single product page
export function getOrderWhatsappLink(product, { variants, qty } = {}) {
  if (!product || !product.name) {
    return getGeneralWhatsappLink();
  }

  const variantLines =
    variants && Object.keys(variants).length
      ? Object.entries(variants).map(([k, v]) => `  ${k}: ${v}`)
      : [];

  const lines = [
    `Hi MJ Sports! I want to order:`,
    ``,
    `🏏 *${product.name}*`,
    ...(variantLines.length > 0 ? ["", ...variantLines] : []),
    ``,
    `Qty: ${qty || 1}`,
    `Price: Rs ${(product.price * (qty || 1)).toLocaleString()}`,
    ``,
    `Please confirm availability and delivery details.`,
  ].filter(Boolean);
  
  return buildLink(lines.join("\n"));
}

// ✅ FIXED: "Ask a question" link on a single product page
export function getInquiryWhatsappLink(product) {
  if (!product || !product.name) {
    return getGeneralWhatsappLink();
  }

  const lines = [
    `Hi MJ Sports! I have a question about:`,
    `🏏 *${product.name}*`,
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

// ✅ FIXED: Complete cart checkout with delivery method and fee
export function getCheckoutWhatsappLink(
  items = [],
  {
    subtotal = 0,
    discount = 0,
    deliveryFee = 0,
    deliveryMethod = "pickup",
    total = 0,
    coupon = null,
  } = {}
) {
  // If no items, send general inquiry
  if (!items || items.length === 0) {
    return getGeneralWhatsappLink();
  }

  const lines = [
    `═══════════════════════════`,
    `📦 *MJ SPORTS - ORDER SLIP*`,
    `═══════════════════════════`,
    ``,
    `*📋 ORDER DETAILS:*`,
    ``,
    ...items.map((i, idx) => {
      const variantStr =
        i.variants && Object.keys(i.variants).length
          ? ` (${Object.entries(i.variants)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")})`
          : "";
      const itemTotal = i.price * i.qty;
      return `${idx + 1}. ${i.name}${variantStr}\n   Qty: ${i.qty} × Rs ${i.price.toLocaleString()} = Rs ${itemTotal.toLocaleString()}`;
    }),
    ``,
    `───────────────────────────`,
    `*💰 PRICE BREAKDOWN:*`,
    ``,
    `Subtotal:          Rs ${subtotal.toLocaleString()}`,
    ...(coupon && discount > 0 ? [`Discount (${coupon.code}):  -Rs ${discount.toLocaleString()}`] : []),
    ``,
    `*🚚 DELIVERY METHOD:*`,
    deliveryMethod === "pickup"
      ? `📍 Come to Our Shop (Free)`
      : `🏠 Home Delivery (+Rs ${deliveryFee.toLocaleString()})`,
    ``,
    ...(deliveryFee > 0 ? [`Delivery Fee:      +Rs ${deliveryFee.toLocaleString()}`] : []),
    ``,
    `───────────────────────────`,
    `*💵 TOTAL: Rs ${total.toLocaleString()}*`,
    `───────────────────────────`,
    ``,
    `*👤 CUSTOMER DETAILS:*`,
    `Name: _____________________________`,
    `Phone: _____________________________`,
    ...(deliveryMethod === "home" 
      ? [
          `Address: _____________________________`,
          `City: _____________________________`,
          `Postal Code: _____________________________`,
        ]
      : [
          `📍 Pickup Location:`,
          `${SHOP_ADDRESS}`,
          `Phone: ${SHOP_PHONE}`,
        ]),
    ``,
    `*📝 SPECIAL INSTRUCTIONS (if any):*`,
    `_____________________________`,
    ``,
    `═══════════════════════════`,
    `Thank you for ordering from MJ Sports! ✅`,
    `═══════════════════════════`,
  ].filter(Boolean);

  return buildLink(lines.join("\n"));
}

// ✅ Legacy support - old function name
export function getCartWhatsappLink(items = [], options = {}) {
  return getCheckoutWhatsappLink(items, options);
}