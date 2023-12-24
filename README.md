# Yukio Estates Readme

Welcome to Yukio Estates, your go-to platform for all your real estate needs! This repository contains the source code for our web application, built with Next.js, Shadcn, UploadThing, Clerk, MongoDB, and Stripe. Whether you're looking to buy or sell a property, our platform has you covered.

## Tech Stack

- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **Shadcn**: A powerful styling library for creating beautiful and responsive user interfaces.
- **UploadThing**: Simplifying file uploads in your application.
- **Clerk**: Authentication made easy, providing secure and seamless user authentication.
- **MongoDB**: A NoSQL database for storing and retrieving data efficiently.
- **Stripe**: Payment processing to facilitate transactions securely.

## Contributors

We would like to express our gratitude to the following contributors who have played a significant role in the development of RealEstateHub:

- [Elsie Oduor](https://github.com/yukiodesigns)
- [Daniel Orwenjo](https://github.com/manlikeganga19)

Feel free to contribute to our project by forking the repository and submitting pull requests. We welcome bug reports, feature requests, and any improvements you'd like to suggest.

## Problem Statement

The real estate industry is often complicated and lacks a centralized platform where users can easily list, search, and transact properties. Existing solutions may be cumbersome or lack modern features that enhance user experience.

## Solution
Yukio Estates aims to provide a user-friendly platform that simplifies the process of buying and selling properties. By leveraging modern technologies, we offer a secure, efficient, and visually appealing experience for both buyers and sellers.

## How It Works

1. **Authentication**: Users can create accounts and log in securely using Clerk, ensuring a seamless and protected experience.

2. **Create Listing**: Sellers can easily create property listings, providing all the necessary details and uploading images using UploadThing.

3. **Delete and Update Listing**: Sellers have the flexibility to manage their listings by updating information or removing them when the property is no longer available.

4. **Buying a House**: Buyers can browse through the listings, view property details, and initiate the purchase process using Stripe for secure transactions.

5. **Search by Name or Category**: Users can search for properties based on specific criteria, making it easy to find the perfect home or investment opportunity.

## MVP (Minimum Viable Product)

Yukio Estates's MVP includes the following core features:

- User authentication with Clerk
- Ability to create, delete, and update property listings
- Secure transactions facilitated by Stripe
- Search functionality by name or category

We appreciate your interest in RealEstateHub and look forward to building a robust platform that revolutionizes the real estate experience. If you have any questions or suggestions, please feel free to reach out to us.

## To Run the project:
Follow the following steps to run this project locally:
1. Git clone the project 
2. Run `npm install`
3. Set up a `.env.local` file that has the following data:
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=

    NEXT_PUBLIC_CLERK_SIGN_IN_URL=
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

    MONGODB_URI=

    WEBHOOK_SECRET=

    UPLOADTHING_SECRET=
    UPLOADTHING_APP_ID=

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=
    NEXT_PUBLIC_SERVER_URL=
4. Run `npm run dev`

Happy house hunting! 🏡