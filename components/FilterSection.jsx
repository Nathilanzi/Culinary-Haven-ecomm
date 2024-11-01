"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import SortOrder from "@/components/SortOrder";
import TagFilter from "@/components/TagFilter";
import NumberOfStepsFilter from "@/components/NumberOfStepsFilter";
import IngredientsFilter from "@/components/IngredientsFilter"; // Adjusted import path

export default function FilterSection({
  categories,
  initialCategory = "",
  initialSort = "$natural",
  initialOrder = "asc",
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
  const [numberOfSteps, setNumberOfSteps] = useState(
    searchParams.get("numberOfSteps") || ""
  );

  const updateUrl = (newParams) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
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
  }, [category, sortBy, order, search, numberOfSteps,]);

  const isFilterActive = useMemo(() => {
    const hasTagFilters =
      searchParams.has("tags[]") || searchParams.has("tagMatchType");
    const hasIngredientFilters =
      searchParams.has("ingredients[]") || searchParams.has("ingredientMatchType")

    return (
      category !== initialCategory ||
      search !== "" ||
      sortBy !== initialSort ||
      order !== initialOrder ||
      numberOfSteps !== "" ||
      hasTagFilters,
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
    const baseUrl = window.location.pathname;
    router.push(baseUrl);
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  };

  return (
    <div className="mt-20 space-y-4">
      <div className="flex flex-wrap justify-between gap-4 mt-10 mb-8">
        <div className="flex flex-wrap gap-4 items-start">
          <CategoryFilter
            categories={categories}
            currentCategory={category}
            searchParams={searchParams}
            updateUrl={updateUrl}
          />
          <NumberOfStepsFilter
            searchParams={searchParams}
            updateUrl={updateUrl}
          />
          <TagFilter
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
        <SortOrder
          currentSort={sortBy}
          currentOrder={order}
          searchParams={searchParams}
          updateUrl={updateUrl}
        />
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
