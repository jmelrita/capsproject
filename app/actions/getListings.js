import prisma from "@/app/libs/prismadb";

export default async function getListings() {
  try {
    const listings = await prisma.spa.findMany({
      where: {
        userType: null,
        status: 1,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Array to store the calculated average ratings and counts for each spa
    const averageRatings = [];

    for (const spa of listings) {
      const ratingCounts = await prisma.rating.count({
        where: {
          spaId: spa.id,
        },
      });

      const overallRatings = await prisma.rating.findMany({
        where: {
          spaId: spa.id,
        },
      });

      // Calculate total rating for the spa
      const total = overallRatings.reduce((total, rating) => {
        return total + parseFloat(rating.ratings);
      }, 0);

      // Calculate average rating for the spa
      const averageRating = ratingCounts ? total / ratingCounts : 0;

      // Push the average rating and rating counts to the array
      averageRatings.push({ spaId: spa.id, averageRating, ratingCounts });

      // Combine average rating with the spa object
      spa.averageRating = averageRating;
      spa.ratingCounts = ratingCounts;
    }
    
    //console.log(listings); // Now listings will contain averageRating property for each spa

    return listings;
  } catch (error) {
    throw new Error(error);
  }
}
