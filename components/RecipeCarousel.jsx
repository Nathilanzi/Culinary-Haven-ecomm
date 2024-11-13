"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";

/**
 * Responsive RecipeCarousel component that displays a carousel of recommended recipes.
 * Fetches recipes from the server, shows them in a horizontally scrollable view,
 * and allows users to navigate between them. The carousel is responsive and
 * adjusts the number of visible recipes based on the screen size.
 * @component
 */
const ResponsiveRecipeCarousel = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const router = useRouter();

  /**
   * Fetch recommended recipes on component mount.
   */
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

  /**
   * Navigate to the recipe detail page.
   * @param {string} recipeId - The ID of the recipe to navigate to.
   */
  const navigateToRecipeDetails = (recipeId) => {
    router.push(`/recipes/${recipeId}`);
  };

  /**
   * Show the next set of recipes in the carousel.
   */
  const nextSlide = (event) => {
    event.preventDefault();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  /**
   * Show the previous set of recipes in the carousel.
   */
  const prevSlide = (event) => {
    event.preventDefault();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recipes.length - 1 : prevIndex - 1
    );
  };

  /**
   * Determine the number of visible recipes based on the screen size.
   */
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let visibleCount = 4;
      if (screenWidth < 640) {
        visibleCount = 1;
      } else if (screenWidth < 768) {
        visibleCount = 2;
      } else if (screenWidth < 1024) {
        visibleCount = 3;
      }
      setVisibleRecipes([
        ...recipes.slice(currentIndex, currentIndex + visibleCount),
        ...recipes.slice(
          0,
          Math.max(0, currentIndex + visibleCount - recipes.length)
        ),
      ]);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [recipes, currentIndex]);

  return (
    <div
      className="w-full max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-2xl font-bold mb-4 dark:text-white text-center">
        Recommended Recipes
      </h2>
      <div className="relative overflow-x-auto">
        <div className="flex justify-center transition-transform duration-500 ease-in-out gap-4">
          {visibleRecipes.map((recipe, index) => (
            <div
              key={recipe._id || index} // Use index as fallback to avoid key warning
              className="flex-1 sm:flex-none sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 cursor-pointer"
              onClick={() => navigateToRecipeDetails(recipe._id)}
            >
              <div className="bg-gray-100 rounded-lg flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-[#333333] dark:text-[#A3C9A7]">
                <div className="h-48 sm:h-40 lg:h-52 w-full overflow-hidden dark:bg-[#333333] dark:text-[#A3C9A7]">
                  <Image
                    src={recipe.images[0]}
                    alt={recipe.title}
                    className="w-full h-full object-cover rounded-t-lg"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-b-lg h-32 dark:bg-[#333333]">
                  <h3 className="text-lg font-semibold text-center line-clamp-2">
                    {recipe.title}
                  </h3>
                  <p className="text-yellow-500 text-sm">
                    ⭐{" "}
                    {recipe.averageRating
                      ? recipe.averageRating.toFixed(1)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isHovered && recipes.length > visibleRecipes.length && (
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-4">
            <button
              onClick={prevSlide}
              className="bg-gray-100 p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 dark:bg-[#333333] dark:hover:bg-[#444444]"
            >
              <ChevronLeftIcon className="h-6 w-6 dark:text-[#A3C9A7]" />
            </button>
            <button
              onClick={nextSlide}
              className="bg-gray-100 p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 dark:bg-[#333333] dark:hover:bg-[#444444]"
            >
              <ChevronRightIcon className="h-6 w-6 dark:text-[#A3C9A7]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveRecipeCarousel;
