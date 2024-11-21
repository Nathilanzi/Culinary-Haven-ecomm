"use client";

import { useState, useRef, useEffect } from "react";

/**
 * SVG Icon for Filter
 * @returns {JSX.Element} Filter icon as an SVG
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

/**
 * SVG Icon for Close/X
 * @returns {JSX.Element} X icon as an SVG
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

/**
 * SVG Icon for Checkmark
 * @returns {JSX.Element} Check icon as an SVG
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
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

/**
 * TagFilter component for filtering recipes by tags
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string[]} [props.availableTags=[]] - List of available tags
 * @param {URLSearchParams} props.searchParams - Current URL search parameters
 * @param {function} props.updateUrl - Function to update URL with new parameters
 * @param {Object} [props.defaultValues={tags: [], tagMatchType: "all"}] - Default filter values
 * @param {Object[]} [props.recipes=[]] - List of recipes for additional context
 *
 * @returns {React.ReactElement} Rendered tag filter component
 */
export default function TagFilter({
  availableTags = [],
  searchParams,
  updateUrl,
  defaultValues = { tags: [], tagMatchType: "all" },
  recipes = [],
}) {
  // State for dropdown visibility
  const [isOpen, setIsOpen] = useState(false);
  // Ref for dropdown to handle outside clicks
  const dropdownRef = useRef(null);

  // Extract current tags and match type from search parameters
  const currentTags = searchParams.getAll("tags[]");
  const currentMatchType =
    searchParams.get("tagMatchType") || defaultValues.tagMatchType;

  // Effect to handle closing dropdown when clicking outside
  useEffect(() => {
    /**
     * Handles click outside of dropdown
     * @param {MouseEvent} event - Click event
     */
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Add and remove event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Handles tag selection/deselection
   * @param {string} tag - Selected tag
   */
  const handleTagClick = (tag) => {
    // Toggle tag in current tags
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    // Prepare updates for URL
    const updates = {
      "tags[]": newTags,
      tagMatchType:
        currentMatchType !== defaultValues.tagMatchType
          ? currentMatchType
          : null,
    };

    // Clear tagMatchType if no tags selected
    if (newTags.length === 0) {
      updates.tagMatchType = null;
    }

    // Update URL with new parameters
    updateUrl(updates);
  };

  /**
   * Handles changing tag match type (all/any)
   * @param {string} newMatchType - New match type ('all' or 'any')
   */
  const handleMatchTypeChange = (newMatchType) => {
    // Only update if tags exist or match type is different from default
    if (currentTags.length > 0 || newMatchType !== defaultValues.tagMatchType) {
      updateUrl({
        "tags[]": currentTags,
        tagMatchType: newMatchType,
      });
    }
  };

  /**
   * Clears all selected tags
   */
  const clearAllTags = () => {
    // Reset tags and match type
    updateUrl({
      "tags[]": defaultValues.tags,
      tagMatchType: null,
    });
    setIsOpen(false);
  };

  // Check if no recipes match current tag filters
  const noRecipesFound = currentTags.length > 0 && recipes.length === 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Label for accessibility */}
      <label
        htmlFor="tags"
        className="block text-sm font-semibold text-gray-700 dark:text-gray-100 mb-2 select-none"
      >
        Filter by Tags
      </label>

      {/* Dropdown Trigger Button */}
      <button
        id="tags"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-14 py-2.5 
        w-full max-w-[300px]
        bg-white border border-gray-200 rounded-xl 
        hover:bg-gray-50 hover:shadow-md 
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-teal-500/50
        text-gray-800 font-medium"
      >
        <FilterIcon />
        <span>Filters</span>

        {/* Tag count badge */}
        {currentTags.length > 0 && (
          <span
            className="ml-2 px-2.5 py-0.5 
            bg-blue-500 text-white rounded-full 
            text-xs font-bold tracking-tight"
          >
            {currentTags.length}
          </span>
        )}
      </button>

      {/* Dropdown Content */}
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
            {/* Dropdown Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Filter Recipes
              </h3>
              {/* Clear All Tags Button */}
              {currentTags.length > 0 && (
                <button
                  onClick={clearAllTags}
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

            {/* Tag Match Type Selection */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Tag Matching
              </p>
              <div className="flex gap-4">
                {/* Radio buttons for match type */}
                {["all", "any"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative">
                      <input
                        type="radio"
                        name="tagMatchType"
                        value={type}
                        checked={currentMatchType === type}
                        onChange={(e) => handleMatchTypeChange(e.target.value)}
                        className="w-5 h-5 text-blue-600 
                          border-gray-300 focus:ring-blue-500 
                          rounded-full appearance-none 
                          border-2 checked:border-blue-600"
                      />
                      {/* Checkmark for selected match type */}
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
                      {type} tags
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Available Tags Section */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Available Tags
              </p>
              <div
                className="max-h-64 overflow-y-auto pr-2 
                  scrollbar-thin scrollbar-thumb-gray-300 
                  scrollbar-track-gray-100 
                  scrollbar-thumb-rounded-full"
              >
                {/* Grid of tag buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-4 py-2 rounded-lg text-sm
                              transition-all duration-200 font-medium
                              flex items-center justify-between
                              ${
                                currentTags.includes(tag)
                                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                              }`}
                    >
                      <span>{tag}</span>
                      {/* Show check icon for selected tags */}
                      {currentTags.includes(tag) && <CheckIcon />}
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
