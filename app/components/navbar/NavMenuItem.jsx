'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const NavMenuItem = ({ item, url }) => {
  const router = useRouter()
  return (
    <div
      className='
        hidden
        md:block
        text-sm
        font-semibold
        py-3
        px-4
        hover:text-[#c7b198]
        transition
        cursor-pointer
        uppercase
      '
      onClick={() => {router.push(`/${url}`)}}
    >
      {item}
    </div>    
  );
};

export default NavMenuItem;