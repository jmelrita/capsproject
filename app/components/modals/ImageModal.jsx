// Modal.js

import React from 'react';

const ImageModal = ({ imageUrl, closeModal }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-md p-6 ">
                <img src={URL.createObjectURL(imageUrl)} alt="Clicked image" className="max-w-full max-h-screen" />
                <button className="absolute top-0 right-0 p-2" onClick={closeModal}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600 hover:text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );

};

export default ImageModal;
