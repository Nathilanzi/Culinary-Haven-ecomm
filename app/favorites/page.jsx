"use client";

import { useEffect, useState } from "react";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve or create userId on mount
  useEffect(() => {
    initializeUserId().then(() => {
      fetchFavorites();
      fetchFavoritesCount();
    });
  }, []);

