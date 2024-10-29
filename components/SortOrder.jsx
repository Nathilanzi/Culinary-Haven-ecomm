"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortOrder({ currentSort, currentOrder }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return <div>Sort Order Component</div>;
}
