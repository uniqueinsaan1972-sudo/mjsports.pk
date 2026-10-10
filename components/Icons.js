// One icon set (outline, 1.75 stroke) used across the whole storefront.
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false };
const I = (d) => function Icon({ size = 20, ...p }) { return <svg {...base} width={size} height={size} {...p}>{d}</svg>; };

export const SearchIcon = I(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const CartIcon = I(<><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2" /><circle cx="9.5" cy="20" r="1.2" /><circle cx="17.5" cy="20" r="1.2" /></>);
export const HeartIcon = I(<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />);
export const MenuIcon = I(<><path d="M4 7h16M4 12h16M4 17h16" /></>);
export const CloseIcon = I(<path d="m6 6 12 12M18 6 6 18" />);
export const ChevronIcon = I(<path d="m6 9 6 6 6-6" />);
export const ArrowIcon = I(<path d="M5 12h14m-6-6 6 6-6 6" />);
export const PhoneIcon = I(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />);
export const WhatsappIcon = I(<><path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-4A8 8 0 1 1 20 12Z" /><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .7a4 4 0 0 1-1.7-1.7l.7-1-1-2L9 9Z" /></>);
export const PinIcon = I(<><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>);
export const ShieldIcon = I(<><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>);
export const VideoIcon = I(<><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>);
export const TruckIcon = I(<><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="17.5" r="1.5" /><circle cx="17" cy="17.5" r="1.5" /></>);
export const ShopIcon = I(<><path d="M4 9h16l-1-5H5L4 9Z" /><path d="M5 9v11h14V9M10 20v-6h4v6" /></>);
export const PlusIcon = I(<path d="M12 5v14M5 12h14" />);
export const MinusIcon = I(<path d="M5 12h14" />);
export const TrashIcon = I(<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />);
export const CheckIcon = I(<path d="m5 12 5 5 9-10" />);
export const ExternalIcon = I(<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />);
export const TikTokIcon = I(<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.3 2.6 2 4 4.5 4.2" />);
export const FacebookIcon = I(<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.3-.5.5-.5H14Z" />);
