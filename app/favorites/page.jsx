"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FavoritesButton from "@/components/FavoritesButton";
import RecipeCard from "@/components/RecipeCard";
import LoadingPage from "../loading";
import BackButton from "@/components/BackButton";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites?action=list", {
          headers: {
            "user-id": session.user.id
          }
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
              favorited_at: fav.created_at
            };
          })
        );
        
        setFavorites(recipesWithDetails);
        
        // Update localStorage with current favorites
        localStorage.setItem('userFavorites', JSON.stringify(
          recipesWithDetails.map(recipe => recipe._id)
        ));
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

  const handleFavoriteToggle = (recipeId) => {
    setFavorites(favorites.filter(fav => fav._id !== recipeId));
    
    // Update localStorage
    const currentFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    const updatedFavorites = currentFavorites.filter(id => id !== recipeId);
    localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
  };

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fixed position back button */}
      <div className="fixed top-4 -left-20 z-50">
        <BackButton className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-2 hover:bg-white transition-colors dark:bg-gray-800 dark:hover:bg-gray-700" />
      </div>
      <h1 className="text-4xl font-bold mb-10 dark:text-white text-center tracking-tight text-gray-700 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
        My Favorite Recipes
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center text-black dark:text-white py-8">
          <p>You haven&apos;t saved any favorites yet.</p>
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
                  onFavoriteToggle={() => handleFavoriteToggle(recipe._id)}
                  additionalInfo={
                    <p className="text-sm text-gray-500 mt-2">
                    Added to favorites: {new Date(recipe.favorited_at).toLocaleDateString()}
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