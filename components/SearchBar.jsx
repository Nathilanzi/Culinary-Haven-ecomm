"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRecipeSuggestions } from "@/lib/api";

/**
 * Metadata for the recipe search page
 * @type {Object}
 */
export const metadata = {
  title: "Culinary Haven: Online Recipes | SA's leading online recipe app",
  description:
    "Browse through our collection of delicious recipes. Find everything from quick weeknight dinners to gourmet dishes.",
  openGraph: {
    title: "Culinary Haven: Online Recipes | SA's leading online recipe app",
    description:
      "Browse through our collection of delicious recipes. Find everything from quick weeknight dinners to gourmet dishes.",
  },
};

/**
 * Props for the SearchBar component
 * @typedef {Object} SearchBarProps
 * @property {boolean} isVisible - Determines if the search bar is currently visible
 * @property {() => void} onToggle - Function to toggle the search bar's visibility
 */

/**
 * A dynamic search bar component with autocomplete suggestions
 *
 * @component
 * @param {SearchBarProps} props - Component properties
 * @returns {React.ReactElement} Rendered search bar component
 */
const SearchBar = ({ isVisible, onToggle }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const urlUpdateTimeoutRef = useRef(null);

  /**
   * Highlights matching search terms in text
   *
   * @param {string} text - The text to highlight
   * @param {string} searchTerm - The term to highlight within the text
   * @returns {React.ReactNode} Text with matching terms highlighted
   */
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    try {
      const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
      return (
        <>
          {parts.map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
              <span key={index} className="bg-teal-200 font-medium">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </>
      );
    } catch (e) {
      return text;
    }
  };

  /**
   * Updates the URL with current search parameters
   *
   * @param {string} searchTerm - The current search term
   * @description Debounces URL updates to prevent excessive navigation
   */
  const updateURL = useCallback(
    (searchTerm) => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }

      urlUpdateTimeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm.trim()) {
          params.set("search", searchTerm);
        } else {
          params.delete("search");
        }
        params.delete("page");
        router.push(`/?${params.toString()}`);
      }, 500);
    },
    [searchParams, router]
  );

  /**
   * Fetches recipe suggestions based on user input
   *
   * @param {string} value - The search input value
   * @description Retrieves recipe suggestions from API when input meets minimum length
   */
  const fetchSuggestions = useCallback(async (value) => {
    if (!value.trim() || value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const results = await getRecipeSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handles changes to the search input
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   * @description Updates search state, fetches suggestions, and updates URL
   */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setHighlightedIndex(-1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.length >= 2) {
      setShowSuggestions(true);
      fetchSuggestions(value);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }

    updateURL(value);
  };

  /**
   * Handles selection of a suggestion
   *
   * @param {Object} suggestion - Selected recipe suggestion
   * @description Updates search, URL, and closes suggestion dropdown
   */
  const handleSuggestionClick = (suggestion) => {
    const searchTerm = suggestion.title;
    setSearch(searchTerm);
    setShowSuggestions(false);

    if (urlUpdateTimeoutRef.current) {
      clearTimeout(urlUpdateTimeoutRef.current);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("search", searchTerm);
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const resetSearch = () => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    onToggle();

    if (urlUpdateTimeoutRef.current) {
      clearTimeout(urlUpdateTimeoutRef.current);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  /**
   * Handles keyboard navigation in suggestions
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Keyboard event
   * @description Allows arrow key navigation and selection of suggestions
   */
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          setShowSuggestions(false);
          updateURL(search);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  useEffect(() => {
    if (isVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
      <div className="flex items-center justify-end">
        <div
          className={`
            relative overflow-hidden
            transition-all duration-300 ease-in-out
            ${isVisible ? "w-full" : "w-10"}
          `}
        >
          <input
            ref={searchInputRef}
            id="search"
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className={`
              w-full px-3 py-2 pr-10 rounded-3xl text-sm text-gray-800 bg-white
              border border-gray-300
              focus:ring-2 focus:outline-none
              transition-all duration-300 ease-in-out
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }
            `}
          />
          <button
            type="button"
            onClick={onToggle}
            className={`
              absolute right-0 top-0
              flex items-center justify-center w-10 h-full
              text-teal-700 bg-gray-50 hover:bg-gray-100
              focus:outline-none focus:ring-2
              transition-all duration-300 ease-in-out
              ${
                isVisible
                  ? "rounded-r-full border border-l-0 border-gray-300"
                  : "rounded-full"
              }
            `}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                isVisible ? "rotate-90" : ""
              }`}
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

      {showSuggestions && search.length >= 3 && (
        <div
          ref={suggestionsRef}
          className="absolute right-0 z-50 w-full mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg max-h-80 overflow-y-auto border border-gray-100 divide-y divide-gray-50 custom-scrollbar"
        >
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-4 h-4 border-2 border-teal-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-3 cursor-pointer text-sm transition-colors duration-150 ease-in-out first:rounded-t-1xl last:rounded-b-2xl ${
                  index === highlightedIndex
                    ? "bg-teal-50 text-teal-900"
                    : "text-gray-700 hover:bg-teal-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">
                      {highlightMatch(suggestion.title, search)}
                    </div>
                    {suggestion.category && (
                      <div className="text-xs text-gray-500">
                        in {highlightMatch(suggestion.category, search)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No matching suggestions found
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
