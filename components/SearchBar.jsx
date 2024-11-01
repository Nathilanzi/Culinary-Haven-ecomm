"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRecipeSuggestions } from "@/lib/api";

// Metadata setup for page
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

const SearchBar = ({ isVisible, onToggle }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const debouncedSearchRef = useRef(null);

  // Sync search state with URL params
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== search) {
      setSearch(currentSearch);
      // Only fetch suggestions if there's a search term
      if (currentSearch) {
        fetchSuggestions(currentSearch);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setNoMatchFound(false);
      }
    }
  }, [searchParams]);

  // Focus input when search bar becomes visible
  useEffect(() => {
    if (isVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isVisible]);

  const fetchSuggestions = useCallback(async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      setNoMatchFound(false);
      return;
    }

    setLoading(true);
    try {
      const results = await getRecipeSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(true);
      setNoMatchFound(results.length === 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setNoMatchFound(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateURLParams = useCallback(
    (searchTerm) => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm.trim()) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.delete("page"); // Reset pagination when search changes
      return params;
    },
    [searchParams]
  );

  const performSearch = useCallback(
    (searchTerm) => {
      const params = updateURLParams(searchTerm);
      router.push(`/?${params.toString()}`);
      setShowSuggestions(false);
      setNoMatchFound(false);
    },
    [router, updateURLParams]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);

    // Clear existing timeouts
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current);

    // Immediately fetch suggestions (100ms delay)
    searchTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 100);

    // Update URL params with debounce (500ms delay)
    debouncedSearchRef.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };

  const handleSuggestionClick = (suggestion) => {
    const searchTerm = suggestion.title;
    setSearch(searchTerm);
    setShowSuggestions(false);
    setNoMatchFound(false);
    performSearch(searchTerm);

    // Clear timeouts
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current);
  };

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
          performSearch(search);
          setShowSuggestions(false);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const resetSearch = () => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setNoMatchFound(false);
    onToggle();

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    router.push(`/?${params.toString()}`);

    // Clear timeouts
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current);
  };

  // Handle clicks outside of suggestions
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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current);
    };
  }, []);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
      <div className="flex items-center justify-end">
        <div
          className={`relative overflow-visible transition-all duration-300 ease-in-out ${
            isVisible ? "w-full" : "w-10"
          }`}
        >
          <input
            ref={searchInputRef}
            id="search"
            type="text"
            placeholder="Search Recipes..."
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`w-full px-4 py-3 pr-12 rounded-full text-sm text-gray-800 bg-white/95 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 focus:outline-none shadow-sm transition-all duration-300 ease-in-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full"
            }`}
          />

          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg max-h-80 overflow-y-auto border border-gray-100 divide-y divide-gray-50 transition-all duration-200 ease-in-out"
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
                    className={`px-4 py-3 cursor-pointer text-sm transition-colors duration-150 ease-in-out first:rounded-t-2xl last:rounded-b-2xl ${
                      index === highlightedIndex
                        ? "bg-teal-50 text-teal-900"
                        : "text-gray-700 hover:bg-teal-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 text-teal-600">
                        <svg
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
                      </div>
                      <span className="font-medium">{suggestion.title}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500">
                  <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>No matching recipes found</span>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            className={`absolute right-0 top-0 flex items-center justify-center w-12 h-full text-teal-700 bg-gray-50 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-all duration-300 ease-in-out ${
              isVisible ? "rounded-r-full" : "rounded-full"
            }`}
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
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
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
            />
          </svg>
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </form>
  );
};

export default SearchBar;
