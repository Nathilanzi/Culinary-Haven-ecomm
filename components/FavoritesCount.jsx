"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const FavoritesCount = () => {
  const [count, setCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCount = async () => {
      if (!session) return;

      try {
        const response = await fetch("/api/favorites?action=count", {
          headers: {
            "user-id": session.user.id
          }
        });
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error("Error fetching favorites count:", error);
      }
    };

    fetchCount();

    // Subscribe to favorites count updates
    window.addEventListener("favoritesUpdated", fetchCount);
    return () => window.removeEventListener("favoritesUpdated", fetchCount);
  }, [session]);

  if (!session) return null;

  return (
    <div className="relative">
      <span className="absolute -top-2 -right-2 bg-[#DB8C28] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {count}
      </span>
    </div>
  );
};

export default FavoritesCount;