import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/siteConfig";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs container" aria-label="Breadcrumb">
      <ol>
        {items.map((it, i) => (
          <li key={it.href || it.label}>
            {i < items.length - 1 ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: it.label,
            item: `${SITE_URL}${it.href}`,
          })),
        }}
      />
    </nav>
  );
}
