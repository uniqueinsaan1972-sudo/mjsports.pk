import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, BRAND, CONTACT, SOCIAL, GA_ID } from "@/lib/siteConfig";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "MJ Sports | Cricket Bats, Kit Bags & Gear from Sialkot", template: "%s | MJ Sports" },
  description: BRAND.description,
  applicationName: "MJ Sports",
  openGraph: { type: "website", siteName: "MJ Sports", locale: "en_PK", url: SITE_URL },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#0c2219", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SportingGoodsStore",
            name: "MJ Sports",
            url: SITE_URL,
            logo: `${SITE_URL}/icon.png`,
            image: `${SITE_URL}/opengraph-image`,
            description: BRAND.description,
            telephone: CONTACT.phoneTel,
            address: { "@type": "PostalAddress", streetAddress: "CV62+QQX, Kingra Mor", addressLocality: "Sialkot", addressCountry: "PK" },
            sameAs: SOCIAL.map((s) => s.url),
          }}
        />
        {GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}</Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
