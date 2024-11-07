"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RecipeCarousel = () => {
  const [recipes, setRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Fetch high-rated recipes from API on load
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        const data = await response.json();
        setRecipes(data.recipes);
        setVisibleRecipes(data.recipes.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  // Function to navigate to recipe details on click
  const navigateToRecipeDetails = (recipeId) => {
    router.push(`/recipes/${recipeId}`);
  };

  // Move to the next recipe
  const nextSlide = () => {
    setVisibleRecipes((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  // Move to the previous recipe
  const prevSlide = () => {
    setVisibleRecipes((prev) => {
      const last = prev[prev.length - 1];
      return [last, ...prev.slice(0, -1)];
    });
  };

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto my-8">
  <h2 className="text-2xl font-bold mb-4">Recommended Recipes</h2>
  <div className="relative overflow-hidden">
    <div className="flex transition-transform duration-500 ease-in-out">
      {visibleRecipes.map((recipe) => (
        <div
          key={recipe._id}
          className="w-1/5 p-2 cursor-pointer"
          onClick={() => navigateToRecipeDetails(recipe._id)}
        >
          <div className="bg-gray-200 rounded-lg p-4 h-48 flex flex-col items-center justify-center">
            <img
              src={recipe.images[0]}
              alt={recipe.title}
              className="w-full h-24 object-cover rounded-lg"
            />
            <h3 className="text-lg font-semibold">{recipe.title}</h3>
            <p className="text-yellow-500 text-sm">
              ⭐ {recipe.averageRating ? recipe.averageRating.toFixed(1) : "N/A"}
            </p>
          </div>
        </div>
      ))}
    </div>

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
