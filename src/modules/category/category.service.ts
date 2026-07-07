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

export const categoryService = {
  categoryCreateToDB,
};
