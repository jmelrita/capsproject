'use client';
import React from 'react';
import backgroundImage from "../public/images/home.jpeg";
import { useRouter } from 'next/navigation';
import About from './about/page';
import Contact from './contact/page';


export default function Home() {
  const router = useRouter();

  return (
    <div className=''>
      <div
        className=""
        style={{
          backgroundImage: `url(${backgroundImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          position: 'fixed',
          width: '100%',
          zIndex: '-1'
        }}
      ></div>
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
        style={{}}
      >
        <h1 className="text-white font-bold text-6xl md:text-8xl text-center mb-8">Beyond Vision, Embrace the Healing Touch.</h1>
        <div className="mt-8">
          <button
            className="px-6 py-3 md:px-6 md:py-4 bg-[#947a5c] hover:bg-[#aa8f6f] text-white font-bold rounded-md cursor-pointer transition duration-300"
            onClick={() => { router.push(`spa`) }}
          >
            BOOK AN APPOINTMENT
          </button>
        </div>
      </div>
      <About />
      <Contact />
    </div>
  );
}
