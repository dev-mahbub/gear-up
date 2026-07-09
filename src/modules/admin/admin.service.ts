import { prisma } from "../../lib/prisma";
import { IUpdateUserStatusPayload } from "./admin.interface";

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      active_status: true,
      created_at: true,
    },
    orderBy: { created_at: "desc" },
  });

  return result;
};

const updateUserStatusToDB = async (
  userId: string,
  payload: IUpdateUserStatusPayload,
) => {
  const { active_status } = payload;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "ADMIN") {
    throw new Error("Cannot change status of an admin user");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { active_status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active_status: true,
    },
  });

  return result;
};

const getAllRentalOrdersFromDB = async () => {
  const result = await prisma.rentalOrder.findMany({
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
      rental_order_items: {
        include: { gear_item: true },
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusToDB,
  getAllRentalOrdersFromDB,
};
