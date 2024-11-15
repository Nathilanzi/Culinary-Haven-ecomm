"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import TagFilter from "@/components/TagFilters";
import NumberOfStepsFilter from "@/components/NumberOfStepsFilter";
import IngredientsFilter from "@/components/IngredientsFilter";
import CategoryFilter from "@/components/CategoryFilter";
import SortOrder from "@/components/SortOrder";

const DEFAULT_VALUES = {
  category: "",
  sortBy: "$natural",
  order: "asc",
  search: "",
  numberOfSteps: "",
  tags: [],
  tagMatchType: "all",
};

export default function FilterSection({
  categories = [],
  initialCategory = DEFAULT_VALUES.category,
  initialSort = DEFAULT_VALUES.sortBy,
  initialOrder = DEFAULT_VALUES.order,
  availableTags = [],
  availableIngredients = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdvancedFilters, setIsAdvancedFilters] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);
  const [search, setSearch] = useState("");
  const [numberOfSteps, setNumberOfSteps] = useState("");

  const updateUrl = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params.delete(key);
        if (value.length > 0) {
          value.forEach((v) => params.append(key, v));
        }
      } else if (value === DEFAULT_VALUES[key]) {
        params.delete(key);
      } else if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const currentCategory = searchParams.get("category") || initialCategory;
    const currentSort = searchParams.get("sortBy") || initialSort;
    const currentOrder = searchParams.get("order") || initialOrder;
    const currentSearch = searchParams.get("search") || "";
    const currentNumberOfSteps = searchParams.get("numberOfSteps") || "";

    setCategory(currentCategory);
    setSortBy(currentSort);
    setOrder(currentOrder);
    setSearch(currentSearch);
    setNumberOfSteps(currentNumberOfSteps);
  }, [searchParams, initialCategory, initialSort, initialOrder]);

  const isFilterActive = useMemo(() => {
    if (!searchParams) return false;

    const hasTagFilters =
      searchParams.has("tags[]") || searchParams.has("tagMatchType");
    const hasIngredientFilters =
      searchParams.has("ingredients[]") ||
      searchParams.has("ingredientMatchType");

    return (
      category !== initialCategory ||
      search !== "" ||
      sortBy !== initialSort ||
      order !== initialOrder ||
      numberOfSteps !== "" ||
      hasTagFilters ||
      hasIngredientFilters
    );
  }, [
    category,
    search,
    sortBy,
    order,
    numberOfSteps,
    searchParams,
    initialCategory,
    initialSort,
    initialOrder,
  ]);

  const handleReset = () => {
    setCategory(DEFAULT_VALUES.category);
    setSortBy(DEFAULT_VALUES.sortBy);
    setOrder(DEFAULT_VALUES.order);
    setSearch(DEFAULT_VALUES.search);
    setNumberOfSteps(DEFAULT_VALUES.numberOfSteps);
    router.push(pathname);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg transition-all duration-300 dark:bg-[#333333] ">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <svg
              className="w-5 h-5 text-[#0C3B2E] dark:text-[#A3C9A7]"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <h2 className="text-lg font-semibold text-[#0C3B2E] dark:text-[#A3C9A7]">Filters</h2>
            {isFilterActive && (
              <span className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:text-gray-700 transition-colors duration-200 text-[#0C3B2E] dark:text-[#A3C9A7]"
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-200  ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            isExpanded
              ? "opacity-100 max-h-[1000px]"
              : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <button
            onClick={() => setIsAdvancedFilters(!isAdvancedFilters)}
            className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-md mb-4"
          >
            {isAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
          </button>

          {isAdvancedFilters && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 py-4">
                <div className="bg-white/50 shadow-sm rounded-lg p-2 flex flex-wrap sm:flex-nowrap gap-2 items-center border border-gray-200">
                  <NumberOfStepsFilter
                    searchParams={searchParams}
                    updateUrl={updateUrl}
                    className="min-w-[120px]"
                  />
                  <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                  <TagFilter
                    availableTags={availableTags}
                    searchParams={searchParams}
                    updateUrl={updateUrl}
                    className="min-w-[120px]"
                  />
                  <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                  <IngredientsFilter
                    availableIngredients={availableIngredients}
                    searchParams={searchParams}
                    updateUrl={updateUrl}
                    className="min-w-[120px]"
                  />
                </div>
              </div>

              {!isFilterActive && (
                <div className="text-gray-500 text-sm italic mt-4">
                  No filter applied
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <CategoryFilter
              categories={categories}
              currentCategory={category}
            />
            <SortOrder currentSort={sortBy} currentOrder={order} />

            {isFilterActive && (
              <button
                onClick={handleReset}
                className="group flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-180"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
