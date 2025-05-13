import { Prisma } from "@prisma/client";
import { GENERAL_ERROR } from "./errorMessages.js";
import { bookCategories } from "./consts.js";

export function isCategorieExist(categorie: string | undefined) {
  const asArrOfStrings = bookCategories as readonly string[];
  return typeof categorie === "string" && asArrOfStrings.includes(categorie);
}

export function prismaErrorHandler(error: object | unknown) {
  let customErrorMessage: string = GENERAL_ERROR;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // https://www.prisma.io/docs/orm/reference/error-reference#prismaclientknownrequesterror
    if (error.code === "P2002") {
      console.log(
        "There is a unique constraint violation, a new user cannot be created with this email"
      );
      customErrorMessage =
        "There is a unique constraint violation, a new user cannot be created with this email";
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    const prismaErrMsg: string = error.message;
    const startIndex = prismaErrMsg.indexOf("Argument");
    const slicedString = prismaErrMsg.slice(startIndex, prismaErrMsg.length);

    customErrorMessage = slicedString;
  }

  return new Error(customErrorMessage, { cause: "prisma" });
}
