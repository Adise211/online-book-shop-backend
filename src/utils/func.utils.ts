import { Prisma } from "@prisma/client";
import { GENERAL_ERROR } from "./errorMsgs.utils.js";
import { bookCategories } from "./consts.utils.js";

export function isCategorieExist(categorie: string | undefined) {
  const asArrOfStrings = bookCategories as readonly string[];
  return typeof categorie === "string" && asArrOfStrings.includes(categorie);
}

export function prismaErrorHandler(error: object | unknown) {
  let customErrorMessage: string = GENERAL_ERROR;
  let errorCode: number = 500;
  let isPrismaError: boolean = true;

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

  return {
    code: errorCode,
    message: customErrorMessage,
    isPrismaError,
  };
}
