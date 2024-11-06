"use client";
import { useState, useEffect } from 'react';
import { getRecipeReviews, addReview } from '@/lib/api';
import { Star } from 'lucide-react';

function ReviewSection({ recipeId }) {
  const [reviews, setReviews] = useState([]);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', username: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hover, setHover] = useState(0);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await getRecipeReviews(recipeId);
      setReviews(fetchedReviews);
    };
    if (reviewsVisible) fetchReviews();
  }, [recipeId, reviewsVisible]);

  // Add review
  const handleAddReview = async () => {
    try {
      setSubmittingReview(true);
      const addedReview = await addReview(recipeId, newReview);
      setReviews([addedReview, ...reviews]);
      setNewReview({ rating: 0, comment: '', reviewerName: '' });
    } catch (error) {
      console.error("Failed to add review:", error);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
      <button
        className="mt-4 bg-[#0C3B2E] text-white px-6 py-2 rounded-md transition-colors duration-200"
        onClick={() => setReviewsVisible(!reviewsVisible)}
      >
        {reviewsVisible ? 'Hide Reviews' : 'Show Reviews'}
      </button>

      {reviewsVisible && (
        <>
          {/* Display reviews */}
          <div className="mt-4 bg-gray-200 p-4 rounded-lg">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-100 p-4 rounded-md mb-4 shadow-md"
              >
                <div className="flex items-center mb-2">
                  <p className="font-bold text-gray-900">{review.username}</p>
                  <span className="ml-auto text-yellow-400">
                    {Array(Math.round(review.rating)).fill('★').join('')}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-gray-500 text-sm mt-2">{new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="mt-8 bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl text-black font-semibold mb-4">Add a Review</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hover || newReview.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              />
            </div>
            <button
              onClick={handleAddReview}
              className="bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={submittingReview}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ReviewSection;
