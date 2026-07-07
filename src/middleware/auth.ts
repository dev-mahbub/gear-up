// import { NextFunction, Request, Response } from "express";
// import { Role } from "../../generated/prisma/enums";
// import config from "../config";
// import { JwtPayload } from "jsonwebtoken";
// import httpStatus from "http-status";
// import { prisma } from "../lib/prisma";
// import { catchAsync } from "../utils/catchAsync";
// import { jwtUtils } from "../utils/jwt";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         name: string;
//         email: string;
//         role: Role;
//       };
//     }
//   }
// }

// export const auth = (...requiredRoles: Role[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.cookies.accessToken
//       ? req.cookies.accessToken
//       : req.headers.authorization?.startsWith("Bearer")
//         ? req.headers.authorization?.split(" ")[1]
//         : req.headers.authorization;

//     if (!token) {
//       throw new Error(
//         "Your are not logged in. Please log in to access this resource",
//       );
//     }

//     const verifiedToken = jwtUtils.verifyToken(
//       token,
//       config.jwt_access_secret,
//     ) as JwtPayload;

//     if (!verifiedToken.success) {
//       throw new Error(verifiedToken.error);
//     }

//     const { id, name, email, role } = verifiedToken.data;

//     if (requiredRoles.length && !requiredRoles.includes(role)) {
//       return res.status(httpStatus.BAD_REQUEST).json({
//         success: false,
//         statusCode: httpStatus.BAD_REQUEST,
//         message: "You don't have permission to access this resources",
//       });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id },
//     });

//     if (!user) {
//       throw new Error("User not found. Please log in agiain.");
//     }

//     if (user.active_status === "BLOCKED") {
//       throw new Error(" Your account has been blocked. Please contact support");
//     }

//     req.user = {
//       id,
//       name,
//       email,
//       role,
//     };
//     next();
//   });
// };
