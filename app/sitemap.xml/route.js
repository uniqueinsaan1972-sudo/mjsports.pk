export default function sitemap() {
  const baseUrl = 'https://www.mjsports.pk';
  
  // Static pages
  const staticPages = [
    '',
    '/products',
    '/about',
    '/contact',
  ];

  // Product categories
  const categories = [
    '/category/cricket-bats',
    '/category/caps-hats',
    '/category/kit-bags',
    '/category/gloves',
    '/category/balls',
    '/category/apparel',
  ];

  const allPages = [...staticPages, ...categories];

  const sitemap = allPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1.0 : 0.8,
  }));

  return sitemap;
}