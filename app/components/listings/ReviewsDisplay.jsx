import React, { useState, useEffect } from 'react';
import { FaEllipsisVertical } from "react-icons/fa6";
import toast from 'react-hot-toast';


const ReviewsDisplay = ({ reviews, CurrentUser, setSubmitPressed }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [openIndex, setOpenIndex] = useState(null);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const handleDelete = async (id, reviewId) => {
    try {
      const response = await fetch(`/api/deleteReview/${id}?reviewId=${reviewId}`);
      setSubmitPressed(true);
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Server error: Internal Server Error');
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
      toast.success('1 review deleted');
      
    } catch (error) {
      console.error('Error deleting review data:', error);

    }
  }

  return (
    <div>
      <ul>
        {currentReviews?.map((review, index) => (
          <li key={index} className=' m-3 rounded-md hover:bg-zinc-200 p-3'>
            <span className="flex justify-between">
              <div className='font-light flex-auto w-64'>
                {review?.user?.name || review?.user?.mname || review?.user?.lname ? (<>
                  {`${review?.user?.name}`} {review?.user?.mname && review?.user?.lname ? (<>{`${review?.user.mname} ${review?.user?.lname}`}</>) : (<></>)}
                </>) : (<>
                  {review?.spa?.name}
                </>)}
              </div>
              <div className="">
                {new Date(review.createdAt).toDateString().replace(/\sGMT.*$/, '')} {new Date(review.createdAt).toLocaleTimeString()}
              </div>
              <div className="relative">
                <FaEllipsisVertical className='h-4 cursor-pointer' onClick={() => setOpenIndex(openIndex === index ? null : index)} />
                {openIndex === index && (<>
                  {CurrentUser.id === review.userId ? (<>
                    <div key={index} className='absolute right-0 top-6 text-sm'>
                      <div className='bg-white shadow-md border rounded-md border-stone-300'>
                        <div className='flex flex-col'>
                          <a className='p-1 hover:bg-gray-200 cursor-pointer' onClick={() => { handleDelete(CurrentUser.id, review.id) }}>Delete</a>
                        </div>
                      </div>
                    </div>
                  </>) : (<></>)}
                </>
                )}
              </div>
            </span>
            {`${review.feedback}`}
          </li>
        ))}
      </ul>
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          reviewsPerPage={reviewsPerPage}
          totalReviews={reviews.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, reviewsPerPage, totalReviews, paginate }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  for (let i = 1; i <= Math.ceil(totalReviews / reviewsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md border-solid border-2 hover:border-sky-500 p-1"
        >
          prev
        </button>
        <span className="rounded-md first-line:bg-slate-200 p-1">{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md border-solid border-2 hover:border-sky-500 p-1"
        >
          next
        </button>
      </div>
    </nav>
  );
};

export default ReviewsDisplay;
