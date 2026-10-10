"use client";

import { CartProvider } from "@/components/CartContext";
import { FavouritesProvider } from "@/components/FavouritesContext";

export default function Providers({ children }) {
  return (
    <CartProvider>
      <FavouritesProvider>{children}</FavouritesProvider>
    </CartProvider>
  );
}
