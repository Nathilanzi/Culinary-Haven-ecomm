"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// SVG Icons as components
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 ml-2 text-gray-600"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-gray-500"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const sortOptions = {
  "$natural-asc": "Default Sort",
  "prep-asc": "Prep Time (Low to High)",
  "prep-desc": "Prep Time (High to Low)",
  "cook-asc": "Cook Time (Low to High)",
  "cook-desc": "Cook Time (High to Low)",
  "published-asc": "Date Published (Oldest to Newest)",
  "published-desc": "Date Published (Newest to Oldest)",
  "instructionCount-asc": "Steps (Fewest to Most)",
  "instructionCount-desc": "Steps (Most to Fewest)",
};

export default function SortOrder({ currentSort, currentOrder }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("$natural-asc");

  // Update selectedSort based on URL changes
  useEffect(() => {
    const sortBy = searchParams.get("sortBy") || "$natural"; 
    const order = searchParams.get("order") || "asc"; 
    const sortKey = `${sortBy}-${order}`;
    setSelectedSort(sortOptions[sortKey] ? sortKey : "$natural-asc");
  }, [searchParams]);

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const clearSort = () => {
    setSelectedSort("$natural-asc");
  };

  const applySort = () => {
    const [sortBy, order] = selectedSort.split("-");
    const params = new URLSearchParams(searchParams);

    if (sortBy && order) {
      params.set("sortBy", sortBy);
      params.set("order", order);
    } else {
      params.delete("sortBy");
      params.delete("order");
    }
    params.delete("page");

    router.push(`/?${params.toString()}`);
    toggleModal();
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleModal}
        className="group flex items-center justify-between w-full md:w-48 px-6 py-3 bg-emerald-950/30 border-2 border-emerald-800/50 rounded-full text-emerald-50 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-800/50 transition-all duration-300 hover:bg-emerald-950/40 hover:border-emerald-700/60"
      >
        <span className="truncate">{sortOptions[selectedSort]}</span>{" "}
        {/* Display the label */}
        <ChevronDownIcon />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={toggleModal}
          />

          <div className="bg-white/95 p-8 rounded-2xl shadow-xl w-11/12 max-w-lg relative transform translate-y-0 animate-slide-up">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <CloseIcon />
            </button>

            <h2 className="text-xl font-semibold text-emerald-900 mb-6">
              Sort by
            </h2>

            <div className="relative mb-6">
              <select
                value={selectedSort}
                onChange={handleSortChange}
                className="appearance-none w-full px-6 py-4 bg-emerald-950/5 border-2 border-emerald-800/20 rounded-xl text-emerald-900 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-800/30 transition-all duration-300 cursor-pointer hover:bg-emerald-950/10"
              >
                {Object.entries(sortOptions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end items-center gap-4">
              <button
                onClick={clearSort}
                className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors duration-200 rounded-lg hover:bg-red-50"
              >
                Clear Sort
              </button>
              <button
                onClick={applySort}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Apply Sort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
