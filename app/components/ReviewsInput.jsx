import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const ReviewsInput = ({ spaId, userId, setSubmitPressed }) => {
  const [review, setReview] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review.trim()) {
      toast.error('Review field cannot be empty');
      return;
    }
    try {
      const response = await fetch('/api/addreview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaId: spaId,
          userId: parseInt(userId, 10),
          feedback: review
        }),
      });

      if (response.ok) {
        toast.success("Review submitted successfully");
        // Clearing the input field after submission
        setReview('');
        setSubmitPressed(true);
      } else {
        console.error('Failed to submit reviews');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
      <h2 className="text-center mb-4">Leave a Review for Us</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={handleInputChange}
          placeholder="Write your review here..."
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-sky-500"
          rows={4}
          cols={50}
        />
        <div className="text-center mt-4">
          <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md">
            Submit
          </button>
        </div>
      </form>
    </div>

  );
};

export default ReviewsInput;