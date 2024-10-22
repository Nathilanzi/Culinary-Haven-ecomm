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
      >
        <ChevronLeft />
        Previous
      </button>
      <span>{currentPage}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
      >
        Next
        <ChevronRight />
      </button>
    </div>
  );
}
