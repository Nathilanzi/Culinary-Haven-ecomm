"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const RecipeCarousel = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recommended");
        const data = await response.json();
        setRecipes(data.recipes);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  const navigateToRecipeDetails = (recipeId) => {
    router.push(`/recipes/${recipeId}`);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recipes.length - 1 : prevIndex - 1
    );
  };

  const visibleRecipes = [
    ...recipes.slice(currentIndex, currentIndex + 5),
    ...recipes.slice(0, Math.max(0, currentIndex + 5 - recipes.length)),
  ];

  return (
    <div
      className="w-full max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-2xl font-bold mb-4">Recommended Recipes</h2>
      <div className="relative overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out gap-4">
          {visibleRecipes.map((recipe, index) => (
            <div
              key={recipe._id || index} // Use index as fallback to avoid key warning
              className="flex-1 sm:flex-none sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 cursor-pointer"
              onClick={() => navigateToRecipeDetails(recipe._id)}
            >
              <div className="bg-gray-100 rounded-lg flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 sm:h-40 lg:h-52 w-full overflow-hidden">
                  <img
                    src={recipe.images[0]}
                    alt={recipe.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-b-lg h-32">
                  <h3 className="text-lg font-semibold text-center line-clamp-2">
                    {recipe.title}
                  </h3>
                  <p className="text-yellow-500 text-sm">
                    ⭐ {recipe.averageRating ? recipe.averageRating.toFixed(1) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isHovered && recipes.length > 5 && (
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-4">
            <button
              onClick={prevSlide}
              className="bg-gray-100 p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="bg-gray-100 p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCarousel;