"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Responsive Recipe Carousel Component
 * Displays a dynamic, animated carousel of recommended recipes
 * with responsive design and navigation controls
 *
 * @component
 * @returns {React.ReactElement} Rendered recipe carousel
 */
const ResponsiveRecipeCarousel = () => {
  /**
   * State to store all fetched recipes
   * @type {Array}
   */
  const [recipes, setRecipes] = useState([]);

  /**
   * Current index of the carousel
   * @type {number}
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Recipes currently visible in the carousel
   * @type {Array}
   */
  const [visibleRecipes, setVisibleRecipes] = useState([]);

  /**
   * Direction of carousel navigation (1 for next, -1 for previous)
   * @type {number}
   */
  const [direction, setDirection] = useState(0);

  /**
   * Next.js router for navigation
   * @type {Object}
   */
  const router = useRouter();

  /**
   * Fetches recommended recipes from the API on component mount
   * Sets the recipes in the state and handles potential errors
   *
   * @async
   * @function fetchRecipes
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
   * Navigates to the detailed page of a specific recipe
   *
   * @param {string} recipeId - The unique identifier of the recipe
   */
  const navigateToRecipeDetails = (recipeId) => {
    router.push(`/recipes/${recipeId}`);
  };

  /**
   * Moves to the next slide in the carousel
   * Cycles through recipes in a circular manner
   */
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  /**
   * Moves to the previous slide in the carousel
   * Cycles through recipes in a circular manner
   */
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recipes.length - 1 : prevIndex - 1
    );
  };

  /**
   * Handles responsive recipe display based on screen width
   * Dynamically adjusts number of visible recipes
   */
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let visibleCount = 5;

      // Responsive breakpoints for number of visible recipes
      if (screenWidth < 640) {
        visibleCount = 1;
      } else if (screenWidth < 768) {
        visibleCount = 2;
      } else if (screenWidth < 1024) {
        visibleCount = 3;
      } else if (screenWidth < 1280) {
        visibleCount = 4;
      }

      // Calculate visible recipes with wraparound
      setVisibleRecipes([
        ...recipes.slice(currentIndex, currentIndex + visibleCount),
        ...recipes.slice(
          0,
          Math.max(0, currentIndex + visibleCount - recipes.length)
        ),
      ]);
    };

    // Add and clean up resize event listener
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [recipes, currentIndex]);

  /**
   * Animation variants for individual recipe cards
   * Controls scale, opacity, and position during transitions
   *
   * @type {Object}
   */
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

  /**
   * Animation variants for the entire carousel container
   * Controls opacity and staggered animation of child elements
   *
   * @type {Object}
   */
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
      {/* Section Title with Animated Entrance */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-10 dark:text-white text-center tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
      >
        Discover Culinary Inspirations
      </motion.h2>

      <div className="relative">
        {/* Animated Carousel Container */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center space-x-6"
          >
            {/* Individual Recipe Cards */}
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
                {/* Recipe Card Design */}
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

        {/* Navigation Controls */}
        {recipes.length > visibleRecipes.length && (
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
