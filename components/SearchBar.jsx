"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * A React component that renders a search bar.
 * @param {Object} props - The component props.
 * @param {boolean} props.isVisible - Determines whether the search bar should be visible.
 * @param {function} props.onToggle - A function to toggle the visibility of the search bar.
 * @returns {JSX.Element} - The search bar component.
 */
export default function SearchBar({ isVisible, onToggle }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const searchInputRef = useRef(null);

  /**
   * Updates the search state when the searchParams change.
   */
  const updateSearch = useCallback(() => {
    // Updating search state when searchParams change
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== search) {
      setSearch(currentSearch);
    }
  }, [searchParams, search]);

  /**
   * Focuses the search input when the search bar becomes visible.
   */
  useEffect(() => {
    updateSearch();
  }, [updateSearch]);

  useEffect(() => {
    if (isVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isVisible]);

  /**
   * Handles the search input change and updates the URL search parameters.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object.
   */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  /**
   * Handles the search form submission and updates the URL search parameters.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  /**
   * Resets the search and updates the URL search parameters.
   */
  const resetSearch = () => {
    setSearch("");
    onToggle();
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      {/* Main container for the search bar */}
      <div className="flex items-center justify-end">
        <div
          className={`
            relative overflow-hidden
            transition-all duration-300 ease-in-out
            ${isVisible ? "w-full" : "w-10"}
          `}
        >
          {/* Search input field */}
          <input
            ref={searchInputRef}
            id="search"
            type="text"
            placeholder="Search Recipes..."
            value={search}
            onChange={handleSearch}
            className={`
              w-full px-3 py-2 pr-10 rounded-3xl text-sm text-gray-800 bg-white
              border border-gray-300
              focus:ring-2 focus:outline-none
              transition-all duration-300 ease-in-out
              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
            `}
          />
          {/* Search button */}
          <button
            type="button"
            onClick={onToggle}
            className={`
              absolute right-0 top-0
              flex items-center justify-center w-10 h-full
              text-teal-700 bg-gray-50 hover:bg-gray-100
              focus:outline-none focus:ring-2
              transition-all duration-300 ease-in-out
              ${isVisible ? "rounded-r-full border border-l-0 border-gray-300" : "rounded-full"}
            `}
          >
            {/* Search icon SVG */}
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isVisible ? "rotate-90" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            {/* Screen reader text for the search button */}
            <span className="sr-only">Toggle search</span>
          </button>
        </div>
      </div>
      {search && isVisible && (
        <button
          type="button"
          onClick={resetSearch}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </form>
  );
}
