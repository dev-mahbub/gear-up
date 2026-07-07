import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IUserLoginPayload } from "./login.interface";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";

const loginUserService = async (payload: IUserLoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("You are not logged in. Please register!");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshTokenService = async (refreshToken: string) => {
  const verifiedToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  if (!verifiedToken.success) {
    throw new Error(verifiedToken.error);
  }

  const { id } = verifiedToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  return { accessToken };
};

export const authService = {
  loginUserService,
  refreshTokenService,
};
