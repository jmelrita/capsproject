// pages/api/spa/[id].js
import prisma from "@/app/libs/prismadb";

export default async function handler(req, res) {
  const {
    query: { id, currentUser },
  } = req;

  try {
    if (!id) {
      throw new Error("ID parameter is missing");
    }

    const spa = await prisma.spa.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!spa) {
      throw new Error("Spa not found");
    }

    const reviews = await prisma.Feedback.findMany({
      where: {
        spaId: parseInt(id, 10),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mname: true,
            lname: true,
          },
        },
        spa: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Sort by 'createdAt' in descending order (latest to oldest)
      },
    });

    const ratingCounts = await prisma.rating.count({
      where: {
        spaId: parseInt(id, 10),
      },
    });

    const overallRatings = await prisma.rating.findMany({
      where: {
        spaId: parseInt(id, 10),
      },
    });

    // Calculate total expected amount
    const total = overallRatings.reduce((total, rating) => {
      return total + parseFloat(rating.ratings);
    }, 0);

    const totalRatings = ratingCounts ? total / ratingCounts : 0;

    let currentUserRating;

    if (currentUser) {
      currentUserRating = await prisma.rating.findFirst({
        where: {
          spaId: parseInt(id, 10),
          userId: parseInt(currentUser, 10),
        },
      });
    }

    const responseData = {
      spa,
      reviews,
      ratingCounts,
      totalRatings,
      currentUserRating,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching spa data:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
