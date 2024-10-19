import React from 'react'
import Profile from '../components/Profile'
import getCurrentUser from '../actions/getCurrentUser'

const MyProfile = async () => {
  const currentUser = await getCurrentUser();
  return (
    <> 
    <div className='bg-gray-200 pb-24 h-fit'>
      <Profile currentUser={currentUser}/>
    </div>
    </>
  )
}

export default MyProfile