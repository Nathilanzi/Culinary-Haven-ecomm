"use client";

/**
 * Favorites Component
 *
 * @description Displays a user's favorite recipes with real-time updates and functionality
 * to toggle favorite status. Uses session-based authentication to fetch and display
 * the list of favorite recipes, showing additional recipe details.
 *
 * @module Favorites
 * @returns {JSX.Element|null} - Returns the JSX layout for the Favorites page or redirects
 * unauthenticated users to the sign-in page.
 *
 * @example
 * // Usage
 * import Favorites from "@/app/favorites";
 *
 * export default function Page() {
 *   return <Favorites />;
 * }
 *
 * @requires useSession - Hook from `next-auth/react` for session management.
 * @requires useRouter - Hook from `next/navigation` for client-side routing.
 * @requires FavoritesButton - Component for toggling favorites.
 * @requires RecipeCard - Component for displaying individual recipe details.
 * @requires LoadingPage - Component for displaying a loading spinner.
 * @requires BackButton - Component for navigating back to the previous page.
 */

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import LoadingPage from "../loading";
import BackButton from "@/components/BackButton";
import { Heart } from "lucide-react";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  /**
   * Fetches and updates the user's favorite recipes.
   *
   * @function fetchFavorites
   * @async
   * @description Makes a call to the `/api/favorites` endpoint to retrieve a list
   * of the user's favorite recipes. For each recipe ID, it fetches full recipe details
   * from the `/api/recipes/:id` endpoint.
   *
   * @returns {Promise<void>} - Updates state with fetched favorites or logs errors.
   */
  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites?action=list", {
          headers: {
            "user-id": session.user.id,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch favorites");

        const data = await response.json();
        // Fetch full recipe details for each favorite
        const recipesWithDetails = await Promise.all(
          data.favorites.map(async (fav) => {
            const recipeResponse = await fetch(`/api/recipes/${fav.recipeId}`);
            const recipeData = await recipeResponse.json();
            return {
              ...recipeData,
              favorited_at: fav.created_at,
            };
          })
        );

        setFavorites(recipesWithDetails);
      } catch (error) {
        setError("Error fetching favorites: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();

    // Listen for favorites updates
    window.addEventListener("favoritesUpdated", fetchFavorites);
    return () => window.removeEventListener("favoritesUpdated", fetchFavorites);
  }, [session, router]);

  /**
   * Handles the removal of a recipe from the favorites list.
   *
   * @function handleFavoriteToggle
   * @param {string} recipeId - The unique identifier of the recipe to be removed.
   * @returns {void} - Updates the state by filtering out the unfavorited recipe.
   */
  const handleFavoriteToggle = (recipeId) => {
    setFavorites(favorites.filter((fav) => fav._id !== recipeId));
  };

  if (loading) return <LoadingPage />;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Fixed position back button */}
      <div className="fixed top-4 -left-20 z-50">
        <BackButton className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-2 hover:bg-white transition-colors dark:bg-gray-800 dark:hover:bg-gray-700" />
      </div>
      <h1 className="text-4xl font-bold mb-10 dark:text-white text-center tracking-tight text-gray-700 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
        My Favorite Recipes
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12 px-6">
          <Heart className="mx-auto w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            You haven't added any favorites yet. Start by adding some!
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favorites.map((recipe) => (
              <div key={recipe._id} className="relative">
                <RecipeCard
                  recipe={recipe}
                  showFavoriteButton
                  isFavorited={true}
                  onFavoriteToggle={handleFavoriteToggle}
                  additionalInfo={
                    <p className="text-sm text-gray-500 mt-2">
                      Added to favorites:{" "}
                      {new Date(recipe.favorited_at).toLocaleDateString()}
                    </p>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
