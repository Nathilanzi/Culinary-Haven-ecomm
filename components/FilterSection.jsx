"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import SortOrder from "@/components/SortOrder";

export default function FilterSection({
  categories,
  initialCategory = "",
  initialSort = "$natural",
  initialOrder = "asc",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States for filter values
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);
  const [search, setSearch] = useState("");

  // On mount, read values from local storage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCategory = searchParams.get("category") || localStorage.getItem("category") || initialCategory;
      const storedSortBy = searchParams.get("sortBy") || localStorage.getItem("sortBy") || initialSort;
      const storedOrder = searchParams.get("order") || localStorage.getItem("order") || initialOrder;
      const storedSearch = searchParams.get("search") || localStorage.getItem("search") || "";

      setCategory(storedCategory);
      setSortBy(storedSortBy);
      setOrder(storedOrder);
      setSearch(storedSearch);
    }
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
    return (
      category !== initialCategory ||
      search !== "" ||
      sortBy !== initialSort ||
      order !== initialOrder
    );
  }, [
    category,
    search,
    sortBy,
    order,
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
        <CategoryFilter categories={categories} currentCategory={category} />
        <SortOrder currentSort={sortBy} currentOrder={order} />
      </div>

      {/* Reset button only shown when filters are active */}
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
