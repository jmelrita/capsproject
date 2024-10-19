'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '../components/Button';
//import toast from 'react-hot-toast';
import useLoginModal from '@/app/hooks/useLoginModal';
import { getSession } from 'next-auth/react';
import GoogleMap from '../components/GoogleMap';
import useDataStore from '../hooks/useDataStore';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import axios from 'axios';
import { storage } from '../config';
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytes } from 'firebase/storage';
import ImageModal from './modals/ImageModal';
import { AiTwotoneCloseCircle } from "react-icons/ai";
import Container from './Container';
import Load from './Load';
import ReactStars from 'react-stars';

const YOUR_GOOGLE_MAP_API_KEY = 'AIzaSyAwk5DsXfcCdS7OQDzJ4dfwLLAfBqWHrd8';



const Book = ({ currentUser }) => {
    const loginModal = useLoginModal();
    const searchParams = useSearchParams();
    //const spa = searchParams.get('spaname');
    //const image = searchParams.get('image');
    //const spaId = searchParams.get('listingId');
    //const spaNumber = searchParams.get('spaNumber');
    //const gcashName = searchParams.get('gcashname');
    const spaId = searchParams.get('listingId');
    const router = useRouter();
    const [type, setType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMassageType, setSelectedMassageType] = useState('0');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [voucherCode, setVoucherCode] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [ETA, setETA] = useState('');
    const { EstimatedTime, setEstimatedTime } = useDataStore();
    const [selectedServiceType, setSelectedServiceType] = useState('0');
    const [spaData, setSpa] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [voucherAmount, setVoucherAmount] = useState(0);
    const [inValid, setInValid] = useState(false);
    const [inValidSpa, setInValidSpa] = useState(false);
    const [expiredCode, setExpiredCode] = useState(false);
    const [overallRatings, setOverallRatings] = useState(0);
    const [ratingCounts, setRatingCounts] = useState(0);
    const [rating, setRating] = useState(0);
    const [data, setData] = useState(null);
    const [data2, setData2] = useState(null);


    const handleApplyVoucher = async () => {
        try {
            const response = await fetch(`/api/getVoucher/${voucherCode}?userId=${currentUser.id}&spaId=${spaId}`);
            if (response.status === 404) {
                setInValid(true);
                setVoucherAmount(0);
                setExpiredCode(false);
                setInValidSpa(false);
            } else if (response.status === 400) {
                setInValid(false);
                setInValidSpa(true);
                setVoucherAmount(0);
                setExpiredCode(false);
            } else if (response.status === 403) {
                setInValid(false);
                setInValidSpa(false);
                setVoucherAmount(0);
                setExpiredCode(true);
            } else {
                const amount = await response.json();
                setVoucherAmount(amount.value);
                setInValid(false);
                setLoading(false);
                setInValidSpa(false);
                setExpiredCode(false);
            }

        } catch (error) {
            console.error('Error fetching voucher data:', error);
            setInValid(true);
            setLoading(false);
        }

    }

    console.log(voucherCode)
    console.log(voucherAmount)

    useEffect(() => {
        const fetchType = async () => {
            if (currentUser) {
                try {
                    const response = await fetch(`/api/bookdetail/${currentUser?.id}`);
                    const Data = await response.json();

                    setData(Data.booking);
                    setData2(Data.spa);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching massage data:', error);
                    setLoading(false);
                }
            }

        };
        fetchType();
    }, [currentUser?.id]);

    useEffect(() => {
        const fetchSpa = async () => {
            if (!spaId) {
                console.error('No spaId provided');
                setLoading(false);
                return;
            }
    
            if (data) {
                router.push(`/bookdetails`);
            } else {
                try {
                    const response = await fetch(`/api/spa/${spaId}?currentUser=${currentUser.id}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch spa data: ${response.statusText}`);
                    }
                    
                    const spaData = await response.json();
                    setSpa(spaData);
                    setRatingCounts(spaData.ratingCounts);
                    setOverallRatings(spaData.totalRatings);
                    setRating(spaData.totalRatings);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching spa data:', error);
                    setLoading(false);
                }
            }
        };
        
        fetchSpa();
    }, [spaId, data]);
    


    const handleAddressChange = (address) => {
        setSelectedAddress(address);
    };
    const handleVoucherChange = (e) => {
        setVoucherCode(e);
    };



    const handleETAChange = (duration) => {
        setETA(duration);
        setEstimatedTime(duration);
    }

    const handleMassageTypeChange = (event) => {
        setSelectedMassageType(event.target.value);
    };

    const handleImageUpload = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleServiceType = (event) => {
        setSelectedServiceType(event.target.value);
    }

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


    const handleConfirmation = async () => {
        if (!selectedImage) {
            alert("Please select an image");
            return;
        }
        const fileRef = ref(storage, `images/${currentUser.id}/payment/${selectedImage.name}`)
        const snapshot = await uploadBytes(fileRef, selectedImage);
        const downloadURL = await getDownloadURL(ref(storage, `images/${currentUser.id}/payment/${selectedImage.name}`))
        console.log('downloaded URL', downloadURL)
        try {
            const formData = new FormData();
            formData.append('spaId', spaId);
            formData.append('massageId', selectedMassageType);
            formData.append('status', 0);
            formData.append('address', selectedAddress);
            formData.append('ETA', ETA.duration);
            formData.append('serviceType', selectedServiceType);
            formData.append('paymentImage', downloadURL);
            formData.append('discount', voucherAmount);
            formData.append('voucherCode', voucherCode);

            const formDataJSON = {};
            for (const [key, value] of formData.entries()) {
                formDataJSON[key] = value;
            }

            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set Content-Type header to indicate JSON data
                },
                body: JSON.stringify(formDataJSON),
            });

            if (response.ok) {
                console.log('Booking successful!');
                toast.success("BOOKED");
                setTimeout(() => {
                    router.push(`/bookdetails`);
                }, 3000);

                const socket = io("http://localhost:3001", { transports: ["websocket"] });
                console.log("ran 1st");
                socket.emit('book request', { spaId, message: `New Booking request from ${currentUser.email}` });
                const notifMessage = `New Booking request from ${currentUser.email}`;
                const notifdata = {
                    notifMessage: notifMessage,
                    spaId: spaId,
                }
                axios.post('/api/createNotification', notifdata)
                    .then(() => {
                    })
                    .catch((error) => {
                        toast.error('Something went wrong');
                    })

            } else {
                console.error('Failed to book:', response.statusText);
                toast.error('Please Re-check your details.');
            }
        } catch (error) {
            console.error('Error booking:', error);
        }
    };

    useEffect(() => {
        const fetchType = async () => {
            try {
                const response = await fetch(`/api/massage/${selectedMassageType}`);
                const typeData = await response.json();

                setType(typeData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching massage data:', error);
                setLoading(false);
            }
        };
        fetchType();
    }, [selectedMassageType]);


    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <Load />
    }

    return (
        <>
            <ToastContainer />
            <Container>
                <div className='pt-24 pb-24 bg-[#e2e1e0]'>
                    <div className="min-h-screen flex flex-col items-center place-content-center">
                        <h1 className="text-3xl mb-4">{spaData?.spa?.name}</h1>
                        <div className='flex flex-row items-center gap-1 mb-3'>
                            <div className='items-center gap-1 mb-3'>
                                <div className='font-semibold'>
                                    Overall Ratings - {overallRatings}({ratingCounts} Reviews)
                                </div>
                                <div className="w-fit m-auto">
                                    <ReactStars
                                        value={rating}
                                        onChange={(nextValue, prevValue, name) => handleStarClick(nextValue, prevValue, name)}
                                        count={5}
                                        size={24}
                                        edit={false}
                                        color2={'#ffd700'} />
                                </div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 w-full max-w-5xl">
                            <img className="col-span-1 rounded-lg" src={spaData?.spa?.image || "/images/placeholder.jpg"} alt="image" />
                            <div className="col-span-2 pl-2 pr-2">
                                <div className='font-light text-sm text-neutral-500 mb-3'>
                                    <div className="max-w-full mx-auto">
                                        <div className="mb-4">
                                            <label htmlFor="massage-type" className=" flex  text-gray-700 text-lg font-bold mb-2">Massage Type<p>*</p></label>
                                            <div className="relative max-w-md">
                                                <select
                                                    id="massage-type"
                                                    name="massage-type"
                                                    className="shadow appearance-none border border-[#c7b198] rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    value={selectedMassageType}
                                                    onChange={handleMassageTypeChange}>
                                                    <option value="0"></option>
                                                    <option value="1">Whole body massage</option>
                                                    <option value="2">Half body massage</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full max-w-5xl">
                                            <h1 className="font-bold text-lg mt-3"> {type ? (<div>Duration: {type?.duration}mins.</div>) : (
                                                <div>Duration:</div>
                                            )}</h1>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="massage-type" className="block text-gray-700 text-lg font-bold mb-2">Service Type</label>
                                            <div className="relative max-w-md">
                                                <select
                                                    id="massage-type"
                                                    name="massage-type"
                                                    className="shadow appearance-none border border-[#c7b198] rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    value={selectedServiceType}
                                                    onChange={handleServiceType}>
                                                    <option value="0"></option>
                                                    <option value="1">Home Service</option>
                                                    <option value="2">Reservation to Visit</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        {selectedServiceType == '0' || selectedServiceType == '1' ? (
                                            <div className="mb-0 mt-3">
                                                <label htmlFor="address" className="block text-gray-700 text-lg font-bold mb-2">
                                                    Address <p className='text-sm font-thin'>*Please mark your exact location/house</p>
                                                </label>
                                                <input id="address"
                                                    name="address" type="text"
                                                    placeholder="Enter your address"
                                                    className="shadow appearance-none border border-[#c7b198] rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    value={selectedAddress}
                                                    onChange={handleAddressChange}
                                                />
                                                <div style={{ height: '400px', width: '100%' }}>
                                                    <GoogleMap apiKey={YOUR_GOOGLE_MAP_API_KEY} spaId={spaId} currentUser={currentUser} onAddressChange={handleAddressChange} onETAChange={handleETAChange} />
                                                </div>
                                                <div className="w-full max-w-5xl">
                                                    <h1 className="font-bold text-lg mt-5">Estimated Time Of Arrival: {ETA.duration}</h1>
                                                    <p className='text-sm font-thin'>*(from spa location to your location)</p>
                                                </div>
                                            </div>
                                        ) : (<>
                                            <div className="pointer-events-none relative">
                                                <div className="absolute inset-0 bg-gray-200 opacity-50"></div>
                                                <div className="mb-0 mt-3">
                                                    <label htmlFor="address" className="block text-gray-700 text-lg font-bold mb-2">
                                                        Address <p className='text-sm font-thin'>*Please mark your exact location/house</p>
                                                    </label>
                                                    <input id="address"
                                                        name="address" type="text"
                                                        placeholder="Enter your address"
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value=""
                                                        onChange={() => { }}
                                                    />
                                                    <div style={{ height: '400px', width: '100%' }}>
                                                        <GoogleMap apiKey={YOUR_GOOGLE_MAP_API_KEY} spaId={spaId} onAddressChange={handleAddressChange} onETAChange={handleETAChange} />
                                                    </div>
                                                    <div className="w-full max-w-5xl">
                                                        <h1 className="font-bold text-lg mt-5">Estimated Time Of Arrival: {ETA.duration}</h1>
                                                        <p className='text-sm font-thin'>*(from spa location to your location)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>)}
                                        <div className='border-sm border-2 bg-white mt-1' style={{ width: '200px', display: 'flex' }}>
                                            <input id="address"
                                                name="address" type="text"
                                                placeholder="ENTER VOUCHER CODE"
                                                className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={voucherCode}
                                                onChange={(e) => handleVoucherChange(e.target.value)}
                                            />
                                            <AiTwotoneCloseCircle className='w-8 m-auto cursor-pointer' size={18} onClick={() => { setVoucherAmount(0); setVoucherCode(''); setInValid(false); setInValidSpa(false); setExpiredCode(false); }} />
                                            <button className='w-1/4 text-white bg-orange-500 py-1 hover:bg-orange-600' onClick={() => { handleApplyVoucher() }}>apply</button>
                                        </div>
                                        {inValid ? (<p className='text-rose-800'>Invalid Voucher Code</p>) : (<></>)}
                                        {inValidSpa ? (<p className='text-rose-800'>This Code is not for this Spa</p>) : (<></>)}
                                        {expiredCode ? (<p className='text-rose-800'>This Code is Expired</p>) : (<></>)}

                                        <div className="w-full max-w-5xl">
                                            <h1 className="font-bold text-lg mt-5"> {type ? (<div>Subtotal: ₱{parseFloat(type.price).toFixed(2)}</div>) : (
                                                <div>Subtotal: ₱0.00</div>
                                            )}</h1>
                                        </div>
                                        <div className="w-full max-w-5xl">
                                            <h1 className="font-bold text-lg mt-5"> {voucherAmount ? (<div className='flex'>Voucher Discount: ₱<p className='text-orange-500'>-{parseFloat(voucherAmount).toFixed(2)}</p></div>) : (
                                                <div>Voucher Discount: ₱0.00</div>
                                            )}</h1>
                                        </div>
                                        <div className="w-full max-w-5xl">
                                            <h1 className="font-bold text-lg mt-5"> {type ? (<div>total: ₱{(parseFloat(type.price) - (voucherAmount)).toFixed(2)}</div>) : (
                                                <div>total: ₱0.00</div>
                                            )}</h1>
                                        </div>
                                        <div className='mt-5 max-w-md'>
                                            <Button
                                                disabled={false}
                                                small
                                                label={'BOOK NOW'}
                                                //onClick={{}}
                                                onClick={handleFormSubmit}
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {showConfirmationModal && (

                            <div className="justify-center
          items-center
          flex
          overflow-x-hidden
          overflow-y-auto
          fixed
          inset-0
          z-50
          outline-none
          focus:outline-none
          bg-neutral-800/70">
                                <div className="bg-white p-8 rounded-md max-w-md">
                                    <h1 className='text-center font-bold'>PLEASE READ BEFORE CONFIRMATION</h1>
                                    <div className='divide-y divide-slate-700'>
                                        <div className='mb-4'>
                                            {selectedServiceType == "2" ? (<>Spa Address: {selectedAddress}</>) : (<>Your Address: {selectedAddress}</>)}
                                            <br />
                                            {type ? (<div>Subtotal: ₱{parseFloat(type.price).toFixed(2)}</div>) : (
                                                <div>Subtotal: ₱0.00</div>
                                            )}
                                            {type ? (<div>total: ₱{(parseFloat(type.price) - voucherAmount).toFixed(2)}</div>) : (
                                                <div>total: ₱0.00</div>
                                            )}
                                        </div>
                                        <div>
                                            <br />
                                            Do you agree to the terms and conditions?
                                            <br />
                                            Terms and conditions:
                                            <br />
                                            1. This booking is subject to availability.
                                            <br />
                                            2. You agree to pay the required fees.
                                            <br />
                                            3. No cancellation once the book is accepted.
                                            <br /><br />
                                            Are you sure you want to proceed?
                                        </div>

                                        <div className="w-full max-w-5xl">
                                            <p className='text-sm font-thin mt-2 text-rose-950'>*(Please upload proof of Payment before confirmation)</p>
                                            <h1 className="font-semibold text-md ">Gcash Number: {spaData?.spa?.phoneNum}</h1>
                                            <h1 className="font-semibold text-md mt-1">Gcash Name: {spaData?.spa?.gcashname}</h1>
                                        </div>
                                        <div className="w-full max-w-5xl">
                                            <h1 className="font-semibold text-md mt-1">Proof of Payment:</h1>
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                id="image-upload"
                                                name="image-upload"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-w-md"
                                                onChange={handleImageUpload}
                                            />

                                            {selectedImage && (
                                                <img src={URL.createObjectURL(selectedImage)} alt="Uploaded image" className='h-36 m-auto' onClick={() => handleImageClick(selectedImage)} />
                                            )}

                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-4 gap-2">
                                        <Button label="Cancel" onClick={() => { setShowConfirmationModal(false); setSelectedImage(null) }} />
                                        <Button label="Confirm" onClick={handleConfirmation} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {isModalOpen && <ImageModal imageUrl={selectedImage} closeModal={closeModal} />}
                    </div>
                </div>
            </Container>

        </>

    )
}

export default Book