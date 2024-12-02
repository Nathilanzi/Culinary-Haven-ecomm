"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDownToLine, BookOpen } from "lucide-react";

/**
 * Renders a modern and sophisticated HeroSection with responsive design
 * and elegant color transitions between light and dark modes.
 *
 * @component
 * @returns {JSX.Element} The rendered HeroSection component.
 */
const HeroSection = () => {
  /**
   * Scrolls to the "recipes-section" smoothly when invoked.
   */
  const scrollToRecipes = () => {
    const recipesSection = document.querySelector("#recipes-section");
    if (recipesSection) {
      recipesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden group">
      {/* Background Image with Modern Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/hero_section1.jpg"
          alt="Culinary Artistry Backdrop"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-r 
          from-teal-900/70 dark:from-slate-900/80 
          via-teal-700/50 dark:via-slate-800/60 
          to-teal-500/30 dark:to-slate-700/40"
        />
      </div>

      {/* Content Container with Elegant Typography */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 h-full flex items-center"
      >
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl space-y-6">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl 
              font-serif font-bold 
              text-teal-50 dark:text-slate-100 
              leading-tight 
              drop-shadow-lg"
            >
              Culinary Exploration Awaits
            </h1>
            <p
              className="text-lg sm:text-xl md:text-2xl 
              text-teal-100 dark:text-slate-300 
              mb-8 max-w-2xl 
              leading-relaxed"
            >
              Embark on a gastronomic journey through our meticulously curated
              recipe collections. From innovative weeknight meals to exquisite
              gourmet experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToRecipes}
                className="flex items-center gap-2 px-6 py-3 
                  bg-teal-600 dark:bg-slate-700 
                  hover:bg-teal-700 dark:hover:bg-slate-600 
                  text-white 
                  font-semibold 
                  rounded-xl 
                  transition-all 
                  shadow-md hover:shadow-lg"
              >
                <ArrowDownToLine className="w-5 h-5" />
                Explore Recipes
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToRecipes}
                className="flex items-center gap-2 px-6 py-3 
                  bg-teal-500/10 dark:bg-slate-500/10 
                  hover:bg-teal-500/20 dark:hover:bg-slate-500/20 
                  text-teal-50 dark:text-slate-100 
                  border border-teal-300/30 dark:border-slate-300/30 
                  font-semibold 
                  rounded-xl 
                  backdrop-blur-sm 
                  transition-all 
                  shadow-md hover:shadow-lg"
              >
                <BookOpen className="w-5 h-5" />
                View Collections
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subtle Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 
        bg-gradient-to-t 
        from-teal-900/80 dark:from-slate-900/90 
        to-transparent"
      />
    </div>
  );
};

export default HeroSection;
