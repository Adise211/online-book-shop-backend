import { Prisma } from "@prisma/client";
import { GENERAL_ERROR } from "./errorMsgs.utils.js";

export const Codes = {
  // see more on HTTP status: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
  Success: {
    Ok: 200,
    Created: 201,
  },
  Server: {
    General: 500,
  },
  Client: {
    Bad_Request: 400,
    Unauthorized: 401,
    Forbidden: 403,
    Not_Found: 404,
  },
  // see more on Prisma error codes: https://www.prisma.io/docs/orm/reference/error-reference#error-codes
  Prisma: {},
};

export class AppError extends Error {
  /* 
    CUSTOM ERROR 
    -------------
    This class is an extension of the build-in JS Error class with additional 2 custom params
    (statusCode, source) to give more details about the error.
  
  */

  public statusCode: number;
  public source: string;

  // params
  constructor(message: string, statusCode = 500, source = "system") {
    // prop from the base
    super(message);
    // set the props values
    this.statusCode = statusCode;
    this.source = source;

    // Restore prototype chain for instanceof to work
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function catchPrismaErrors(error: object | unknown) {
  let isPrismaError: boolean = true;
  let customErrorMessage: string = GENERAL_ERROR;
  let errorCode: number = 500;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // https://www.prisma.io/docs/orm/reference/error-reference#prismaclientknownrequesterror
    if (error.code === "P2002") {
      customErrorMessage = "Unique constraint violation";
    }
    errorCode = 409;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    const prismaErrMsg: string = error.message;
    const startIndex = prismaErrMsg.indexOf("Argument");
    const slicedString = prismaErrMsg.slice(startIndex, prismaErrMsg.length);

    customErrorMessage = slicedString;
    errorCode = 400;
  } else {
    isPrismaError = false;
  }

  return isPrismaError
    ? new AppError(customErrorMessage, errorCode, "prisma")
    : null;
}
