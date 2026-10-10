import FavouritesList from "@/components/FavouritesList";
import { getAllProducts } from "@/lib/serverData";

export const metadata = { title: "Your Favourites", robots: { index: false, follow: false }, alternates: { canonical: "/favourites" } };

export default async function FavouritesPage() {
  const products = await getAllProducts();
  return (
    <div className="container">
      <div className="page-head"><h1>Your favourites</h1></div>
      <div style={{ paddingBottom: 80 }}><FavouritesList products={products} /></div>
    </div>
  );
}
