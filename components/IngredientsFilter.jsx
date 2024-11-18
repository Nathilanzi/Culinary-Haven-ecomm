"use client";

import { useState, useRef, useEffect } from "react";

// SVG Icons as inline components
const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-600"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function IngredientsFilter({
  availableIngredients = [],
  searchParams,
  updateUrl,
  defaultValues = { ingredients: [], ingredientMatchType: "all" },
  recipes = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentIngredients = searchParams.getAll("ingredients[]");
  const currentMatchType =
    searchParams.get("ingredientMatchType") ||
    defaultValues.ingredientMatchType;

  // Outside click effect
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ingredient click handler
  const handleIngredientClick = (ingredient) => {
    const newIngredients = currentIngredients.includes(ingredient)
      ? currentIngredients.filter((i) => i !== ingredient)
      : [...currentIngredients, ingredient];

    const updates = {
      "ingredients[]": newIngredients,
      ingredientMatchType:
        currentMatchType !== defaultValues.ingredientMatchType
          ? currentMatchType
          : null,
    };

    if (newIngredients.length === 0) {
      updates.ingredientMatchType = null;
    }

    updateUrl(updates);
  };

  // Match type change handler
  const handleMatchTypeChange = (newMatchType) => {
    if (
      currentIngredients.length > 0 ||
      newMatchType !== defaultValues.ingredientMatchType
    ) {
      updateUrl({
        "ingredients[]": currentIngredients,
        ingredientMatchType: newMatchType,
      });
    }
  };

  // Clear all ingredients
  const clearAllIngredients = () => {
    updateUrl({
      "ingredients[]": defaultValues.ingredients,
      ingredientMatchType: null,
    });
    setIsOpen(false);
  };

  const noRecipesFound = currentIngredients.length > 0 && recipes.length === 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label
        htmlFor="ingredients"
        className="block text-sm font-semibold text-gray-700 mb-2 select-none"
      >
        Filter by Ingredients
      </label>

      {/* Trigger Button with Elegant Design */}
      <button
        id="ingredients"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-14 py-2.5 
        w-full max-w-[500px]
        bg-white border border-gray-200 rounded-xl 
        hover:bg-gray-50 hover:shadow-md 
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        text-gray-800 font-medium"
      >
        <FilterIcon />
        <span>Filters</span>

        {currentIngredients.length > 0 && (
          <span
            className="ml-2 px-2.5 py-0.5 
            bg-blue-500 text-white rounded-full 
            text-xs font-bold tracking-tight"
          >
            {currentIngredients.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`
            w-full max-w-[400px] mx-auto
            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            z-50 
            bg-white rounded-2xl 
            shadow-2xl border border-gray-200 
            overflow-hidden
            transform transition-all 
            duration-400 ease-elegant
            max-h-[90vh] overflow-y-auto`}
        >
          <div className="p-6 space-y-6">
            {/* Header with Refined Styling */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Filter Recipes by Ingredients
              </h3>
              {currentIngredients.length > 0 && (
                <button
                  onClick={clearAllIngredients}
                  className="flex items-center gap-2 
                    text-sm text-gray-500 hover:text-gray-800 
                    transition-colors duration-200 
                    hover:bg-gray-100 px-2.5 py-1.5 rounded-lg"
                >
                  <XIcon />
                  Clear All
                </button>
              )}
            </div>

            {/* Match Type Section with Enhanced Design */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Ingredient Matching
              </p>
              <div className="flex gap-4">
                {["all", "any"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative">
                      <input
                        type="radio"
                        name="ingredientMatchType"
                        value={type}
                        checked={currentMatchType === type}
                        onChange={(e) => handleMatchTypeChange(e.target.value)}
                        className="w-5 h-5 text-blue-600 
                          border-gray-300 focus:ring-blue-500 
                          rounded-full appearance-none 
                          border-2 checked:border-blue-600"
                      />
                      {currentMatchType === type && (
                        <CheckIcon
                          className="absolute top-1/2 left-1/2 transform 
                          -translate-x-1/2 -translate-y-1/2 
                          w-3 h-3 text-blue-600"
                        />
                      )}
                    </div>
                    <span
                      className="text-sm text-gray-600 
                        group-hover:text-gray-900 
                        capitalize transition-colors duration-200"
                    >
                      {type} ingredients
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ingredients Section with Improved Layout */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Available Ingredients
              </p>
              <div
                className="max-h-64 overflow-y-auto pr-2 
                  scrollbar-thin scrollbar-thumb-gray-300 
                  scrollbar-track-gray-100 
                  scrollbar-thumb-rounded-full"
              >
                <div className="grid grid-cols-2 gap-2.5">
                  {availableIngredients.map((ingredient) => (
                    <button
                      key={ingredient}
                      onClick={() => handleIngredientClick(ingredient)}
                      className={`px-4 py-2 rounded-lg text-sm
                              transition-all duration-200 font-medium
                              flex items-center justify-between
                              ${
                    currentIngredients.includes(ingredient)
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                    >
                      <span>{ingredient}</span>
                      {currentIngredients.includes(ingredient) && <CheckIcon />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
