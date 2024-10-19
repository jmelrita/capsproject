'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import io from "socket.io-client";
import axios from 'axios';
import Load from './Load';


const BookDetails = ({
  currentUser
}) => {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [serviceType, setServiceType] = useState();

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const session = await getSession();
    //const user = session.user;

    if (!session) {
      // Show the login modal if no session
      loginModal.onOpen();
    } else {
      setShowConfirmationModal(true);
    }
  };

  /* if (!currentUser) {
    router.push(`/`);
  } */

  useEffect(() => {
    const fetchType = async () => {
      const session = await getSession();

      if (session) {
        const response = await fetch(`/api/bookdetail/${currentUser?.id}`);
        const Data = await response.json();
        if (session.user.email === Data?.user?.email) {
          try {
            const response = await fetch(`/api/bookdetail/${currentUser?.id}`);
            const Data = await response.json();

            setEmail(session.user.email);
            setData(Data);
            setServiceType(Data.booking.serviceTypeId);

            setLoading(false);
          } catch (error) {
            console.error('Error fetching massage data:', error);
            setLoading(false);
          }
        } else {
          router.push(`/Orders`);
        }
      } else {
        router.push(`/`);
      }
    };
    const interval = setInterval(fetchType, 1000); // Refresh every 1 seconds

    return () => clearInterval(interval);

  }, [currentUser?.id]);

  const handleConfirmation = async () => {
    const spaId = data?.booking?.spaId;
    try {
      const response = await fetch(`/api/cancelBook/${data?.booking?.id}`);

      const socket = io("http://localhost:3001", { transports: ["websocket"] });
      console.log("ran 1st");
      socket.emit('book request', { spaId, message: `A booking has been cancelled` });
      const notifMessage = `A request with an order#${data?.booking?.id}, has been cancelled from ${currentUser?.email}`;
      const notifdata = {
        notifMessage: notifMessage,
        spaId: spaId,
      }
      axios.post('/api/createNotification', notifdata)
        .then(() => {
          toast.error('Booking Cancelled');
        })
        .catch((error) => {
          toast.error('Something went wrong');
        })


    } catch (error) {
      console.error('Error booking:', error);
    }
  }

  if (loading) {
   return <Load />
  }

  return (
    <div className='h-fit md:h-screen bg-gray-200 pb-24'>
      <div className="flex justify-center items-center bg-gray-200 pt-24">
        {data ? (
          <div className=" p-6 shadow-xl border-2 border-t-orange-500 border-b-orange-500" style={{ fontFamily: 'Muli', background: `#e2e1e0`, boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }}>
            {data?.booking?.status === 0 && (
              <p className="text-sm font-sm text-red-500">*PENDING</p>
            )}
            <h1 className="font-bold text-lg text-orange-500">
              Order #{data?.booking?.id}
            </h1>
            <div className="mt-4 md:flex">
              <label className="w-56 font-semibold">Your PA-HEALOT order from:</label>
              <p className="text-neutral-900">{data?.spa?.name}</p>
            </div>
            <div className="mt-4 md:flex">
              <label className="w-56 font-semibold">Service Type:</label>
              <p className="text-neutral-900">
                {serviceType === 2 ? "Reservation to visit Spa" : "Home Service"}
              </p>
            </div>
            <div className="mt-4 md:flex">
              <label className="w-56 font-semibold">Service Delivery Address:</label>
              <p className="text-neutral-900">{data?.booking?.address}</p>
            </div>
            <div className="mt-4 md:flex">
              <label className="w-56 font-semibold">Your E-mail:</label>
              <p className="text-neutral-900">{email}</p>
            </div>
            <div className="mt-4 md:flex">
              <label className="w-56 font-semibold">Subtotal:</label>
              <p className="text-neutral-900">₱{parseFloat(data?.massage?.price).toFixed(2)}</p>
            </div>
            <div className="mt-4 md:flex">
              <label className="w-56 font-semibold">Discount:</label>
              <div className="text-neutral-900 flex">₱<p className='text-orange-500'>-{parseFloat(data?.booking?.discount).toFixed(2)}</p></div>
            </div>
            <div className="mt-4 md:flex">
              <label className="w-56 font-semibold">Total:<p className="text-sm text-neutral-500">(Incl. Service Tax)</p></label>
              <p className="text-neutral-900">₱{(parseFloat(data?.massage?.price) - (data?.booking?.discount)).toFixed(2)}</p>

            </div>
            {data?.booking?.status === 0 ? (
              <div className="mt-6">
                <label className="font-semibold">You can still cancel this pending request</label>
                <button className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={handleFormSubmit}>
                  Cancel this Order
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <p className="font-semibold">You can no longer cancel this order, service is on its way.</p>
                <button className="mt-2 bg-gray-400 text-white font-semibold py-2 px-4 rounded cursor-not-allowed" disabled>
                  Cancel this Order
                </button>
                {serviceType === 1 ? (<>
                  <div className='m-auto w-64 text-lg'>
                    <div className="w-full items-center text-neutral-900 text-center mt-5 m-auto">
                      <div className='w-64 text-slate-900'>Your PA-HEALOT Therapist <p className='font-bold'>{data?.therapist?.fname} {data?.therapist?.mname} {data?.therapist?.lname}</p> is on its way.</div>
                    </div>
                    <div className="w-full items-center text-neutral-900 text-center mt-5 m-auto">
                      <img className="col-span-1 rounded-lg" src="/images/motorcycle.png" alt="image" />
                      <div className='w-64 text-slate-900 font-bold'>{data?.booking?.ETA}</div>
                      <p className='font-sm text-sm'>ESTIMATED TIME OF ARRIVAL</p>
                    </div>
                  </div>
                </>) : (<>
                  <div className='m-auto w-64 text-lg'>
                    <div className="w-full items-center text-neutral-900 text-center mt-5 m-auto">
                      <div className='w-64 text-slate-900'>Your PA-HEALOT Therapist <p className='font-bold'>{data?.therapist?.fname} {data?.therapist?.mname} {data?.therapist?.lname}</p> is ready.</div>
                    </div>
                    <div className="w-full items-center text-neutral-900 text-center mt-5 m-auto">
                      <p className='w-64 text-slate-900'>You can now visit our Spa</p>
                    </div>
                  </div>
                </>)}
              </div>
            )}
            {showConfirmationModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <div className="bg-white p-8 rounded-md max-w-md">
                  <h1 className="font-bold text-lg text-center mb-4">CANCELLATION POLICY</h1>
                  <div className="divide-y divide-gray-700">
                    <div className="py-4">
                      <p className="font-semibold">Do you agree to the terms and conditions?</p>
                      <p>Terms and conditions:</p>
                      <ol className="list-decimal list-inside pl-4">
                        <li>Cancellation may incur 10% charges.</li>
                        <li>No cancellation once the book is accepted.</li>
                      </ol>
                      <p className="mt-4">Upon cancellation please DM us in our official Facebook page or call us. Please provide your full name and ORDER#.</p>
                      <p className="mt-4">Are you sure you want to CANCEL your order?</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded" onClick={() => setShowConfirmationModal(false)}>Cancel</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={handleConfirmation}>Confirm</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">NO ACTIVE ORDER</div>
        )}
      </div>
    </div>
  )
}

export default BookDetails