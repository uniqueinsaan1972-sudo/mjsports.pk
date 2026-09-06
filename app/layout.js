import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "MJ Sports | Premium Cricket Gear",
  description: "MJ Sports — cricket bats, caps, kits and accessories crafted in Sialkot, Pakistan.",
  keywords: "cricket bats, cricket equipment, gloves, caps, Sialkot, sports gear, cricket supplies",
  authors: [{ name: "MJ Sports Team" }],
  creator: "MJ Sports",
  publisher: "MJ Sports",
  
  openGraph: {
    title: "MJ Sports | Premium Cricket Gear",
    description: "Discover high-quality cricket bats, caps, gloves, and sports equipment. Direct from Sialkot.",
    url: "https://www.mjsports.pk",
    siteName: "MJ Sports",
    images: [
      {
        url: "https://www.mjsports.pk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MJ Sports - Cricket Equipment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "MJ Sports | Premium Cricket Gear",
    description: "Premium cricket equipment from Sialkot's finest craftsmen.",
    images: ["https://www.mjsports.pk/og-image.jpg"],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://www.mjsports.pk" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WIJZGNQEDRL"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WIJZGNQEDRL');
          `}
        </script>
        
        {/* Organization Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MJ Sports",
              "url": "https://www.mjsports.pk",
              "logo": "https://www.mjsports.pk/og-image.jpg",
              "description": "Premium cricket equipment from Sialkot, Pakistan",
              "image": "https://www.mjsports.pk/og-image.jpg",
              "sameAs": [
                "https://www.facebook.com/mjsports",
                "https://www.instagram.com/mjsports",
                "https://www.tiktok.com/@mjsports"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Sialkot",
                "addressCountry": "PK"
              }
            })
          }}
        />
      </head>
      <body className="mj">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}