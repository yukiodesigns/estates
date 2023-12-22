import ListingForm from '@/components/shared/ListingForm'
import { getListingById } from '@/lib/actions/house.actions'
import { auth } from '@clerk/nextjs'
import React from 'react'

type UpdateListingProps = {
  params: {
    id: string
  }
}


const UpdateListing = async ({ params: { id } }: UpdateListingProps) => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;
  const house = await getListingById(id)

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
      </section>

      <div className="wrapper my-8">
        <ListingForm type="Update" house={house} houseId={house._id} userId={userId} />
      </div>
    </>
  )
}

export default UpdateListing