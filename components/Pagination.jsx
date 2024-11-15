"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalResults, 
  resultsPerPage,
  isLoading = false 
}) {
  const [page, setPage] = useState(currentPage);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const createQueryString = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    return params.toString();
  };

  const onPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setPage(newPage);
      const queryString = createQueryString(newPage);
      router.push(`?${queryString}`, { scroll: false });
    }
  };

  // Calculate pagination ranges
  const startResult = Math.min((currentPage - 1) * resultsPerPage + 1, totalResults);
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = isMobile ? 3 : 5;

    // Always show first page
    pageNumbers.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        disabled={isLoading}
        className={`relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium transition-all duration-200 
        ${
  page === 1
    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
    : "bg-white hover:bg-gray-50 text-gray-700 hover:text-emerald-600"
} 
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md`}
        aria-label="Go to first page"
      >
        1
      </button>
    );

    // Show ellipsis if needed
    if (page > maxPagesToShow) {
      pageNumbers.push(
        <span key="dots-start" className="px-1 sm:px-2 text-gray-500" aria-hidden="true">
          •••
        </span>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages as they're handled separately

      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          disabled={isLoading}
          className={`relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium transition-all duration-200 
          ${
  page === i
    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
    : "bg-white hover:bg-gray-50 text-gray-700 hover:text-emerald-600"
} 
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
          rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md`}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </button>
      );
    }

    // Show ending ellipsis if needed
    if (page < totalPages - maxPagesToShow) {
      pageNumbers.push(
        <span key="dots-end" className="px-1 sm:px-2 text-gray-500" aria-hidden="true">
          •••
        </span>
      );
    }

    // Show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          disabled={isLoading}
          className={`relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium transition-all duration-200 
          ${
  page === totalPages
    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
    : "bg-white hover:bg-gray-50 text-gray-700 hover:text-emerald-600"
} 
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
          rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md`}
          aria-label="Go to last page"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center space-y-3 sm:space-y-5 mt-4 sm:mt-8">
      <div className="flex items-center justify-center space-x-1 sm:space-x-3">
        {/* Previous page Button */}
        <button
          title="Previous page"
          type="button"
          disabled={page === 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
          className={`relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm transition-all duration-200 
          ${
    page === 1 || isLoading
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-white hover:bg-gray-50 text-gray-700 hover:text-emerald-600"
    } 
          rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md`}
          aria-label="Go to previous page"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        {renderPageNumbers()}

        {/* Next page Button */}
        <button
          title="Next page"
          type="button"
          disabled={page === totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
          className={`relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm transition-all duration-200 
          ${
    page === totalPages || isLoading
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-white hover:bg-gray-50 text-gray-700 hover:text-emerald-600"
    } 
          rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md`}
          aria-label="Go to next page"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Results summary */}
      <div className="text-sm text-gray-600" role="status" aria-live="polite">
        {isLoading ? (
          "Loading results..."
        ) : (
          <>
            Showing {startResult.toLocaleString()} - {endResult.toLocaleString()} of{" "}
            {totalResults.toLocaleString()} results
            {totalPages > 1 && ` (Page ${currentPage.toLocaleString()} of ${totalPages.toLocaleString()})`}
          </>
        )}
      </div>
    </div>
  );
}