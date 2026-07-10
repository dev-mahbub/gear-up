import { Prisma } from "../../../prisma/generated/prisma/client";
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

const getAllGearToDB = async (query: Record<string, any>) => {
  const { category_id, brand, minPrice, maxPrice, is_available, search } =
    query;

  console.log("brand", brand);

  const andConditions: Prisma.GearWhereInput[] = [];

  if (category_id) {
    andConditions.push({ category_id: category_id as string });
  }

  if (brand) {
    andConditions.push({
      brand: { contains: brand as string, mode: "insensitive" },
    });
  }

  if (is_available !== undefined) {
    andConditions.push({ is_available: is_available === "true" });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      rental_price_per_day: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    });
  }

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search as string, mode: "insensitive" } },
        { brand: { contains: search as string, mode: "insensitive" } },
      ],
    });
  }

  const whereCondition: Prisma.GearWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.gear.findMany({
    where: whereCondition,
    include: {
      category: true,
      provider: { select: { id: true, name: true } },
    },
    orderBy: { created_at: "desc" },
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

const updateGearToDB = async (
  provider_id: string,
  gearId: string,
  payload: IGearPayload,
  isProvider: boolean,
) => {
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

  const gear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!isProvider && gear?.provider_id === provider_id) {
    throw new Error("Your are not owner of this gear");
  }

  const result = await prisma.gear.update({
    where: {
      id: gearId,
    },
    data: {
      name,
      brand,
      description,
      rental_price_per_day,
      stock,
      is_available,
      image,
      category_id,
    },
  });

  return result;
};

const deleteGearToDB = async (
  gearId: string,
  provider_id: string,
  isProvider: boolean,
) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: { id: gearId },
  });

  if (!isProvider && gear.provider_id === provider_id) {
    throw new Error("Your are not owner of this gear");
  }

  await prisma.gear.delete({
    where: {
      id: gearId,
    },
  });
};

export const gearService = {
  createGearToDB,
  getAllGearToDB,
  getGearWithIdToDB,
  updateGearToDB,
  deleteGearToDB,
};
