import { useState } from "react";

export default function FavoritesButton({ onFavoriteToggle, isFavorite = false, recipeId }) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleClick = () => {
    setFavorite(!favorite); // Toggle the favorite state
    onFavoriteToggle(recipeId, !favorite); // Pass updated favorite status to parent
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-[#333333] shadow-lg transition-transform duration-300 ${
        favorite ? "text-red-500" : "text-gray-400"
      }`}
      aria-label="Favorite"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          d={
            favorite
              ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              : "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm0 15.16l-.09.08c-4.27 3.97-7.9 7.04-7.9 7.04S4.9 15.87 4.9 12.24C4.9 9.68 6.83 8.1 8.25 8.1c1.44 0 2.75 1.6 4.5 4.04 1.75-2.44 3.06-4.04 4.5-4.04 1.42 0 3.35 1.58 3.35 4.14 0 3.62-3.44 7.54-7.9 11.07z"
          }
        />
      </svg>
    </button>
  );
}
