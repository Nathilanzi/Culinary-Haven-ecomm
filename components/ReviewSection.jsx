"use client";
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

  // Add or update review
  const handleAddOrUpdateReview = async () => {
    if (!session) {
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
    } catch (error) {
      console.error("Failed to submit review:", error);
      setError(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!session) {
      setError("You must be logged in to delete a review");
      return;
    }

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
    } catch (error) {
      console.error("Error deleting review:", error);
      setError(error.message || "Failed to delete review");
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
        className="mb-4 bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition-colors"
      >
        {reviewsVisible ? "Hide Reviews" : "Show Reviews"}
      </button>

      {reviewsVisible && (
        <>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!session && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p>Please <button onClick={() => signIn()} className="text-blue-600 hover:underline">sign in</button> to leave a review.</p>
            </div>
          )}

          {session && canAddReview && !editingReviewId && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Add a Review</h3>
              {/* Review form */}
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
                            : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Comment
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 h-32"
                  placeholder="Share your thoughts about this recipe..."
                />
              </div>

              <button
                onClick={handleAddOrUpdateReview}
                disabled={submittingReview || newReview.rating === 0}
                className="bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Comment
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 h-32"
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
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <strong>{review.username}</strong>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-5 h-5 ${
                            index < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Show edit/delete buttons for the review owner */}
                  {review.isOwner && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => loadReviewForEditing(review)}
                        className="text-blue-500 hover:underline text-sm"
                        disabled={editingReviewId !== null}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {review.comment && (
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                )}

                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  {review.createdAt !== review.updatedAt && (
                    <p className="text-sm text-gray-400 italic">
                      (edited {new Date(review.updatedAt).toLocaleDateString()})
                    </p>
                  )}
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="text-center text-gray-500 py-4">
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