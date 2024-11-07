"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RecipeCarousel = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const visibleRecipes = recipes.slice(currentIndex, currentIndex + 5);

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
      </div>
    </div>
  );
};

export default RecipeCarousel;
