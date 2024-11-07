"use client";

import { useEffect, useState } from "react";
import FavoritesButton from "@/components/FavoritesButton";
import RecipeCard from "@/components/RecipeCard";

// Simulate fetching favorite recipes with their "addedDate"
const fetchFavoriteRecipes = async () => {
  // Example of fetching data from an API or getting it from local storage
  // This should return an array of favorite recipes, each containing a `favoriteAddedDate`
  return [
    {
      _id: "1",
      title: "Spaghetti Bolognese",
      description: "A classic Italian dish with rich tomato sauce.",
      images: ["image1.jpg", "image2.jpg"],
      published: "2024-01-01",
      prep: 10,
      cook: 20,
      servings: 4,
      instructions: [/* array of instructions */],
      favoriteAddedDate: "2024-10-20", // Example date when this recipe was added to favorites
    },
    // Add more recipes as needed
  ];
};

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

  const fetchFavorites = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User ID not found.");
      return;
    }

    try {
      const response = await fetch("/api/favorites?action=list", {
        headers: { "user-id": userId },
      });
      const data = await response.json();
      if (response.ok) {
        setFavorites(data.favorites);
      } else {
        setError("Failed to fetch favorites");
      }
    } catch (error) {
      setError("Error fetching favorites: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoritesCount = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      const response = await fetch("/api/favorites?action=count", {
        headers: { "user-id": userId },
      });
      const data = await response.json();
      if (response.ok) {
        setCount(data.count);
      } else {
        console.error("Failed to fetch favorites count");
      }
    } catch (error) {
      console.error("Error fetching favorites count:", error);
    }
  };

  const handleFavoriteToggle = async (recipeId, isFavorite) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      const response = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST", // Use DELETE to remove or POST to add
        headers: {
          "user-id": userId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      });

      if (response.ok) {
        // Update the favorites list after toggling
        fetchFavorites();
        fetchFavoritesCount();
      } else {
        console.error("Error toggling favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div>
      <h2>Favorites ({count})</h2>
      <ul>
        {favorites.map((recipe) => (
          <li key={recipe._id} className="relative">
            <p>{recipe.title}</p>
            <FavoritesButton
              recipeId={recipe._id}
              isFavorite={true} // The recipe is already in favorites, so it's initially marked as favorite
              onFavoriteToggle={handleFavoriteToggle}
            />
          </li>
        ))}
      </ul>
      {loading && <p>Loading favorites...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}