'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoNotificationsOutline } from "react-icons/io5";

import { signOut } from 'next-auth/react';
import NavMenuItem from './NavMenuItem';
import Avatar from '../Avatar';
import UserMenuItem from './MenuItem';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import { useRouter } from 'next/navigation';
import NotificationModal from '../NotificationModal';
import MenuModal from '../modals/MenuModal';


const NavMenu = ({
  currentUser
}) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuModal, setMenuModal] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
    setIsModalOpen(false);
  }, []);

  const toggleModal = async () => {
    setIsModalOpen(!isModalOpen);
    setIsOpen(false);

    try {
      const response = await fetch(`/api/updateNotif/${currentUser.id}`, {
        method: 'PUT', // Assuming you want to update the notification using a PUT request
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ /* Optionally, you can pass data to update */ })
      });

      if (!response.ok) {
        throw new Error('Failed to update notification');
      }

      // Handle success response here if needed
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const toggleMenuModal = async () => {
    setMenuModal(true);
  }
  const closeModal = () => {
    setMenuModal(false);
  }


  useEffect(() => {
    const fetchType = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`/api/getNotification/${currentUser?.id}`);
          const Data = await response.json();
          setUnreadCount(Data.newNotifCount);
        } catch (error) {
          console.error('Error fetching notification data:', error);
        }
      }
    };

    // Initial fetch
    fetchType();
    if (currentUser) {
      // Set up interval to fetch every 2 seconds
      const intervalId = setInterval(fetchType, 2000);

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [currentUser?.id]);



  return (
    //asdasdsa
    <div className='relative'>
      <div className='flex flex-row items-center gap-3'>
        <NavMenuItem item="Home" url=" " />
        <NavMenuItem item="Spa" url="spa" />
        <NavMenuItem item="Services" url="services" />
        <NavMenuItem item="About Us" url="about" />
        <NavMenuItem item="Contact Us" url="contact" />
        <p className='
        block
        md:hidden
        text-sm
        font-semibold
        py-3
        px-4
        hover:text-[#c7b198]
        transition
        cursor-pointer
        uppercase
      '
          onClick={toggleMenuModal}
        >Menu</p>
        {currentUser ? (<>
          <div className="relative">
            <IoNotificationsOutline
              size={41.7}
              className='p-2 border-[1px] border-stone-400 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition hover:text-[#c7b198]'
              onClick={toggleModal}
            />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </div>
        </>) : (<></>)}
        <div
          onClick={toggleOpen}
          className='
            p-1 
            md:py-1
            md:px-2
            border-[1px]
            border-stone-500
            flex
            flex-row
            items-center
            gap-3
            rounded-full
            cursor-pointer
            hover:shadow-md
            transition
          '
        >
          <div>
            <AiOutlineMenu />
          </div>
          <div className=''>
            <Avatar
              src={currentUser?.image}
            />
          </div>
        </div>
      </div>


      {isOpen && (
        <div
          className='
            absolute
            rounded-xl
            shadow-md
            w-[50vw]
            md:w-1/4
            bg-white
            overflow-hidden
            right-0
            top-12
            text-sm
            border
            border-stone-300
          '
        >
          <div className='flex flex-col cursor-pointer'>
            {currentUser ? (
              <>
                <UserMenuItem
                  onClick={() => { router.push(`profile`) }}
                  label='Profile'
                />
                <UserMenuItem
                  onClick={() => { router.push(`Orders`) }}
                  label='My Order'
                />
                <UserMenuItem
                  onClick={() => { router.push(`Vouchers`) }}
                  label='Vouchers'
                />
                <hr />
                <UserMenuItem
                  onClick={() => signOut()}
                  label='Logout'
                />
              </>
            ) : (
              <>
                <UserMenuItem label="Login" onClick={loginModal.onOpen} />
                <UserMenuItem label="Sign up" onClick={registerModal.onOpen} />
              </>
            )}
          </div>
        </div>
      )}
      {isModalOpen && (
        <NotificationModal onClose={toggleModal} currentUser={currentUser} />
      )}
      {menuModal && <MenuModal closeModal={closeModal} />}
    </div>
  );
};

export default NavMenu;