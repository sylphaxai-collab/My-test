'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/auth';

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  profile: {
    full_name: string;
  };
}

interface CustomerReviewsProps {
  productId: number;
}

export default function CustomerReviews({ productId }: CustomerReviewsProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reviews
  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('*, profile:profiles(full_name)')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReviews(data as Review[]);
      } catch (err: any) {
        console.error('Error loading reviews:', err);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, [productId]);

  const handleRatingClick = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (newReview.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!newReview.comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment.trim()
        });

      if (insertError) throw insertError;

      // Reset form and reload reviews
      setNewReview({ rating: 0, comment: '' });
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profile:profiles(full_name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data as Review[]);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-4 bg-soft-gray rounded w-1/4"></div>
      <div className="h-4 bg-soft-gray rounded w-3/4"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-navy">Customer Reviews</h3>
      
      {/* Add Review Form */}
      {user && (
        <div className="border-t pt-6">
          <h4 className="font-medium text-navy mb-4">Write a Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`w-6 h-6 transition-colors ${
                      star <= newReview.rating ? 'text-soft-pink-dark' : 'text-gray-300'
                    }`}
                    aria-label={`Rate ${star} stars`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-navy mb-2">
                Comment
              </label>
              <textarea
                id="comment"
                value={newReview.comment}
                onChange={handleCommentChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soft-pink-dark resize-none"
                rows={3}
                placeholder="Share your thoughts about this product..."
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-soft-pink-dark text-white rounded-md hover:bg-soft-pink transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-t pt-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-medium text-navy">{review.profile.full_name}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= review.rating ? 'text-soft-pink-dark' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
