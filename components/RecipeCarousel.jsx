"use client";
import { useEffect, useState } from 'react';

const RecipeCarousel = () => {
  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  // Placeholder data (10 dummy recipes)
  const placeholderRecipes = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Recipe Placeholder ${i + 1}`,
    description: 'This is a placeholder description for a recipe.',
  }));

  // Initial visible recipes - first five items
  useEffect(() => {
    setVisibleRecipes(placeholderRecipes.slice(0, 5));
  }, [placeholderRecipes]);

  // Function to move to the next recipe
  const nextSlide = () => {
    setVisibleRecipes((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first]; // Move the first item to the end
    });
  };

  // Function to move to the previous recipe
  const prevSlide = () => {
    setVisibleRecipes((prev) => {
      const last = prev[prev.length - 1];
      return [last, ...prev.slice(0, -1)]; // Move the last item to the front
    });
  };

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 30000); // 30 seconds
    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  return (
    <div
      className="w-full max-w-5xl mx-auto my-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-2xl font-bold mb-4">Recommended Recipes</h2>
      <div className="relative">
        {/* Carousel container */}
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out">
            {visibleRecipes.map((recipe, index) => (
              <div key={recipe.id} className="w-1/5 p-2">
                <div className="bg-gray-200 rounded-lg p-4 h-48 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold">{recipe.title}</h3>
                  <p className="text-sm text-gray-600">{recipe.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation controls, visible only on hover */}
        {isHovered && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full"
            >
              ◀
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full"
            >
              ▶
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeCarousel;

