'use server'

import Stripe from 'stripe';
import { CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types"
import { redirect } from 'next/navigation';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import Order from '../database/models/order.model';
import House from '../database/models/houses.model';
import { ObjectId } from 'mongodb';
import User from '../database/models/user.model';

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const price = order.isAvailable ? Number(order.price) * 100 : 0;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: order.houseTitle
            }
          },
          quantity: 1
        },
      ],
      metadata: {
        houseId: order.houseId,
        buyerId: order.buyerId,
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!)
  } catch (error) {
    throw error;
  }
}

export const createOrder = async (order: CreateOrderParams) => {
  try {

    await connectToDatabase();

    const newOrder = new Order({
      ...order,
      house: order.houseId,
      buyer: order.buyerId,
    });
    
    console.log('New Order:', newOrder);

    await newOrder.save();

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
}

// GET ORDERS BY EVENT
export async function getOrdersByListing({ searchString, houseId }: GetOrdersByEventParams) {
  try {
    await connectToDatabase()

    if (!houseId) throw new Error('House ID is required')
    const houseObjectId = new ObjectId(houseId)

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyer',
        },
      },
      {
        $unwind: '$buyer',
      },
      {
        $lookup: {
          from: 'houses',
          localField: 'house',
          foreignField: '_id',
          as: 'house',
        },
      },
      {
        $unwind: '$house',
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          houseTitle: '$house.title',
          houseId: '$house._id',
          buyer: {
            $concat: ['$buyer.firstName', ' ', '$buyer.lastName'],
          },
        },
      },
      {
        $match: {
          $and: [{ houseId: houseObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }],
        },
      },
    ])

    return JSON.parse(JSON.stringify(orders))
  } catch (error) {
    handleError(error)
  }
}

// GET ORDERS BY USER
export async function getOrdersByUser({ userId, limit = 3, page }: GetOrdersByUserParams) {
  try {
    console.log('Connecting to the database...');

    await connectToDatabase()
    console.log('Connected to the database!');

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { buyer: userId }

    console.log('Fetching orders from the database...');

    const orders = await Order.distinct('house._id')
      .find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: 'house',
        model: House,
        populate: {
          path: 'organiser',
          model: User,
          select: '_id firstName lastName',
        },
      })
    console.log('Fetching orders count...');

    const ordersCount = await Order.distinct('house._id').countDocuments(conditions)

    console.log('Orders fetched successfully:', orders);

    return { data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) }
  } catch (error) {
    console.error('Error in getOrdersByUser:', error);
    handleError(error);
  }
}
