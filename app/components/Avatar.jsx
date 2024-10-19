'use client';

import Image from 'next/image';
import React from 'react';

const Avatar = ({ src }) => {
  return (
    
    <img className="w-8 h-8 rounded-full" src={src || "/images/placeholder.jpg"} alt="Rounded avatar" />
  );
};

export default Avatar;