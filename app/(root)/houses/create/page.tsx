import ListingForm from '@/components/shared/ListingForm'
import { auth } from '@clerk/nextjs'
import React from 'react'

const CreateListing = () => {
    const {sessionClaims} = auth();
    const userId = sessionClaims?.userId as string;
    console.log(userId)

  return (
  <>
    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10 '>
        <h3 className='wrapper h3-bold text-center sm:text-left'>Create Listing</h3>
    </section>
    <div className='wrapper my-8'>
        <ListingForm userId={userId} type='Create' />
    </div>
    </>
  )
}

export default CreateListing