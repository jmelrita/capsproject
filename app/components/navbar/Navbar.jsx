'use client';

import React from 'react';
import Container from '../Container';
import Logo from './Logo';
import NavMenu from './NavMenu';

function Navbar({ currentUser }) {
  return (
    <div
      className='
        fixed
        w-full
        bg-white
        z-10
        shadow-sm
      '
    >
      <div
        className='
          py-2
          border-b-[1px]
        '
      >
        <Container>
          <div
            className='
              flex
              flex-row
              items-center
              gap-3
              md:gap-0
              justify-end
              md:justify-between
            '
          >
            <Logo />
            <NavMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Navbar;