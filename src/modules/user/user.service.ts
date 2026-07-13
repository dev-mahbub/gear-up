import config from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";
import {
  IUpdateProfilePayload,
  IUserRegisterPayload,
} from "./user.interface.js";
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

const getMyProfileFromDB = async (userId: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      active_status: true,
      created_at: true,
    },
  });

  return result;
};

const updateMyProfileToDB = async (
  userId: string,
  payload: IUpdateProfilePayload,
) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
    },
  });

  return result;
};

export const userService = {
  registerUserToDB,
  getMyProfileFromDB,
  updateMyProfileToDB,
};
