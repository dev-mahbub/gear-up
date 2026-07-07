import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IUserRegisterPayload } from "./user.interface";
import bcrypt from "bcryptjs";

const registerUserToDB = async (payload: IUserRegisterPayload) => {
  const { name, email, password, phone, address, role, status } = payload;

  const isUserExits = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExits) {
    throw new Error("User with this email already exists!");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const result = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role,
      status,
    },
    omit: {
      password: true,
    },
  });

  return result;
};

export const userService = {
  registerUserToDB,
};
