"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import AdvancedFilter from "@/components/AdvancedFilters";
import NumberOfStepsFilter from "@/components/NumberOfStepsFilter";
import IngredientsFilter from "@/components/IngredientsFilter";

// Define default values as constants
const DEFAULT_VALUES = {
  category: "",
  sortBy: "$natural",
  order: "asc",
  search: "",
  numberOfSteps: "",
  tags: [],
  tagMatchType: "all"
};

export default function FilterSection({
  initialCategory = DEFAULT_VALUES.category,
  initialSort = DEFAULT_VALUES.sortBy,
  initialOrder = DEFAULT_VALUES.order,
  availableTags = [],
  availableIngredients = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);
  const [search, setSearch] = useState("");
  const [numberOfSteps, setNumberOfSteps] = useState("");

  const updateUrl = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to defaults if value matches default
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("category", category);
      localStorage.setItem("sortBy", sortBy);
      localStorage.setItem("order", order);
      localStorage.setItem("search", search);
      localStorage.setItem("numberOfSteps", numberOfSteps);
    }
  }, [category, sortBy, order, search, numberOfSteps]);

  const isFilterActive = useMemo(() => {
    if (!searchParams) return false;

    const hasAdvancedFilters =
      searchParams.has("tags[]") || searchParams.has("tagMatchType");
    const hasIngredientFilters =
      searchParams.has("ingredients[]") || searchParams.has("ingredientMatchType");

    return (
      category !== initialCategory ||
      search !== "" ||
      sortBy !== initialSort ||
      order !== initialOrder ||
      numberOfSteps !== "" ||
      hasAdvancedFilters ||
      hasIngredientFilters
    );
  }, [category, search, sortBy, order, numberOfSteps, searchParams, initialCategory, initialSort, initialOrder]);

  const handleReset = () => {
    setCategory(DEFAULT_VALUES.category);
    setSortBy(DEFAULT_VALUES.sortBy);
    setOrder(DEFAULT_VALUES.order);
    setSearch(DEFAULT_VALUES.search);
    setNumberOfSteps(DEFAULT_VALUES.numberOfSteps);
    router.push(pathname);
  };

  return (
    <div className="mt-20 space-y-4">
      <div className="flex flex-wrap justify-between gap-4 mt-10 mb-8">
        <div className="flex flex-wrap gap-4 items-start">
          <NumberOfStepsFilter
            searchParams={searchParams}
            updateUrl={updateUrl}
          />
          <AdvancedFilter
            availableTags={availableTags}
            searchParams={searchParams}
            updateUrl={updateUrl}
          />
          <IngredientsFilter
            availableIngredients={availableIngredients}
            searchParams={searchParams}
            updateUrl={updateUrl}
          />
        </div>
      </div>

      {isFilterActive && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleReset}
            className="group px-6 py-2 bg-teal-500 text-gray-100 rounded-md
                     transition-all duration-300 ease-in-out transform
                     hover:scale-105 hover:bg-teal-600 
                     active:scale-95 active:bg-teal-400
                     focus:outline-none focus:ring-2 focus:ring-teal-400 
                     focus:ring-opacity-50 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2 transform rotate-0 transition-transform 
                          duration-300 ease-in-out group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Filters
            </span>
          </button>
        </div>
      )}
    </div>
  );
}