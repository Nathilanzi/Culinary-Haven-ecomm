import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLastPage,
}) {
  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Previous
      </button>

      <div className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
        {currentPage}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
      >
        Next
        <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
}
