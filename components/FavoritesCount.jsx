"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

/**
 * A component that displays the count of a user's favorite recipes.
 *
 * This component fetches the favorite count from the server and updates the displayed count whenever the favorites are modified.
 * It also listens for updates to the favorites count and re-fetches the data accordingly.
 *
 * @returns {JSX.Element|null} The rendered component displaying the favorites count, or null if the user is not logged in.
 */
const FavoritesCount = () => {
  const [count, setCount] = useState(0);
  const { data: session } = useSession();

  /**
   * Fetches the current count of the user's favorite recipes.
   * The count is fetched from the server and displayed on the component.
   * This function is also triggered whenever the "favoritesUpdated" event is fired.
   */
  useEffect(() => {
    const fetchCount = async () => {
      if (!session) return;

      try {
        const response = await fetch("/api/favorites?action=count", {
          headers: {
            "user-id": session.user.id,
          },
        });
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error("Error fetching favorites count:", error);
      }
    };

    // Fetch the count when the component is mounted or session changes
    fetchCount();

    // Subscribe to favorites count updates and re-fetch count when updated
    window.addEventListener("favoritesUpdated", fetchCount);

    // Cleanup: Remove event listener when the component is unmounted or session changes
    return () => window.removeEventListener("favoritesUpdated", fetchCount);
  }, [session]);

  // Return null if there is no active session (user not logged in)
  if (!session) return null;

  return (
    <div className="relative">
      {/* Display the favorite count with a badge in the top-right corner */}
      <span className="absolute -top-2 -right-2 bg-[#DB8C28] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {count}
      </span>
    </div>
  );
};

export default FavoritesCount;
