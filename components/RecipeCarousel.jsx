"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      className="w-full max-w-5xl mx-auto my-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-2xl font-bold mb-4">Recommended Recipes</h2>
      <div className="relative overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out">
          {visibleRecipes.map((recipe, index) => (
            <div
              key={recipe._id || index} // Use index as fallback to avoid key warning
              className="w-1/5 p-2 cursor-pointer"
              onClick={() => navigateToRecipeDetails(recipe._id)}
            >
              <div className="bg-gray-200 rounded-lg flex flex-col h-full">
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={recipe.images[0]}
                    alt={recipe.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-b-lg h-24">
                  <h3 className="text-lg font-semibold text-center">
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
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full opacity-75 hover:opacity-100"
            >
              ◀
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full opacity-75 hover:opacity-100"
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
