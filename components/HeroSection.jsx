"use client";

import Image from "next/image";

/**
 * Renders the HeroSection component.
 * 
 * This component serves as the introductory section of the page with a full-screen
 * background image, text content, and buttons that provide smooth scrolling functionality
 * to a specified section on the page.
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
    <div className="h-screen">
      <div className="relative h-screen w-full overflow-hidden shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero_section1.jpg"
            alt="Culinary background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C3B2E]/80 via-[#6d977312]/85 to-[#ffbb0000]/45" />
        </div>

        {/* Content Container */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
                Culinary Haven: Online Recipes
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
                Browse through our collection of delicious recipes. Find
                everything from quick weeknight dinners to gourmet dishes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToRecipes}
                  className="px-8 py-3 bg-[#FFBA00] hover:bg-[#FFBA00]/90 text-[#0C3B2E] font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Explore Recipes
                </button>
                <button
                  onClick={scrollToRecipes}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                >
                  View Collections
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0C3B2E] to-transparent" />
      </div>
    </div>
  );
};

export default HeroSection;