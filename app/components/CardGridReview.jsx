// CardGridSection.js

import React from 'react';
import CardReview from './listings/CardReview';
import { FaRegCheckCircle } from "react-icons/fa";


const CardGridReview = ({ reviews }) => {
  // Loop through the reviews 3 times and create cards
  const getRandomIndex = (max) => {
    return Math.floor(Math.random() * max);
  };

  const cards = Array(3).fill().map(() => {
    const randomIndex = getRandomIndex(reviews.length);
    const review = reviews[randomIndex];

    return {
      name: (review?.user?.name || '') + (review?.user?.mname ? ' ' + review?.user?.mname : '') + (review?.user?.lname ? ' ' + review?.user?.lname : '') || review?.spa?.name,
      content: review?.feedback,
      icon: <FaRegCheckCircle style={{ fontSize: '50px' }} />,
    };
  });

  return (
    <div className="container mt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-3">
      {cards.map((card, index) => (
        <CardReview key={index} name={card.name} content={card.content} icon={card.icon} />
      ))}
    </div>
  );
};

export default CardGridReview;
