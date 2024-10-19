'use client';

import React from 'react';

const UserMenuItem = ({ label, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='
        px-4
        py-2
        hover:bg-neutral-100
        transition
        font-semibold
      '
    >
      {label}
    </div>
  );
};

export default UserMenuItem;