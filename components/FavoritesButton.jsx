"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";

// Create a custom hook for favorites management
const useFavorites = (initialIsFavorited, recipeId) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const { data: session } = useSession();
  const router = useRouter();

  const toggleFavorite = async () => {
    if (!session) {
      router.push("/auth/signin");
      return false;
    }

    try {
      const response = await fetch("/api/favorites", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": session.user.id,
        },
        body: JSON.stringify({ recipeId }),
      });

      if (response.ok) {
        const newFavoritedState = !isFavorited;
        setIsFavorited(newFavoritedState);

        // Manage localStorage for favorites
        if (newFavoritedState) {
          // Adding to favorites
          localStorage.setItem(`favorite_${recipeId}`, 'true');
          
          // Update or create userFavorites list
          const currentFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
          if (!currentFavorites.includes(recipeId)) {
            currentFavorites.push(recipeId);
            localStorage.setItem('userFavorites', JSON.stringify(currentFavorites));
          }
        } else {
          // Removing from favorites
          localStorage.removeItem(`favorite_${recipeId}`);
          
          // Remove from userFavorites list
          const currentFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
          const updatedFavorites = currentFavorites.filter(id => id !== recipeId);
          
          if (updatedFavorites.length > 0) {
            localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
          } else {
            localStorage.removeItem('userFavorites');
          }
        }

        // Dispatch event for global state update
        window.dispatchEvent(new Event("favoritesUpdated"));

        router.refresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return false;
    }
  };

  // Check localStorage on initial render
  useEffect(() => {
    const storedFavorite = localStorage.getItem(`favorite_${recipeId}`);
    if (storedFavorite !== null) {
      setIsFavorited(true);
    }
  }, [recipeId]);

  return { isFavorited, toggleFavorite };
};

const FavoritesButton = ({
  recipeId,
  isFavorited: initialIsFavorited,
  onFavoriteToggle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isFavorited, toggleFavorite } = useFavorites(initialIsFavorited, recipeId);

  const handleToggle = async () => {
    if (isFavorited) {
      setIsModalOpen(true);
      return;
    }

    const success = await toggleFavorite();
    if (success) {
      onFavoriteToggle(
        true,
        isFavorited ? "Recipe removed from favorites!" : "Recipe added to favorites!"
      );
    }
  };

  const handleConfirmRemove = async () => {
    const success = await toggleFavorite();
    setIsModalOpen(false);

    if (success) {
      onFavoriteToggle(
        true,
        "Recipe removed from favorites!"
      );
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-all duration-300"
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          className={`w-6 h-6 ${isFavorited ? "text-red-500" : "text-gray-400"}`}
          fill={isFavorited ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove from Favorites"
        message="Are you sure you want to remove this recipe from your favorites?"
        confirmText="Remove"
        confirmClassName="bg-red-500 hover:bg-red-600 text-white"
      />
    </>
  );
};

export default FavoritesButton;