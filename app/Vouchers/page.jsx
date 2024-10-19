import React from 'react'
import VoucherList from '../components/VoucherList'
import getCurrentUser from '../actions/getCurrentUser'

const page = async () => {
  const currentUser = await getCurrentUser();
  return (
    <VoucherList currentUser={currentUser} />
  )
}

export default page
