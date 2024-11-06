"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

function ReviewSection({ recipeId }) {
  const [reviews, setReviews] = useState([]);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "", username: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState(null);
  const [hover, setHover] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null); // Track the review being edited

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
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews");
      }
    };

    if (reviewsVisible) {
      fetchReviews();
    }
  }, [recipeId, reviewsVisible]);

  // Add or update review
  const handleAddOrUpdateReview = async () => {
    try {
      setError(null);
      setSubmittingReview(true);

      if (newReview.rating === 0 || !newReview.username) {
        throw new Error("Please select a rating and enter your username");
      }

      const method = editingReviewId ? "PUT" : "POST";
      const endpoint = editingReviewId
        ? `/api/recipes/${recipeId}/reviews`
        : `/api/recipes/${recipeId}/reviews`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId: editingReviewId,
          rating: newReview.rating,
          comment: newReview.comment,
          username: newReview.username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const data = await response.json();

      if (editingReviewId) {
        setReviews(reviews.map((review) =>
          review._id === editingReviewId ? { ...review, ...newReview } : review
        ));
      } else {
        setReviews((prevReviews) => [data.review, ...prevReviews]);
      }

      // Reset form and editing state
      setNewReview({ rating: 0, comment: "", username: "" });
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
    try {
      const response = await fetch(`/api/recipes/${recipeId}/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Failed to delete review");
    }
  };

  // Set review for editing
  const loadReviewForEditing = (review) => {
    setNewReview({ rating: review.rating, comment: review.comment, username: review.username });
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

          {/* Add/Edit Review Form */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingReviewId ? "Edit Your Review" : "Add a Review"}
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                value={newReview.username}
                onChange={(e) =>
                  setNewReview({ ...newReview, username: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Your name"
              />
            </div>

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

            <button
              onClick={handleAddOrUpdateReview}
              disabled={submittingReview || newReview.rating === 0}
              className="bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingReview ? "Submitting..." : editingReviewId ? "Update Review" : "Submit Review"}
            </button>
          </div>

          {/* Display Reviews */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
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

                {review.comment && (
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>

                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => loadReviewForEditing(review)}
                  className="text-blue-500 hover:underline text-sm ml-4"
                >
                  Update
                </button>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No reviews yet. Be the first to review this recipe!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ReviewSection;