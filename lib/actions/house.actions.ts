'use server'
import { CreateHouseParams, GetAllHousesParams, UpdateHouseParams, DeleteHouseParams, GetHousesByUserParams, GetRelatedHousesByCategoryParams } from "@/types"
import { connectToDatabase } from "../database"
import { handleError } from "../utils";
import User from "../database/models/user.model";
import House from "../database/models/houses.model";
import Category from "../database/models/category.model";
import { revalidatePath } from "next/cache";

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateListing = async (query: any) => {
  const populationFields = ['category', 'organizer'];

  const populatedQuery = populationFields.reduce((query, field) => {
    if (House.schema.paths[field]) {
      query = query.populate({
        path: field,
        model: field === 'organizer' ? User : Category,
        select: '_id firstName lastName',
      });
    }
    return query;
  }, query);

  return populatedQuery;
};



export const createListing = async ({ house, userId, path }: CreateHouseParams) => {
  try {
    await connectToDatabase();

    const organaiser = await User.findById(userId)
    if (!organaiser) throw new Error('Organiser not found')
    const newListing = await House.create({ ...house, type: 'String', category: house.categoryId, organiser: userId })
    revalidatePath(path)
    return JSON.parse(JSON.stringify(newListing))
  } catch (error) {

    handleError(error)
  }
}

export const getListingById = async (houseId: string) => {
  try {
    await connectToDatabase();
    const listing = await populateListing(House.findById(houseId));

    if (!listing) {
      throw new Error('Listing not found');
    }

    return JSON.parse(JSON.stringify(listing));
  } catch (error) {
    console.error('Error in getListingById:', error);
    handleError({ path: 'organizer', error });
  }
};


export const getAllListings = async ({ query, limit = 6, page, category }: GetAllHousesParams) => {
  try {
    await connectToDatabase()

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
    const conditions = { $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}], }

    const skipAmount = (Number(page) - 1) * limit
    const listingsQuery = House.find(conditions).sort({ createdAt: 'desc' }).skip(skipAmount).limit(limit)

    const listings = await populateListing(listingsQuery)
    const listingsCount = await House.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(listings)),
      totalPages: Math.ceil(listingsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateListing({ userId, house, path }: UpdateHouseParams) {
  try {
    await connectToDatabase()

    const listingToUpdate = await House.findById(house._id)
    if (!listingToUpdate || listingToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedListing = await House.findByIdAndUpdate(house._id, { ...house, category: house.categoryId }, { new: true })
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedListing))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteListing({ houseId, path }: DeleteHouseParams) {
  try {
    await connectToDatabase()

    const deletedListing = await House.findByIdAndDelete(houseId)
    if (deletedListing) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

// GET EVENTS BY ORGANIZER
export async function getListingsByUser({ userId, limit = 6, page }: GetHousesByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (page - 1) * limit
    const listingsQuery = House.find(conditions).sort({ createdAt: 'desc' }).skip(skipAmount).limit(limit)
    const listings = await populateListing(listingsQuery)
    const listingsCount = await House.countDocuments(conditions)
    return { data: JSON.parse(JSON.stringify(listings)), totalPages: Math.ceil(listingsCount / limit) }

  } catch (error) {
    handleError(error)
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedListingsByCategory({ categoryId, houseId, limit = 3, page = 1, }: GetRelatedHousesByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: houseId } }] }
    const listingsQuery = House.find(conditions).sort({ createdAt: 'desc' }).skip(skipAmount).limit(limit)
    const listings = await populateListing(listingsQuery)
    const listingsCount = await House.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(listings)), totalPages: Math.ceil(listingsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}