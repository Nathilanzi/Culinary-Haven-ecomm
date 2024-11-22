/**
 * ResponsiveRecipeCarousel Component
 *
 * This component displays a dynamic, animated carousel of recommended recipes with a responsive design.
 * It includes navigation controls for moving through recipes and adjusts the number of visible recipes
 * based on the screen size.
 *
 * It fetches recommended recipes from an API, handles loading states, and applies animations for a smooth
 * transition when navigating through the carousel. Additionally, it provides a button to navigate to the
 * detailed recipe page for each recommended recipe.
 *
 * The carousel is interactive with left and right navigation buttons, and it adapts to various screen
 * sizes with different numbers of visible recipes.
 *
 * @component
 * @returns {React.ReactElement} Rendered recipe carousel
 */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Responsive Recipe Carousel Component
 * Displays a dynamic, animated carousel of recommended recipes
 * with responsive design and navigation controls.
 *
 * @component
 * @returns {React.ReactElement} Rendered recipe carousel.
 */
const ResponsiveRecipeCarousel = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const [skeletonCount, setSkeletonCount] = useState(5); // Responsive skeleton count
  const router = useRouter();

  /**
   * Fetch recommended recipes from the API and update state.
   */
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recommended");
        const data = await response.json();
        setRecipes(data.recipes);
        setLoading(false); // Stop loading after fetching recipes
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };
    fetchRecipes();
  }, []);

  /**
   * Navigate to the details page for a specific recipe.
   *
   * @param {string} recipeId - The ID of the recipe to navigate to.
   */
  const navigateToRecipeDetails = (recipeId) => {
    router.push(`/recipes/${recipeId}`);
  };

  /**
   * Handle navigating to the next slide in the carousel.
   */
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  /**
   * Handle navigating to the previous slide in the carousel.
   */
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recipes.length - 1 : prevIndex - 1
    );
  };

  /**
   * Update the number of skeletons and visible recipes based on screen size.
   */
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let visibleCount = 5;

      if (screenWidth < 640) {
        visibleCount = 1;
      } else if (screenWidth < 768) {
        visibleCount = 2;
      } else if (screenWidth < 1024) {
        visibleCount = 3;
      } else if (screenWidth < 1280) {
        visibleCount = 4;
      }

      setSkeletonCount(visibleCount); // Update skeleton count for loading state
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

  /**
   * Render skeleton cards for loading state, responsive to device screen size.
   *
   * @returns {JSX.Element[]} Array of skeleton card elements.
   */
  const renderSkeletonCards = () => {
    return Array.from({ length: skeletonCount }).map((_, index) => (
      <div
        key={index}
        className="flex-1 max-w-[220px] w-full bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
      >
        <div className="h-48 w-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 w-16"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 w-24 rounded-full"></div>
          </div>
        </div>
      </div>
    ));
  };

  const cardVariants = {
    initial: (direction) => ({
      scale: 0.8,
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    animate: {
      scale: 1,
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: (direction) => ({
      scale: 0.8,
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-10 dark:text-white text-center tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
      >
        Discover Culinary Inspirations
      </motion.h2>

      <div className="relative">
        {loading ? (
          <div className="flex justify-center space-x-6">
            {renderSkeletonCards()}
          </div>
        ) : (
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center space-x-6"
            >
              {visibleRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id || index}
                  custom={direction}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 max-w-[220px] w-full"
                  whileHover={{
                    scale: 1.05,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={recipe.images[0]}
                        alt={recipe.title}
                        fill
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 bg-white dark:bg-[#1E1E1E]">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 line-clamp-2 h-12">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-500 font-bold">
                          ⭐{" "}
                          {recipe.averageRating
                            ? recipe.averageRating.toFixed(1)
                            : "N/A"}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigateToRecipeDetails(recipe._id)}
                          className="px-3 py-1 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full text-sm hover:opacity-90 transition-opacity"
                        >
                          View Recipe
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {recipes.length > visibleRecipes.length && !loading && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="absolute top-1/2 left-0 bg-white/70 dark:bg-[#333333]/70 p-3 rounded-full hover:bg-white/90 dark:hover:bg-[#333333]/90 transition-all"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-700 dark:text-[#A3C9A7]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="absolute top-1/2 right-0 bg-white/70 dark:bg-[#333333]/70 p-3 rounded-full hover:bg-white/90 dark:hover:bg-[#333333]/90 transition-all"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-700 dark:text-[#A3C9A7]" />
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ResponsiveRecipeCarousel;
