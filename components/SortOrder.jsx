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


  return <div>Sort Order Component</div>;
}
