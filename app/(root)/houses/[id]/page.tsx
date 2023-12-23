import CheckoutButton from '@/components/shared/CheckoutButton';
import Collection from '@/components/shared/Collection';
import { getListingById, getRelatedListingsByCategory } from '@/lib/actions/house.actions'
import { SearchParamProps } from '@/types'
import Image from 'next/image';

const ListingDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const listing = await getListingById(id);
  const relatedListings = await getRelatedListingsByCategory({ categoryId: listing.category._id, houseId: listing._id, page: searchParams.page as string, })
  const organizerName = listing.organizer ? `${listing.organizer.firstName} ${listing.organizer.lastName}` : 'Unknown Organizer';

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image src={listing.imageUrl} alt="hero image" width={1000} height={1000} className="h-full min-h-[300px] object-cover object-center" />
          <div className="flex w-full flex-col gap-8 p-5 md:p-10">

            <div className="flex flex-col gap-6">
              <h2 className='h2-bold'>{listing.title}</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">{listing.isAvailable ? `${listing.price}` : ' Not Available'}</p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">{listing.category.name}</p>
                </div>
                <p className="p-medium-18 ml-2 mt-2 sm:mt-0"> by{' '}<span className="text-primary-500">{organizerName}</span></p>
              </div>
            </div>

            <CheckoutButton listing={listing} />

            <div className="flex flex-col gap-5">
              <div className="p-regular-20 flex items-center gap-3">
                <Image src="/assets/icons/location.svg" alt="location" width={32} height={32} />
                <p className="p-medium-16 lg:p-regular-20">{listing.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">What The House Has:</p>
              <p className="p-medium-16 lg:p-regular-18">{listing.description}</p>
            </div>

          </div>
        </div>
      </section>

      {/* EVENTS with the same category */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Listingss</h2>

        <Collection data={relatedListings?.data} emptyTitle="No Listings Found" emptyStateSubtext="Come back later" collectionType="All_Listings" limit={3} page={searchParams.page as string} totalPages={relatedListings?.totalPages} />
      </section>
    </>
  )
}

export default ListingDetails