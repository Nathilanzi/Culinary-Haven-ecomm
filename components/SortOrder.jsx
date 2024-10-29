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
      >
        <option value="$natural-asc">Default Sort</option>
        <option value="prep-asc">Prep Time (Low to High)</option>
        <option value="prep-desc">Prep Time (High to Low)</option>
        <option value="cook-asc">Cook Time (Low to High)</option>
        <option value="cook-desc">Cook Time (High to Low)</option>
      </select>
    </div>
  );

}
