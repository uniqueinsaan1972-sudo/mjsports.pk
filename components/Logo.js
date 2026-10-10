import Link from "next/link";

// Wordmark built from the existing MJ Sports crown mark. To use a real logo image instead,
// put it at /public/brand/logo.png and pass logoImage (see app/layout.js).
export default function Logo({ logoImage = false, light = false }) {
  return (
    <Link href="/" className="logo" aria-label="MJ Sports home">
      {logoImage ? (
        <img src="/brand/logo.png" alt="MJ Sports" className="logo-img" height="44" />
      ) : (
        <>
          <span className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 8.5 6.5 11 11 4h2l4.5 7L21 8.5 19 17.5H5L3 8.5Z" fill="#c9922a" />
              <circle cx="3" cy="7" r="1.4" fill="#c9922a" /><circle cx="12" cy="3" r="1.4" fill="#c9922a" /><circle cx="21" cy="7" r="1.4" fill="#c9922a" />
            </svg>
          </span>
          <span className="logo-text">
            <strong>MJ</strong>
            <small>Sports</small>
          </span>
        </>
      )}
    </Link>
  );
}
