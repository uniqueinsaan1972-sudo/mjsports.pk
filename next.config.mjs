const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mjsports.pk";
const canonicalHost = new URL(SITE_URL).host;
const otherHost = canonicalHost.startsWith("www.") ? canonicalHost.slice(4) : `www.${canonicalHost}`;
const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy. Ships as Report-Only so nothing can break; after you click
// through the live site once with the browser console open and see no CSP warnings,
// set CSP_MODE=enforce in your hosting environment variables.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://apis.google.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://firebasestorage.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://api.cloudinary.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "frame-src 'self' https://*.firebaseapp.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");
const cspHeader = process.env.CSP_MODE === "enforce" ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  async redirects() {
    // Send the non-canonical host (www or apex) to the canonical one.
    return [{ source: "/:path*", has: [{ type: "host", value: otherHost }], destination: `${SITE_URL}/:path*`, permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: cspHeader, value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
