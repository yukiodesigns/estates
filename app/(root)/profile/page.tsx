import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getListingsByUser } from '@/lib/actions/house.actions'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const listingsPage = Number(searchParams?.listingsPage) || 1;
  const orders = await getOrdersByUser({ userId, page: ordersPage})
  const orderedListings = orders?.data.map((order: IOrder) => order.house) || [];
  const organizedListings = await getListingsByUser({ userId, page: listingsPage })

  return (
    <>
      {/* My Houses */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>My Houses</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#houses">Explore More Listings </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection 
          data={orderedListings} emptyTitle="No houses were purchased yet" emptyStateSubtext="No worries - plenty of luxurious houses to be bought!" collectionType="My_Houses" limit={3} page={ordersPage} urlParamName="ordersPage" totalPages={orders?.totalPages}/>
      </section>

      {/* Listings Organized */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Listings Organized</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/houses/create">Create New Listing</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection 
          data={organizedListings?.data} emptyTitle="No listings have been created yet" emptyStateSubtext="Go create some now" collectionType="Listings_Organized" limit={3} page={listingsPage} urlParamName="listingsPage" totalPages={organizedListings?.totalPages} />
      </section>
    </>
  )
}

export default ProfilePage