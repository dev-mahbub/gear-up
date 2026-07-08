import { prisma } from "../../lib/prisma";
import { IGearPayload } from "./gear.interface";

const createGearToDB = async (provider_id: string, payload: IGearPayload) => {
  const {
    name,
    brand,
    description,
    rental_price_per_day,
    stock,
    is_available,
    image,
    category_id,
  } = payload;

  const result = await prisma.gear.create({
    data: {
      name,
      brand,
      description,
      rental_price_per_day,
      stock,
      is_available,
      image,
      category_id,
      provider_id,
    },
  });
  return result;
};

const getAllGearToDB = async () => {
  const result = await prisma.gear.findMany({
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};

const getGearWithIdToDB = async (gearId: string) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id: gearId,
    },
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });

  return gear;
};

const updateGearToDB = async (gearId: string, payload: IGearPayload) => {};

const deleteGearToDB = async (gearId: string) => {};

export const gearService = {
  createGearToDB,
  getAllGearToDB,
  getGearWithIdToDB,
  updateGearToDB,
  deleteGearToDB,
};
