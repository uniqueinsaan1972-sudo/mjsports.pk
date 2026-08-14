import Link from "next/link";

export default function BrandMark() {
  return (
    <Link href="/" className="brand">
      <div className="mark">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 8.5L6.5 11L11 4L13 4L17.5 11L21 8.5L19 17.5H5L3 8.5Z"
            fill="#0b0c0e"
          />
          <circle cx="3" cy="7" r="1.4" fill="#0b0c0e" />
          <circle cx="12" cy="3" r="1.4" fill="#0b0c0e" />
          <circle cx="21" cy="7" r="1.4" fill="#0b0c0e" />
        </svg>
      </div>
      <div className="name">
        <span className="mj-text">MJ</span>
        <span className="sports-text">Sports</span>
      </div>
    </Link>
  );
}