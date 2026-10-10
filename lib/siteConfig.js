// Single source of truth for real MJ Sports business details.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mjsports.pk";

export const BRAND = {
  name: "MJ Sports",
  tagline: "Cricket gear from Sialkot",
  description:
    "MJ Sports sells cricket bats, caps, kit bags, gloves and sports gear from Sialkot, Pakistan. Advance payment, a video of your exact article before packing, and a replacement guarantee.",
};

export const CONTACT = {
  phoneDisplay: "+92 312 7538519",
  phoneTel: "+923127538519",
  whatsappNumber: "923127538519",
  address: "CV62+QQX, Kingra Mor, Sialkot, Pakistan",
  mapsUrl: "https://maps.app.goo.gl/PP4nqRD6gHyc4tvj9",
};

export const SOCIAL = [
  { id: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@mj.sports99" },
  { id: "facebook", label: "Facebook", url: "https://www.facebook.com/people/MJ-Sports/61554667569001/" },
];

// Facts provided by the business owner.
export const FACTS = {
  founded: "2024",
  founder: "Muhammad Javed (\"Meer Sahab\")",
  manager: "Hamid Sadique",
  customers: "10,000+",
  batsSold: "20,000+",
  shipsTo: ["Oman", "Netherlands", "Korea", "Bangladesh", "Saudi Arabia", "Iran", "UK", "Malaysia", "Dubai"],
};

// Home delivery fee in PKR. Pickup from the shop is free.
export const DELIVERY_FEE = 700;

export const HERO_IMAGE = {
  src: "https://res.cloudinary.com/jt3vstt9/image/upload/v1786708265/bat_cutout4__1_-removebg-preview_nazehl.png",
  alt: "MJ Sports cricket bat",
};

// Analytics: set NEXT_PUBLIC_GA_ID to override. Falls back to the property already used on the site.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-WIJZGNQEDRL";
