"use client";

import { useState, useRef, useEffect } from "react";

/**
 * SVG icon for filter functionality
 * @returns {JSX.Element} Filter icon as an SVG component
 */
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
    {/* Polygon points defining the filter icon shape */}
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

/**
 * SVG icon for closing or removing items
 * @returns {JSX.Element} X icon as an SVG component
 */
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
    {/* Two lines crossing to create an X shape */}
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

/**
 * SVG icon for checkmarks or selection
 * @returns {JSX.Element} Check icon as an SVG component
 */
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
    {/* Polyline points creating a checkmark shape */}
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

/**
 * Ingredients Filter Component
 * Allows users to filter recipes by selecting and matching ingredients
 *
 * @param {Object} props - Component properties
 * @param {string[]} props.availableIngredients - List of ingredients that can be selected
 * @param {URLSearchParams} props.searchParams - Current URL search parameters
 * @param {Function} props.updateUrl - Function to update URL with new search parameters
 * @param {Object} [props.defaultValues] - Default filter values
 * @param {string[]} [props.defaultValues.ingredients] - Default selected ingredients
 * @param {string} [props.defaultValues.ingredientMatchType] - Default ingredient matching type
 * @param {Object[]} [props.recipes] - List of recipes to check against filters
 * @returns {JSX.Element} Ingredients filter dropdown component
 */
export default function IngredientsFilter({
  availableIngredients = [],
  searchParams,
  updateUrl,
  defaultValues = { ingredients: [], ingredientMatchType: "all" },
  recipes = [],
}) {
  // State to control dropdown open/closed
  const [isOpen, setIsOpen] = useState(false);

  // Reference to dropdown container for outside click detection
  const dropdownRef = useRef(null);

  // Extract current ingredients and match type from search parameters
  const currentIngredients = searchParams.getAll("ingredients[]");
  const currentMatchType =
    searchParams.get("ingredientMatchType") ||
    defaultValues.ingredientMatchType;

  /**
   * Effect to handle closing dropdown when clicking outside
   */
  useEffect(() => {
    // Function to detect clicks outside the dropdown
    function handleClickOutside(event) {
      // Close dropdown if click is outside the dropdown container
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Add event listener for mousedown
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Handles ingredient selection/deselection
   * @param {string} ingredient - Ingredient to toggle
   */
  const handleIngredientClick = (ingredient) => {
    // Toggle ingredient in the list
    const newIngredients = currentIngredients.includes(ingredient)
      ? currentIngredients.filter((i) => i !== ingredient)
      : [...currentIngredients, ingredient];

    // Prepare URL updates
    const updates = {
      "ingredients[]": newIngredients,
      ingredientMatchType:
        currentMatchType !== defaultValues.ingredientMatchType
          ? currentMatchType
          : null,
    };

    // Clear match type if no ingredients selected
    if (newIngredients.length === 0) {
      updates.ingredientMatchType = null;
    }

    // Update URL with new parameters
    updateUrl(updates);
  };

  /**
   * Handles changing the ingredient matching type
   * @param {string} newMatchType - New matching type ('all' or 'any')
   */
  const handleMatchTypeChange = (newMatchType) => {
    // Update URL if ingredients are selected or match type differs from default
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

  /**
   * Clears all selected ingredients
   */
  const clearAllIngredients = () => {
    // Reset to default values
    updateUrl({
      "ingredients[]": defaultValues.ingredients,
      ingredientMatchType: null,
    });
    // Close dropdown
    setIsOpen(false);
  };

  // Check if no recipes match current ingredient filter
  const noRecipesFound = currentIngredients.length > 0 && recipes.length === 0;

  return (
    // Dropdown container with outside click detection
    <div className="relative w-full" ref={dropdownRef}>
      {/* Label for accessibility */}
      <label
        htmlFor="ingredients"
        className="block text-sm font-semibold text-gray-700 dark:text-gray-100 mb-2 select-none"
      >
        Filter by Ingredients
      </label>

      {/* Dropdown trigger button */}
      <button
        id="ingredients"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-14 py-2.5 
        w-full max-w-[300px]
        bg-white border border-gray-200 rounded-xl 
        hover:bg-gray-50 hover:shadow-md 
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-teal-500/50
        text-gray-800 font-medium"
      >
        {/* Filter icon */}
        <FilterIcon />
        <span>Filters</span>

        {/* Badge showing number of selected ingredients */}
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

      {/* Dropdown content - rendered only when open */}
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
            {/* Dropdown header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Filter Recipes by Ingredients
              </h3>
              {/* Clear all button - shown only when ingredients are selected */}
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

            {/* Ingredient matching type selection */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Ingredient Matching
              </p>
              <div className="flex gap-4">
                {/* Radio buttons for 'all' or 'any' matching */}
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
                      {/* Custom checkmark for radio button */}
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

            {/* Available ingredients selection */}
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
                {/* Grid of ingredient selection buttons */}
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
                      {/* Show check icon for selected ingredients */}
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
