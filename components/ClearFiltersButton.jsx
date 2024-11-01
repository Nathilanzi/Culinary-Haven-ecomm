"use client";

import { useRouter } from "next/navigation";

export default function ClearFiltersButton() {
  const router = useRouter();

  const handleClearFilters = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClearFilters}
      className="mt-4 text-blue-500 hover:text-blue-700 underline"
    >
      Clear all filters
    </button>
  );
}
