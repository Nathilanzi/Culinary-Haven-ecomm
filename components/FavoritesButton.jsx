import { useState } from 'react';
import { useSession } from 'next-auth/react';
import router from 'next/router';

const FavoritesButton = ({ recipeId, isFavorited, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const handleToggle = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (isFavorited) {
      setIsOpen(true);
      return;
    }

    await toggleFavorite();
  };

  const toggleFavorite = async () => {
    try {
      const response = await fetch('/api/favorites', {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': session.user.id
        },
        body: JSON.stringify({ recipeId })
      });

      if (response.ok) {
        window.dispatchEvent(new Event('favoritesUpdated'));

        if (onToggle) {
          onToggle(recipeId, !isFavorited);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

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
          className={`w-6 h-6 ${isFavorited ? 'text-red-500' : 'text-gray-400'}`}
          fill={isFavorited ? 'currentColor' : 'none'}
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

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Remove from Favorites?</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to remove this recipe from your favorites?</p>
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
