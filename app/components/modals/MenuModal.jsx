import React from 'react'
import { useRouter } from 'next/navigation';

const MenuModal = ({ closeModal }) => {
    const router = useRouter();
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-slate-900 rounded-md p-6 w-screen max-w-md h-screen">
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
                <div className='top-0 left-0 w-full h-full flex justify-center items-center'>
                    <ul className="text-center text-white">
                        <li className="py-5 hover:underline" onClick={()=>{router.push(`/`); closeModal();}}>HOME</li>
                        <li className="py-5 hover:underline" onClick={()=>{router.push(`spa`); closeModal();}}>SPA</li>
                        <li className="py-5 hover:underline" onClick={()=>{router.push(`services`); closeModal();}}>SERVICES</li>
                        <li className="py-5 hover:underline" onClick={()=>{router.push(`about`); closeModal();}}>ABOUT US</li>
                        <li className="py-5 hover:underline" onClick={()=>{router.push(`contact`); closeModal();}}>CONTACT US</li>
                    </ul>
                </div>

            </div>
        </div>

    )
}

export default MenuModal