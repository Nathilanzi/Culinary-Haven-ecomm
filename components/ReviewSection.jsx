"use client";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

function ReviewSection({ recipeId }) {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState(null);
  const [hover, setHover] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/recipes/${recipeId}/reviews`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data.reviews || []);
        setCurrentUser(data.currentUser);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews");
      }
    };

    if (reviewsVisible) {
      fetchReviews();
    }
  }, [recipeId, reviewsVisible, session]);

  // Handle sorting
  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setReviews((prevReviews) => {
      const sortedReviews = [...prevReviews].sort((a, b) => {
        if (field === "date") {
          return order === "desc"
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
        } else if (field === "rating") {
          return order === "desc" ? b.rating - a.rating : a.rating - b.rating;
        }
        return 0;
      });
      return sortedReviews;
    });
  };

  // Add or update review
  const handleAddOrUpdateReview = async () => {
    if (!session) {
      swal("Please log in", "You must be logged in to add a review.", "warning");
      signIn();
      return;
    }

    try {
      setError(null);
      setSubmittingReview(true);

      if (newReview.rating === 0) {
        throw new Error("Please select a rating");
      }

      const method = editingReviewId ? "PUT" : "POST";
      const endpoint = `/api/recipes/${recipeId}/reviews`;
      const body = {
        rating: newReview.rating,
        comment: newReview.comment,
        ...(editingReviewId && { reviewId: editingReviewId }),
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      // Refresh reviews after submission
      const refreshResponse = await fetch(`/api/recipes/${recipeId}/reviews`);
      const refreshData = await refreshResponse.json();
      setReviews(refreshData.reviews || []);

      // Reset form
      setNewReview({ rating: 0, comment: "" });
      setEditingReviewId(null);
      swal("Review submitted", "Your review has been successfully submitted.", "success");
    } catch (error) {
      console.error("Failed to submit review:", error);
      setError(error.message);
      swal("Submission failed", error.message || "Failed to add review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!session) {
      swal("Please log in", "You must be logged in to delete a review.", "warning");
      setError("You must be logged in to delete a review");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `/api/recipes/${recipeId}/reviews?reviewId=${reviewId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete review");
        }

        // Refresh reviews after deletion
        const refreshResponse = await fetch(`/api/recipes/${recipeId}/reviews`);
        const refreshData = await refreshResponse.json();
        setReviews(refreshData.reviews || []);
        swal("Review deleted", "Your review has been successfully deleted.", "success");
      } catch (error) {
        console.error("Error deleting review:", error);
        setError(error.message || "Failed to delete review");
        swal("Deletion failed", error.message || "Failed to delete review", "error");
      }
    }
  };

  // Check if the current user can add a review
  const canAddReview = session && !reviews.some(review => 
    review.userId === session.user.id || review.username === session.user.name
  );

  const loadReviewForEditing = (review) => {
    setNewReview({
      rating: review.rating,
      comment: review.comment,
    });
    setEditingReviewId(review._id);
  };

  return (
    <div className="mt-8">
      <button
        onClick={() => setReviewsVisible(!reviewsVisible)}
        className="mb-4 bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition-colors dark:bg-[#2D7356] dark:hover:bg-[#256B4C]"
      >
        {reviewsVisible ? "Hide Reviews" : "Show Reviews"}
      </button>

      {reviewsVisible && (
        <>
          {/* Sort buttons */}
          <div className="my-4 flex gap-4">
            {/* Sort by Date */}
            <div>
              <p className="text-gray-700 mb-2 font-semibold dark:text-gray-300">Sort by Date:</p>
              <button
                onClick={() => handleSortChange("date", "desc")}
                className={`bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-black dark:bg-[#333836] dark:hover:bg-[#444944] dark:text-gray-100 ${
                  sortBy === "date" && sortOrder === "desc" ? "bg-gray-400 dark:bg-[#56605B]" : ""
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => handleSortChange("date", "asc")}
                className={`bg-gray-200 px-4 py-2 ml-2 rounded-lg hover:bg-gray-300 transition-colors text-black dark:bg-[#333836] dark:hover:bg-[#444944] dark:text-gray-100 ${
                  sortBy === "date" && sortOrder === "asc" ? "bg-gray-400 dark:bg-[#56605B]" : ""
                }`}
              >
                Oldest
              </button>
            </div>

            {/* Sort by Rating */}
            <div>
              <p className="text-gray-700 mb-2 font-semibold dark:text-gray-300">Sort by Rating:</p>
              <button
                onClick={() => handleSortChange("rating", "desc")}
                className={`bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-black dark:bg-[#333836] dark:hover:bg-[#444944] dark:text-gray-100 ${
                  sortBy === "rating" && sortOrder === "desc" ? "bg-gray-400 dark:bg-[#56605B]" : ""
                }`}
              >
                  Highest
              </button>
              <button
                onClick={() => handleSortChange("rating", "asc")}
                className={`bg-gray-200 px-4 py-2 ml-2 rounded-lg hover:bg-gray-300 transition-colors text-black dark:bg-[#333836] dark:hover:bg-[#444944] dark:text-gray-100 ${
                  sortBy === "rating" && sortOrder === "asc" ? "bg-gray-400 dark:bg-[#56605B]" : ""
                }`}
              >
                  Lowest
              </button>
              <button
                onClick={() => { setSortBy("date"); setSortOrder("desc"); }}
                className="ml-5 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors dark:bg-[#B04646] dark:hover:bg-[#8F3A3A]"
              >
                  Reset Filters
              </button>
            </div>
          </div>
  
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative dark:bg-[#502D2D] dark:text-[#D9A2A2]">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!session && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded dark:bg-[#4A4A27] dark:text-[#E0DA9E]">
              <p>Please <button onClick={() => signIn()} className="text-blue-600 hover:underline dark:text-blue-400">sign in</button> to leave a review.</p>
            </div>
          )}

          {session && canAddReview && !editingReviewId && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg dark:bg-[#2C2F2D]">
              <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Add a Review</h3>
              {/* Review form */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hover || newReview.rating)
                            ? "fill-yellow-400 text-yellow-400 dark:text-[#FFC857]"
                            : "text-gray-300 dark:text-[#555956]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>  

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
                  Comment
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 h-32 dark:bg-[#333836] dark:border-[#444944] dark:text-gray-100"
                  placeholder="Share your thoughts about this recipe..."
                />
              </div>
  
              <button
                onClick={handleAddOrUpdateReview}
                disabled={submittingReview || newReview.rating === 0}
                className="bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#2D7356] dark:hover:bg-[#256B4C]"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}

          {session && editingReviewId && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Edit Your Review</h3>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hover || newReview.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 h-32 dark:bg-[#333836] dark:border-[#444944] dark:text-gray-100"
                  placeholder="Share your thoughts about this recipe..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddOrUpdateReview}
                  disabled={submittingReview || newReview.rating === 0}
                  className="bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? "Updating..." : "Update Review"}
                </button>
                <button
                  onClick={() => {
                    setEditingReviewId(null);
                    setNewReview({ rating: 0, comment: "" });
                  }}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border rounded-lg p-4 bg-white shadow-sm dark:bg-[#2C2F2D] dark:border-[#444944]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <strong className="dark:text-gray-100">{review.username}</strong>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-5 h-5 ${
                            index < review.rating
                              ? "fill-yellow-400 text-yellow-400 dark:text-[#FFC857]"
                              : "text-gray-300 dark:text-[#555956]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.isOwner && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => loadReviewForEditing(review)}
                        className="text-blue-500 hover:underline text-sm dark:text-blue-400"
                        disabled={editingReviewId !== null}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-500 hover:underline text-sm dark:text-[#D9A2A2]"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {review.comment && (
                  <p className="text-gray-700 mt-2 dark:text-gray-300">{review.comment}</p>
                )}

                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  {review.createdAt !== review.updatedAt && (
                    <p className="text-sm text-gray-400 italic dark:text-gray-500">
                      (edited {new Date(review.updatedAt).toLocaleDateString()})
                    </p>
                  )}
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="text-center text-gray-500 py-4 dark:text-gray-400">
                No reviews yet. {session ? "Be the first to review this recipe!" : "Sign in to be the first to review this recipe!"}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ReviewSection;