"use client"

import { IHouses } from '@/lib/database/models/houses.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Checkout from './Checkout'

const CheckoutButton = ({ listing }: { listing: IHouses }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;

  return (
    <div className="flex items-center gap-3">
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">
                Get House
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Checkout house={listing} userId={userId} />
          </SignedIn>
        </>
    </div>
  )
}

export default CheckoutButton