'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Load from './Load';

const OrderHistory = ({ currentUser }) => {
    const [bookingHistory, setBookingHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;
    const router = useRouter();

    useEffect(() => {
        const fetchBookings = async () => {
            if (currentUser) {
                try {
                    const response = await fetch(`/api/getBookings/${currentUser?.id}`);
                    const bookingData = await response.json();
                    setBookingHistory(bookingData);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching booking data:', error);
                    setLoading(false);
                }
            }else{
                router.push('/')
            }
        };
        fetchBookings();
    }, [currentUser?.id]);

    useEffect(() => {
        if (bookingHistory) {
            setTotalPages(Math.ceil(bookingHistory.length / itemsPerPage));
        }
    }, [bookingHistory]);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    if (loading) {
        return <Load />
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = bookingHistory.slice(startIndex, endIndex);

    return (
        <div className="flex flex-col items-center justify-center h-fullscreen bg-cover bg-center w-10/12 pt-28 m-auto cursor-pointer pb-20" style={{

        }}>
            <div className='w-full border-solid border-2 rounded-lg mb-5' style={{ borderColor: '#c7b198' }}>
                <h1 className="sm:text-left text-center text-3xl font-bold m-10 ">My Order History</h1>
            </div>
            {currentItems !== 0 ? (<>
                {currentItems?.map(history => (
                    <div key={history.id} className="border-b pb-0 mb-5 border-y-stone-600 w-9/12 mx-auto"
                        onClick={() => {
                            if (history?.status < 3) {
                                router.push(`bookdetails`);
                            } else
                                router.push(`Orders`);
                        }}
                    >
                        <div className="flex flex-col md:flex-row justify-between mb-0">
                            <div className="mb-3 md:mb-0">
                                <div className=" font-bold text-sm">Order <span className='text-cyan-600 inline font-normal'>#{history.id}</span></div>
                                <p>Date: {new Date(history?.createdAt).toDateString().replace(/\sGMT.*$/, '')} {new Date(history.createdAt).toLocaleTimeString()}</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold">Status: {history.bookingStatus.status}</p>
                                <p>Total: ₱{parseFloat((history?.massage?.price)-(history?.discount)).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-3 md:mb-0 md:w-1/4 aspect-square
                            w-full
                            relative
                            overflow-hidden
                            rounded-xl">
                                <Image
                                    fill
                                    alt="listing"
                                    src={history?.spa?.image || '/images/logo.png'}
                                    className='
                                    object-cover
                                    h-full
                                    w-full
                                    group-hover:scale-110
                                    transition
                                '
                                />
                            </div>
                            <div className="md:w-3/4 pl-5">
                                <p className='font-bold uppercase'>{history?.spa?.name}</p>
                                <div className='flex gap-2'>Therapist: <p className='uppercase'>{history?.therapist?.fname} {history?.therapist?.mname} {history?.therapist?.lname}</p></div>
                                <p>Price: ₱{parseFloat(history?.massage?.price).toFixed(2)}</p>
                                <div className='flex gap-2'>Discount: <p className='text-orange-500'>-₱{parseFloat(history?.discount).toFixed(2)}</p></div>
                                
                            </div>
                        </div>
                    </div>
                ))}
            </>) : (<>No history</>)}
            <div className="pagination flex justify-center">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="rounded-md border-solid border-2 hover:border-sky-500 p-1 mr-1"
                >
                    prev
                </button>
                <span className="rounded-md first-line:bg-slate-200 p-1">{currentPage}</span>
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="rounded-md border-solid border-2 hover:border-sky-500 p-1 ml-1"
                >
                    next
                </button>
            </div>
        </div>

    );
};

export default OrderHistory;
