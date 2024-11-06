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

  const initializeUserId = async () => {
    let userId = localStorage.getItem("user_id");

    // If userId doesn't exist in localStorage, get a new one from the server
    if (!userId) {
      try {
        const response = await fetch("/api/favorites?action=list");
        const data = await response.json();

        if (response.ok && data.userId) {
          userId = data.userId;
          localStorage.setItem("user_id", userId); // Store userId for future use
        } else {
          throw new Error("Failed to retrieve user ID");
        }
      } catch (error) {
        console.error("Error initializing user ID:", error);
      }
    }
    return userId;
  };

