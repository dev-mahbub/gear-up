import { prisma } from "../../lib/prisma.js";
import { IReviewPayload } from "./review.interface.js";

const createReviewToDB = async (
  customerId: string,
  payload: IReviewPayload,
) => {
  const { gear_item_id, rental_order_id, rating, comment } = payload;

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const order = await prisma.rentalOrder.findUnique({
    where: { id: rental_order_id },
    include: {
      rental_order_item: true,
    },
  });

  if (!order) {
    throw new Error("Rental order not found");
  }

  if (order.customer_id !== customerId) {
    throw new Error("You are not authorized to review this order");
  }

  if (order.status !== "RETURNED") {
    throw new Error(
      `Cannot review an order with status ${order.status}. Order must be RETURNED first.`,
    );
  }

  const gearInOrder = order.rental_order_item.some(
    (item) => item.gear_item_id === gear_item_id,
  );

  if (!gearInOrder) {
    throw new Error("This gear item was not part of the given rental order");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      customer_id_gear_item_id_rental_order_id: {
        customer_id: customerId,
        gear_item_id,
        rental_order_id,
      },
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this gear for this order");
  }

  const result = await prisma.review.create({
    data: {
      customer_id: customerId,
      gear_item_id,
      rental_order_id,
      rating,
      comment,
    },
  });

  return result;
};

const getReviewsByGearFromDB = async (gearItemId: string) => {
  const result = await prisma.review.findMany({
    where: { gear_item_id: gearItemId },
    include: {
      customer: {
        select: { id: true, name: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return result;
};

export const reviewService = {
  createReviewToDB,
  getReviewsByGearFromDB,
};
