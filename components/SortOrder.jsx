"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortOrder({ currentSort, currentOrder }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split("-");
    const params = new URLSearchParams(searchParams);

    params.set("sortBy", sortBy);
    params.set("order", order);
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        value={`${currentSort}-${currentOrder}`}
        onChange={handleSortChange}
        className="appearance-none w-full md:w-56 px-6 py-3 pr-10 bg-emerald-950/30 
          border-2 border-emerald-800/50 rounded-full text-emerald-50
          focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-800/50
          transition-all duration-300 cursor-pointer"
      >
        <option value="$natural-asc" className="bg-emerald-950">
          Default Sort
        </option>
        <option value="prep-asc" className="bg-emerald-950">
          Prep Time (Low to High)
        </option>
        <option value="prep-desc" className="bg-emerald-950">
          Prep Time (High to Low)
        </option>
        <option value="cook-asc" className="bg-emerald-950">
          Cook Time (Low to High)
        </option>
        <option value="cook-desc" className="bg-emerald-950">
          Cook Time (High to Low)
        </option>
        <option value="published-asc" className="bg-emerald-950">
          Date Published (Oldest to Newest)
        </option>
        <option value="published-desc" className="bg-emerald-950">
          Date Published (Newest to Oldest)
        </option>
        <option value="instructionCount-asc" className="bg-emerald-950">
          Steps (Fewest to Most)
        </option>
        <option value="instructionCount-desc" className="bg-emerald-950">
          Steps (Most to Fewest)
        </option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-emerald-600">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}