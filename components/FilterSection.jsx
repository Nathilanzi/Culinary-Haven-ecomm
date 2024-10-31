"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import SortOrder from "@/components/SortOrder";
import AdvancedFilter from "@/components/AdvancedFilters";

export default function FilterSection({
  categories,
  initialCategory = "",
  initialSort = "$natural",
  initialOrder = "asc",
  availableTags = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // States for filter values
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);
  const [search, setSearch] = useState("");

  // Update URL with current filter state
  const updateUrl = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
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

  // Effect to sync URL params with state
  useEffect(() => {
    const currentCategory = searchParams.get("category") || initialCategory;
    const currentSort = searchParams.get("sortBy") || initialSort;
    const currentOrder = searchParams.get("order") || initialOrder;
    const currentSearch = searchParams.get("search") || "";

    setCategory(currentCategory);
    setSortBy(currentSort);
    setOrder(currentOrder);
    setSearch(currentSearch);
  }, [searchParams, initialCategory, initialSort, initialOrder]);

  // Save filter values to local storage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("category", category);
      localStorage.setItem("sortBy", sortBy);
      localStorage.setItem("order", order);
      localStorage.setItem("search", search);
    }
  }, [category, sortBy, order, search]);

  // Check if any filters are active by comparing with initial/default values
  const isFilterActive = useMemo(() => {
    const hasAdvancedFilters =
      searchParams.has("tags[]") || searchParams.has("tagMatchType");

    return (
      category !== initialCategory ||
      search !== "" ||
      sortBy !== initialSort ||
      order !== initialOrder ||
      hasAdvancedFilters
    );
  }, [
    category,
    search,
    sortBy,
    order,
    searchParams,
    initialCategory,
    initialSort,
    initialOrder,
  ]);

  // Reset handler that clears all filters and returns to initial state
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
          <AdvancedFilter
            availableTags={availableTags}
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