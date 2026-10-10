"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const FavouritesContext = createContext(null);
const STORAGE_KEY = "mj_favourites";

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavourites(JSON.parse(stored));
    } catch (err) {
      /* storage unavailable */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch (err) {
      /* storage unavailable */
    }
  }, [favourites, loaded]);

  const isFavourite = useCallback((id) => favourites.includes(id), [favourites]);

  const toggleFavourite = useCallback((id) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  return (
    <FavouritesContext.Provider value={{ favourites, isFavourite, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used inside <FavouritesProvider>");
  return ctx;
}