'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function NotificationModal({ currentUser }) {
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    useEffect(() => {
        const fetchType = async () => {
            if (currentUser) {
                try {
                    const response = await fetch(`/api/getNotification/${currentUser.id}`);
                    const Data = await response.json();

                    setNotification(Data.notification);
                    console.log(Data.newNotifCount);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching notification data:', error);
                    setLoading(false);
                }
            }
        };
        fetchType();
    }, []);


    if (loading) {
        return <div className='
                absolute
                rounded-xl
                shadow-md
                w-[100vw]
                md:w-1/2
                sm:w-1/2
                bg-white
                right-0
                top-12
                text-sm
                text-center
                border
                
            '>
            <div className="absolute inset-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </div>
    }

    return (

        <div className='
        absolute
        rounded-xl
        shadow-md
        w-[90vw]
        md:w-1/2
        sm:w-1/8
        bg-white
        right-0
        top-12
        text-sm
        border
        border-stone-300
        h-80
        '
            style={{ scrollbarWidth: "thin", scrollbarColor: "linear-gradient(180deg, #ececec 0%, #d6d6d6 100%) linear-gradient(180deg, #d6d6d6 0%, #bababa 100%)", overflowY: "scroll" }}
        >

            <ul className='
                px-4
                py-2
                hover:bg-neutral-100
                transition
                font-semibold
            '>
                {/* Replace this with your notification items */}
                {notification?.length === 0 ? (
                    <li className="py-2">NO NOTIFICATIONS</li>
                ) : (
                    <ul>
                        {/* Replace this with your notification items */}
                        {notification?.map((notif, index) => (
                            <li key={index} className="py-2 px-2 cursor-pointer border-b border-gray-200 hover:bg-[#c7b198] rounded-md">{notif?.notification_message}</li>
                        ))}
                    </ul>
                )}
            </ul>
        </div>

    );
}

export default NotificationModal;
