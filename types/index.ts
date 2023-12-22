// ====== USER PARAMS
export type CreateUserParams = {
    clerkId: string
    firstName: string
    lastName: string
    username: string
    email: string
    photo: string
  }
  
  export type UpdateUserParams = {
    firstName: string
    lastName: string
    username: string
    photo: string
  }
  
  // ====== HOUSE PARAMS
  export type CreateHouseParams = {
    userId: string
    house: {
      title: string
      description: string
      location: string
      imageUrl: string
      categoryId: string
      price: string
      isAvailable: boolean
    
    }
    path: string
  }
  
  export type UpdateHouseParams = {
    userId: string
    house: {
      _id: string
      title: string
      imageUrl: string
      description: string
      location: string
      categoryId: string
      price: string
      isAvailable: boolean

    }
    path: string
  }
  
  export type DeleteHouseParams = {
    houseId: string
    path: string
  }
  
  export type GetAllHousesParams = {
    query: string
    category: string
    limit: number
    page: number
  }
  
  export type GetHousesByUserParams = {
    userId: string
    limit?: number
    page: number
  }
  
  export type GetRelatedHousesByCategoryParams = {
    categoryId: string
    houseId: string
    limit?: number
    page: number | string
  }
  
  export type Houses = {
    _id: string
    title: string
    description: string
    price: string
    isAvailable: boolean
    imageUrl: string
    location: string
    organizer: {
      _id: string
      firstName: string
      lastName: string
    }
    category: {
      _id: string
      name: string
    }
  }
  
  // ====== CATEGORY PARAMS
  export type CreateCategoryParams = {
    categoryName: string
  }
  
  // ====== ORDER PARAMS
  export type CheckoutOrderParams = {
    houseTitle: string
    houseId: string
    price: string 
    isAvailable: boolean
    buyerId: string
  }
  
  export type CreateOrderParams = {
    stripeId: string
    houseId: string
    buyerId: string
    totalAmount: string
    createdAt: Date
  }
  
  export type GetOrdersByEventParams = {
    houseId: string
    searchString: string
  }
  
  export type GetOrdersByUserParams = {
    userId: string | null
    limit?: number
    page: string | number | null
  }
  
  // ====== URL QUERY PARAMS
  export type UrlQueryParams = {
    params: string
    key: string
    value: string | null
  }
  
  export type RemoveUrlQueryParams = {
    params: string
    keysToRemove: string[]
  }
  
  export type SearchParamProps = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }