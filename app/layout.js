import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "MJ Sports | Premium Cricket Gear",
  description: "MJ Sports — cricket bats, caps, kits and accessories crafted in Sialkot, Pakistan.",
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
      </head>
      <body className="mj">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}