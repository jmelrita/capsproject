
import React from 'react';
import Image from 'next/image';
import CardGridSection from '../components/CardGridSection';
import backgroundImage from "@/public/images/home.jpeg";

function About(props) {
    return (
        <>
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
            <section id=''>
                <div name='home' className='h-screen w-full bg-slate-100'>
                    <div className='w-10/12 mx-auto flex flex-col items-center justify-center h-full md:flex-row'>
                        <div className='flex flex-col justify-center h-auto md:h-full md:w-1/2'>
                            <h2 className='text-4xl sm:text-5xl md:text-7xl font-bold text-amber-950 text-center md:text-left'>Welcome to Pa-Healot</h2>
                            <p className='text-amber-950 text-xl md:text-2xl py-4 text-center md:text-left'>
                                At Pa-Healot, we believe in the power of healing touch and the extraordinary abilities that come from within. Our mission is to redefine wellness by offering a unique and enriching experience through the skilled hands of our blind masseurs.
                            </p>
                        </div>
                        <div className='flex justify-center items-center w-full md:w-1/2'>
                            <Image
                                src="/images/unsplash.png"
                                alt='my profile'
                                className='rounded-2xl object-cover min-w-full max-w-full md:max-w-md'
                                height="500"
                                width="750" />
                        </div>
                    </div>
                </div>
            </section>
            <section id=''>
                <div name='home' className='h-fit w-full bg-slate-100 pb-5'>
                    <div className='w-10/12 mx-auto flex flex-col items-center justify-center h-full md:flex-row'>
                        <div className='flex justify-center items-center w-full md:w-1/2'>
                            <Image
                                src="/images/unsplash2.png"
                                alt='my profile'
                                className='rounded-2xl object-cover min-w-full max-w-full md:max-w-md'
                                height="500"
                                width="750" />
                        </div>
                        <div className='flex flex-col justify-center h-auto md:h-full md:w-1/2'>
                            <h2 className='text-4xl sm:text-5xl md:text-7xl font-bold text-amber-950 text-center md:text-left'>Our Vision</h2>
                            <p className='text-amber-950 text-xl md:text-2xl py-4 text-center md:text-left'>
                                Pa-Healot envisions a world where healing is not limited by sight. We aspire to create a sanctuary of relaxtion and rejuvenation, where the art of massage is elevated by the intuitive touch and deep empathy of our blind masseurs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section id='' style={{ paddingBottom: '35px' }}>
                <div>
                    {/* Other content or components */}
                    <CardGridSection />
                </div>
            </section>
            <section id=''>
                <div name='home' className='h-screen w-full bg-slate-100'>
                    <div className='w-10/12 mx-auto flex flex-col items-center justify-center h-full md:flex-row'>
                        <div className='flex flex-col justify-center h-auto md:h-full md:w-1/2'>
                            <h2 className='text-4xl sm:text-5xl md:text-7xl font-bold text-amber-950 text-center md:text-left'>Book Your Healing Experience</h2>
                            <p className='text-amber-950 text-xl md:text-2xl py-4 text-center md:text-left'>
                                Pa-Healot invites you to immerse yourself in a world where touch knows no bounds. Book your appointment today and embark on a journey to wellness with Pa-Healot, where every touch tells a story of resilience and renewal.
                            </p>
                        </div>
                        <div className='flex justify-center items-center w-full md:w-1/2'>
                            <Image
                                src="/images/unsplash2.png"
                                alt='my profile'
                                className='rounded-2xl object-cover min-w-full max-w-full md:max-w-md'
                                height="500"
                                width="750" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default About;