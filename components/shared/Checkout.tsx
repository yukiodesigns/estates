import React, { useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '../ui/button';
import { checkoutOrder } from '@/lib/actions/order.actions';
import { IHouses } from '@/lib/database/models/houses.model';

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ house, userId }: { house: IHouses, userId: string }) => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }
    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  const onCheckout = async () => {
    const order = {
      houseTitle: house.title,
      houseId: house._id,
      price: house.price,
      isAvailable: house.isAvailable,
      buyerId: userId
    }

    await checkoutOrder(order);
  }

  return (
    <form action={onCheckout} method="post">
        {house.isAvailable ?
        <Button type="submit" role="link" size="lg" className="button sm:w-fit"> Buy House</Button> 
        : <p>Not Available</p>}
      
    </form>
  )
}

export default Checkout