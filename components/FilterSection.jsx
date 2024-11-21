"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  Filter,
  X,
  ChevronDown,
  RefreshCcw,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import TagFilter from "@/components/TagFilters";
import NumberOfStepsFilter from "@/components/NumberOfStepsFilter";
import IngredientsFilter from "@/components/IngredientsFilter";
import CategoryFilter from "@/components/CategoryFilter";
import SortOrder from "@/components/SortOrder";

/**
 * Default filter values for resetting and initializing the component
 * @type {Object}
 */
const DEFAULT_VALUES = {
  category: "",
  sortBy: "$natural",
  order: "asc",
  search: "",
  numberOfSteps: "",
  tags: [],
  tagMatchType: "all",
};

/**
 * FilterSection component for managing recipe filters with advanced filtering options
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string[]} [props.categories=[]] - List of available recipe categories
 * @param {string} [props.initialCategory=""] - Initial selected category
 * @param {string} [props.initialSort="$natural"] - Initial sort method
 * @param {string} [props.initialOrder="asc"] - Initial sort order
 * @param {string[]} [props.availableTags=[]] - List of available tags for filtering
 * @param {string[]} [props.availableIngredients=[]] - List of available ingredients for filtering
 *
 * @returns {React.ReactElement} Rendered filter section component
 */
export default function FilterSection({
  categories = [],
  initialCategory = DEFAULT_VALUES.category,
  initialSort = DEFAULT_VALUES.sortBy,
  initialOrder = DEFAULT_VALUES.order,
  availableTags = [],
  availableIngredients = [],
}) {
  // Next.js navigation and routing hooks
  const router = useRouter(); // Hook for programmatic navigation
  const pathname = usePathname(); // Current page's pathname
  const searchParams = useSearchParams(); // Current URL search parameters

  // State for managing filter expansion and advanced filters
  const [isExpanded, setIsExpanded] = useState(false); // Controls overall filter section visibility
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false); // Controls advanced filters visibility

  // State for tracking current filter settings
  const [filterState, setFilterState] = useState({
    category: initialCategory,
    sortBy: initialSort,
    order: initialOrder,
    search: "",
    numberOfSteps: "",
  });

  /**
   * Updates the URL with new filter parameters
   * Handles adding, removing, and setting URL search parameters
   *
   * @param {Object} newParams - New parameters to update in the URL
   */
  const updateUrl = (newParams) => {
    // Create a new URLSearchParams instance from current search params
    const params = new URLSearchParams(searchParams.toString());

    // Process each new parameter
    Object.entries(newParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // For array values, remove existing and append all new values
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else if (value === DEFAULT_VALUES[key]) {
        // If value matches default, remove the parameter
        params.delete(key);
      } else if (value) {
        // If value exists, set the parameter
        params.set(key, value);
      } else {
        // If no value, remove the parameter
        params.delete(key);
      }
    });

    // Navigate to the updated URL
    router.push(`${pathname}?${params.toString()}`);
  };

  /**
   * Resets all filters to their default values
   * Clears filter state and navigates to the base pathname
   */
  const handleResetFilters = () => {
    setFilterState({
      category: DEFAULT_VALUES.category,
      sortBy: DEFAULT_VALUES.sortBy,
      order: DEFAULT_VALUES.order,
      search: DEFAULT_VALUES.search,
      numberOfSteps: DEFAULT_VALUES.numberOfSteps,
    });
    router.push(pathname);
  };

  /**
   * Memoized function to detect if any filters are currently active
   *
   * @returns {boolean} Whether any filters are currently applied
   */
  const isFilterActive = useMemo(() => {
    return (
      // Check if any filter state differs from default
      Object.entries(filterState).some(
        ([key, value]) => value !== DEFAULT_VALUES[key]
      ) ||
      // Also check if search params exist
      searchParams.toString() !== ""
    );
  }, [filterState, searchParams]);

  // Render the filter section
  return (
    <div className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 max-w-7xl mx-auto">
      {/* Filter Section Header */}
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-neutral-800 dark:to-teal-900 border-b border-neutral-100 dark:border-neutral-700">
        {/* Header content with title, active indicator, and expand/collapse button */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          {/* Left side: Filter title and icon */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center space-x-3">
              <Filter className="w-6 h-6 text-teal-600 dark:text-emerald-400" />
              <h2 className="text-lg font-semibold text-teal-800 dark:text-emerald-300">
                Recipe Filters
              </h2>
              {/* Active filters indicator */}
              {isFilterActive && (
                <span className="ml-2 px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded-full hidden sm:flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Active
                </span>
              )}
            </div>

            {/* Mobile expand/collapse button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-neutral-600 dark:text-neutral-300 hover:text-teal-600 dark:hover:text-emerald-400 transition-colors sm:hidden"
            >
              <ChevronDown
                className={`w-6 h-6 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Right side: Reset filters and desktop expand/collapse button */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-5 w-full sm:w-auto">
            {/* Reset filters button */}
            {isFilterActive && (
              <div className="flex justify-center sm:justify-end w-full">
                <button
                  onClick={handleResetFilters}
                  className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-sm w-full sm:w-auto"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Reset All</span>
                </button>
              </div>
            )}

            {/* Desktop expand/collapse button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block text-neutral-600 dark:text-neutral-300 hover:text-teal-600 dark:hover:text-emerald-400 transition-colors"
            >
              <ChevronDown
                className={`w-6 h-6 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Filters Section */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 bg-neutral-50 dark:bg-neutral-800">
          {/* Advanced Filters Toggle Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
              className="flex items-center space-x-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 px-4 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors w-full sm:w-auto justify-center"
            >
              <Sliders className="w-4 h-4" />
              <span>
                {isAdvancedFiltersOpen
                  ? "Hide Advanced Filters"
                  : "Show Advanced Filters"}
              </span>
            </button>
          </div>

          {/* Advanced Filters Content */}
          {isAdvancedFiltersOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Number of Steps Filter */}
              <NumberOfStepsFilter
                searchParams={searchParams}
                updateUrl={updateUrl}
              />
              {/* Tag Filter */}
              <TagFilter
                availableTags={availableTags}
                searchParams={searchParams}
                updateUrl={updateUrl}
              />
              {/* Ingredients Filter */}
              <IngredientsFilter
                availableIngredients={availableIngredients}
                searchParams={searchParams}
                updateUrl={updateUrl}
              />
              {/* No Filter Applied Message */}
              {!isFilterActive && (
                <div className="flex text-gray-500 dark:text-gray-100 text-sm italic mt-4">
                  No filter applied
                </div>
              )}
            </div>
          )}

          {/* Category and Sort Order Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-100 space-y-4 sm:space-y-0">
            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              currentCategory={filterState.category}
            />
            {/* Sort Order Filter */}
            <SortOrder
              currentSort={filterState.sortBy}
              currentOrder={filterState.order}
            />
          </div>
        </div>
      )}
    </div>
  );
}
