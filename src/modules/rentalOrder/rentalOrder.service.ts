import { prisma } from "../../lib/prisma";
import { IRentalOrderPayload } from "./rentalOrder.interface";

const createRentalOrderToDB = async (
  customerId: string,
  payload: IRentalOrderPayload,
) => {
  const { startDate, endDate, items } = payload;

  if (!items || items.length === 0) {
    throw new Error("At least one gear item is required");
  }

  const gearIds = items.map((item) => item.gear_item_id);

  const gears = await prisma.gear.findMany({
    where: { id: { in: gearIds } },
  });

  if (gears.length !== gearIds.length) {
    throw new Error("One or more gear items not found");
  }

  const unavailableGear = gears.find((gear) => !gear.is_available);
  if (unavailableGear) {
    throw new Error(`Gear "${unavailableGear.name}" is not available`);
  }

  const rentalDays = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (rentalDays <= 0) {
    throw new Error("End date must be after start date");
  }

  let totalAmount = 0;

  const rentalOrderItemsData = items.map((item) => {
    const gear = gears.find((g) => g.id === item.gear_item_id)!;

    if (item.quantity > gear.stock) {
      throw new Error(`Not enough stock for "${gear.name}"`);
    }

    const pricePerDay = Number(gear.rental_price_per_day);
    const subTotal = pricePerDay * item.quantity * rentalDays;
    totalAmount += subTotal;

    return {
      gear_item_id: item.gear_item_id,
      quantity: item.quantity,
      price_per_day: pricePerDay,
      rental_days: rentalDays,
      sub_total: subTotal,
    };
  });

  const result = await prisma.rentalOrder.create({
    data: {
      customer_id: customerId,
      startDate,
      endDate,
      total_amount: totalAmount,
      rental_order_item: {
        create: rentalOrderItemsData,
      },
    },
    include: {
      rental_order_item: {
        include: { gear_item: true },
      },
    },
  });

  return result;
};

const getMyRentalOrdersFromDB = async (customerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: { customer_id: customerId },
    include: {
      rental_order_item: {
        include: { gear_item: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getRentalOrderWithIdFromDB = async (
  rentalOrderId: string,
  customerId: string,
) => {
  const result = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
    include: {
      rental_order_item: {
        include: { gear_item: true },
      },
    },
  });

  if (!result) {
    throw new Error("Rental order not found");
  }

  if (result.customer_id !== customerId) {
    throw new Error("You are not authorized to view this order");
  }

  return result;
};

export const rentalOrderService = {
  createRentalOrderToDB,
  getMyRentalOrdersFromDB,
  getRentalOrderWithIdFromDB,
};
