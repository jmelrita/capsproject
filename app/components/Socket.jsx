'use client'
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";



const Socket = ({ currentUser }) => {
    const userId = currentUser?.id;
    useEffect(() => {
        const socket = io("http://localhost:3001", { transports: ["websocket"] });

        // Emitting userId to server upon connection
        socket.emit('myId', userId);
        socket.on('book accepted', (data1) => {
            const notificationSound = new Audio('/notification.mp3');
            notificationSound.play();
            toast.info(`${data1}`);


        });
        /* return () => {
            // Clean up socket event listener upon unmounting
            socket.off('book accepted');
            socket.disconnect();
        }; */
    }, []);
    return (
        <>
            <ToastContainer />
        </>


    )
}

export default Socket