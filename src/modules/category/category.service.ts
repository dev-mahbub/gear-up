import { prisma } from "../../lib/prisma";
import { IGearUpCategoryPayload } from "./category.interface";

const categoryCreateToDB = async (payload: IGearUpCategoryPayload) => {
  const { name, description } = payload;

  const isCategoryExists = await prisma.category.findUnique({
    where: { name },
  });

  if (isCategoryExists) {
    throw new Error("This category already exists");
  }

  const result = await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return result;
};

const getAllCategoryToDB = async () => {
  const result = await prisma.category.findMany({});
  return result;
};

const updateCategoryToDB = async (
  categoryId: string,
  payload: IGearUpCategoryPayload,
) => {
  const { name, description } = payload;

  const isCategoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!isCategoryExists) {
    throw new Error("This category not exists!, create first");
  }

  const result = await prisma.category.update({
    where: { id: categoryId },
    data: {
      name,
      description,
    },
  });

  return result;
};

const deleteCategoryToDB = async (categoryId: string) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!isCategoryExists) {
    throw new Error("This category not exists!, create first");
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });
};

export const categoryService = {
  categoryCreateToDB,
  getAllCategoryToDB,
  updateCategoryToDB,
  deleteCategoryToDB,
};
