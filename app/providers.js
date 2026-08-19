"use client";

import { CartProvider } from "@/components/CartContext";
import { AuthProvider } from "@/components/AuthContext";
import { FavouritesProvider } from "@/components/FavouritesContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavouritesProvider>
          {children}
        </FavouritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}