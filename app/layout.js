import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "MJ Sports | Premium Cricket Gear",
  description: "MJ Sports — cricket bats, caps, kits and accessories crafted in Sialkot, Pakistan.",
  keywords: "cricket bats, cricket equipment, gloves, caps, Sialkot, sports gear, cricket supplies",
  authors: [{ name: "MJ Sports Team" }],
  creator: "MJ Sports",
  publisher: "MJ Sports",
  
  // Open Graph Tags (Social Media Share)
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
  
  // Twitter Card Tags
  twitter: {
    card: "summary_large_image",
    title: "MJ Sports | Premium Cricket Gear",
    description: "Premium cricket equipment from Sialkot's finest craftsmen.",
    images: ["https://www.mjsports.pk/og-image.jpg"],
  },
  
  // Robots & Indexing
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
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.mjsports.pk" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WIJGQNGEDRL"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WIJGQNGEDRL');
          `}
        </script>
      </head>
      <body className="mj">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}