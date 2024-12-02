"use client";

// Importing necessary React hooks, routing, icons, and animation libraries
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Responsive Recipe Carousel Component
 *
 * Displays a dynamic, animated carousel of recommended recipes
 * with responsive design and loading states.
 *
 * @component
 * @returns {React.ReactElement} Rendered recipe carousel
 */
const ResponsiveRecipeCarousel = () => {
  // State variables to manage recipes, carousel navigation, and UI
  const [recipes, setRecipes] = useState([]); // Stores all fetched recipes
  const [currentIndex, setCurrentIndex] = useState(0); // Current carousel index
  const [visibleRecipes, setVisibleRecipes] = useState([]); // Recipes currently displayed
  const [direction, setDirection] = useState(0); // Carousel navigation direction
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const [skeletonCount, setSkeletonCount] = useState(5); // Number of skeleton cards to show
  const router = useRouter(); // Next.js router for navigation

  /**
   * Fetch recommended recipes from the API
   * Sets the recipes in state and updates loading status
   *
   * @async
   * @function fetchRecipes
   * @throws {Error} If recipe fetching fails
   */
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Send request to recommended recipes API endpoint
        const response = await fetch("/api/recommended");
        const data = await response.json();
        // Update recipes state with fetched data
        setRecipes(data.recipes);
      } catch (error) {
        // Log any errors during recipe fetching
        console.error("Failed to fetch recipes:", error);
      } finally {
        // Mark loading as complete regardless of success/failure
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []); // Empty dependency array means this runs once on component mount

  /**
   * Navigate to specific recipe details page
   *
   * @param {string} recipeId - Unique identifier of the selected recipe
   */
  const navigateToRecipeDetails = (recipeId) => {
    // Use Next.js router to navigate to recipe details page
    router.push(`/recipes/${recipeId}`);
  };

  /**
   * Move to the next slide in the carousel
   * Cycles through recipes in a circular manner
   */
  const nextSlide = () => {
    // Set direction to forward (1)
    setDirection(1);
    // Update current index, wrapping around to start if at end
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  /**
   * Move to the previous slide in the carousel
   * Cycles through recipes in a circular manner
   */
  const prevSlide = () => {
    // Set direction to backward (-1)
    setDirection(-1);
    // Update current index, wrapping around to end if at start
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recipes.length - 1 : prevIndex - 1
    );
  };

  /**
   * Dynamically adjust visible recipes based on screen width
   * Updates skeleton count and visible recipes array
   */
  useEffect(() => {
    const handleResize = () => {
      // Determine number of visible recipes based on screen width
      const screenWidth = window.innerWidth;
      let visibleCount = 5; // Default to 5 for large screens

      // Adjust visible count for different screen sizes
      if (screenWidth < 640) visibleCount = 1;
      else if (screenWidth < 768) visibleCount = 2;
      else if (screenWidth < 1024) visibleCount = 3;
      else if (screenWidth < 1280) visibleCount = 4;

      // Update skeleton count to match visible recipes
      setSkeletonCount(visibleCount);

      // Slice recipes to create circular carousel effect
      setVisibleRecipes([
        ...recipes.slice(currentIndex, currentIndex + visibleCount),
        ...recipes.slice(
          0,
          Math.max(0, currentIndex + visibleCount - recipes.length)
        ),
      ]);
    };

    // Add and remove resize event listener
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener("resize", handleResize);
  }, [recipes, currentIndex]); // Re-run when recipes or current index change

  /**
   * Render skeleton loading cards
   *
   * @returns {React.ReactElement[]} Array of skeleton card elements
   */
  const renderSkeletonCards = () => {
    // Create array of skeleton cards based on screen size
    return Array.from({ length: skeletonCount }).map((_, index) => (
      // Animated skeleton card with loading pulse effect
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: index * 0.2, // Staggered animation
        }}
        className="flex-1 max-w-[220px] w-full bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
      >
        {/* Skeleton image and text placeholders */}
        <div className="h-48 w-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 w-16"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 w-24 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    ));
  };

  // Animation variants for card entrance/exit
  const cardVariants = {
    initial: (direction) => ({
      scale: 0.8,
      opacity: 0,
      x: direction > 0 ? 100 : -100, // Different initial positions based on direction
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
      x: direction > 0 ? -100 : 100, // Different exit positions
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  // Container animation variants for staggered child animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2, // Slight delay between child animations
      },
    },
  };

  return (
    // Main container with entrance animation
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Animated title with gradient */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-10 dark:text-white text-center tracking-tight text-gray-700 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
      >
        Discover Culinary Inspirations
      </motion.h2>

      <div className="relative">
        {/* Conditional rendering: loading skeletons or recipe cards */}
        {loading ? (
          <div className="flex justify-center space-x-6">
            {renderSkeletonCards()}
          </div>
        ) : (
          // Animated recipe carousel
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center space-x-6"
            >
              {/* Render visible recipes with animations */}
              {visibleRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id || index}
                  custom={direction}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 max-w-[220px] w-full"
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
                    <div className="p-4 bg-white dark:bg-gray-700">
                      <h3 className="text-lg font-semibold mb-4 text-[#6D9773] dark:text-slate-300 line-clamp-2 h-12">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-500 font-bold">
                          ⭐{" "}
                          {recipe.averageRating
                            ? recipe.averageRating.toFixed(1)
                            : "N/A"}
                        </span>
                        {/* Recipe details navigation button */}
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

        {/* Previous and Next navigation buttons */}
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
