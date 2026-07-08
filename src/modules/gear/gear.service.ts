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

const getAllGearToDB = async () => {};

const getGearWithIdToDB = async (gearId: string) => {};

const updateGearToDB = async (gearId: string, payload: IGearPayload) => {};

const deleteGearToDB = async (gearId: string) => {};

export const gearService = {
  createGearToDB,
  getAllGearToDB,
  getGearWithIdToDB,
  updateGearToDB,
  deleteGearToDB,
};
