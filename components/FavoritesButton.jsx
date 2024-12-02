"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

const FavoritesButton = ({
  recipeId,
  initialIsFavorited = false,
  onFavoriteToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Update favorited state when initial prop changes
  useEffect(() => {
    setIsFavorited(initialIsFavorited);
  }, [initialIsFavorited, pathname]);

  // Trigger favorite toggle
  const handleToggle = async () => {
    if (!session) {
      // Redirect to sign-in page if user is not logged in
      router.push("/auth/signin");
      return;
    }

    if (isFavorited) {
      // If the recipe is already favorited, show confirmation modal to remove
      setIsOpen(true);
      return;
    }

    // If not favorited, toggle the favorite status
    await toggleFavorite();
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    try {
      const response = await fetch("/api/favorites", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      });

      if (response.ok) {
        const newFavoritedState = !isFavorited;
        setIsFavorited(newFavoritedState);

        // Custom event for cross-component communication
        window.dispatchEvent(
          new CustomEvent("favoritesUpdated", {
            detail: {
              recipeId,
              isFavorited: newFavoritedState,
            },
          })
        );

        onFavoriteToggle(
          true,
          newFavoritedState
            ? "Recipe added to favorites!"
            : "Recipe removed from favorites!"
        );
      } else {
        throw new Error("Failed to update favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      onFavoriteToggle(false, "Failed to update favorites. Please try again.");
    }
  };

  // Confirm removal of favorite
  const confirmRemove = async () => {
    await toggleFavorite();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-all duration-300"
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          className={`w-6 h-6 ${
            isFavorited ? "text-red-500" : "text-gray-400"
          }`}
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

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Remove from Favorites?</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove this recipe from your favorites?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FavoritesButton;
