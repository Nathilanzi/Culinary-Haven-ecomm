"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Check, Loader2, X, Share2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import LoadingPage from "../loading";

export default function ShoppingListPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState({});
  const [removingItem, setRemovingItem] = useState({});
  const [updatingQuantity, setUpdatingQuantity] = useState({});

  const fetchLists = async () => {
    try {
      const response = await fetch("/api/shopping-list", {
        headers: {
          "user-id": session.user.id,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch shopping lists");

      const data = await response.json();
      setLists(data);
    } catch (error) {
      setError("Error fetching shopping lists: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchLists();
  }, [session, router]);

  const removeItem = async (id, index) => {
    try {
      setRemovingItem({ id, index });
      const response = await fetch(`/api/shopping-list/${id}/items`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-id": session.user.id,
        },
        body: JSON.stringify({ index }),
      });

      if (!response.ok) throw new Error("Failed to remove item");

      fetchLists();
    } catch (error) {
      setError("Error removing item: " + error.message);
    } finally {
      setRemovingItem({ id: null, index: null });
    }
  };

  const deleteList = async (id) => {
    try {
      setDeleting((prev) => ({ ...prev, [id]: true }));

      const response = await fetch(`/api/shopping-list/${id}`, {
        method: "DELETE",
        headers: {
          "user-id": session.user.id,
        },
      });

      if (!response.ok) throw new Error("Failed to delete shopping list");

      fetchLists();
    } catch (error) {
      setError("Error deleting list: " + error.message);
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const markAsPurchased = async (id, itemIndex) => {
    try {
      const list = lists.find((l) => l._id === id);
      if (!list) return;

      const updatedItems = [...list.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        purchased: !updatedItems[itemIndex].purchased,
      };

      const response = await fetch(`/api/shopping-list/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "user-id": session.user.id,
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!response.ok) throw new Error("Failed to update item");
      fetchLists();
    } catch (error) {
      setError("Error updating item: " + error.message);
    }
  };

  const updateQuantity = async (id, index, newQuantity) => {
    try {
      setUpdatingQuantity({ id, index });
      const list = lists.find((l) => l._id === id);
      if (!list) return;

      const updatedItems = [...list.items];
      updatedItems[index] = {
        ...updatedItems[index],
        amount: newQuantity,
      };

      const response = await fetch(`/api/shopping-list/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "user-id": session.user.id,
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");
      fetchLists();
    } catch (error) {
      setError("Error updating quantity: " + error.message);
    } finally {
      setUpdatingQuantity({ id: null, index: null });
    }
  };

  const generateWhatsAppLink = (list) => {
    const listText = list.items
      .map(
        (item) =>
          `${item.amount} ${item.ingredient}${
            item.purchased ? " (Purchased)" : ""
          }`
      )
      .join("\n");

    const message = encodeURIComponent(`Shopping List: \n${listText}`);
    return `https://wa.me/?text=${message}`;
  };

  // Loading state
  if (loading) return <LoadingPage />;

  // Error state
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  // Ensure session exists (redundant with useEffect, but added for type safety)
  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fixed position back button */}
      <div className="fixed top-4 -left-20 z-50">
        <BackButton className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-2 hover:bg-white transition-colors dark:bg-gray-800 dark:hover:bg-gray-700" />
      </div>
      <h1 className="text-center text-3xl text-black dark:text-white font-bold mb-8">
        My Shopping Lists 🛒
      </h1>

      {lists.length === 0 ? (
        <div className="text-center text-black dark:text-white py-8">
          <p>You haven&apos;t created any shopping lists yet.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Render shopping lists here */}
          {lists.map((list) => (
            <div 
              key={list._id} 
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4"
            >
              <h2 className="text-xl font-semibold mb-4">{list.name}</h2>
              {/* List items rendering */}
              {list.items.map((item, index) => (
                <div 
                  key={`${list._id}-${index}`} 
                  className="flex items-center justify-between py-2 border-b"
                >
                  <span 
                    className={`${
                      item.purchased ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {item.amount} {item.ingredient}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => markAsPurchased(list._id, index)}
                      className="text-green-500 hover:bg-green-100 p-1 rounded"
                    >
                      {item.purchased ? <X /> : <Check />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}