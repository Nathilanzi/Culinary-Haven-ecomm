"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import AdvancedFilter from "@/components/AdvancedFilters";
import NumberOfStepsFilter from "@/components/NumberOfStepsFilter";

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
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    category: initialCategory,
    sortBy: initialSort,
    order: initialOrder,
    search: DEFAULT_VALUES.search,
    numberOfSteps: DEFAULT_VALUES.numberOfSteps,
  });

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
    if (!searchParams) return;
    
    setFilters({
      category: searchParams.get("category") || DEFAULT_VALUES.category,
      sortBy: searchParams.get("sortBy") || DEFAULT_VALUES.sortBy,
      order: searchParams.get("order") || DEFAULT_VALUES.order,
      search: searchParams.get("search") || DEFAULT_VALUES.search,
      numberOfSteps: searchParams.get("numberOfSteps") || DEFAULT_VALUES.numberOfSteps,
    });
  }, [searchParams]);

  const isFilterActive = useMemo(() => {
    if (!searchParams) return false;

    const hasAdvancedFilters =
      searchParams.has("tags[]") || 
      (searchParams.get("tagMatchType") && searchParams.get("tagMatchType") !== DEFAULT_VALUES.tagMatchType);

    return (
      filters.category !== DEFAULT_VALUES.category ||
      filters.search !== DEFAULT_VALUES.search ||
      filters.sortBy !== DEFAULT_VALUES.sortBy ||
      filters.order !== DEFAULT_VALUES.order ||
      filters.numberOfSteps !== DEFAULT_VALUES.numberOfSteps ||
      hasAdvancedFilters
    );
  }, [filters, searchParams]);

  const handleReset = () => {
    // Reset all filters to default values
    setFilters(DEFAULT_VALUES);
    router.push(pathname);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-start">
        <NumberOfStepsFilter
          searchParams={searchParams}
          updateUrl={updateUrl}
          defaultValue={DEFAULT_VALUES.numberOfSteps}
        />
        <AdvancedFilter
          availableTags={availableTags}
          searchParams={searchParams}
          updateUrl={updateUrl}
          defaultValues={{
            tags: DEFAULT_VALUES.tags,
            tagMatchType: DEFAULT_VALUES.tagMatchType
          }}
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
