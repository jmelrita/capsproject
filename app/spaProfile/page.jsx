//"use client"
import React from 'react'

import SpaProfile from '@/app/components/listings/SpaProfile';
import ClientOnly from '@/app/components/ClientOnly';
import getCurrentUser from '../actions/getCurrentUser';



const Profile = async () => {
    const CurrentUser = await getCurrentUser();

    return (
        <ClientOnly>
                <div className='pb-24'>
                    <SpaProfile CurrentUser={ CurrentUser} />
                </div>       
        </ClientOnly>

    )
}

export default Profile