import { Request, Response, NextFunction } from "express";
import { RequestFieldSource, Result, ResultSource } from "../types.js";
import { catchPrismaErrors } from "../utils/errors.utils.js";
import { AppError, Codes } from "../utils/errors.utils.js";

export function validateFields(
  source: RequestFieldSource,
  requiredFields: string[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    let message: AppError["message"] = "";
    let statusCode: AppError["statusCode"] = 500;
    let resultSource: ResultSource = "system";
    let missingFields: string[] = [];

    if (!source || requiredFields.length <= 0) {
      // params to this function are missing
      console.error(
        "Error Handler 'validateFields': params are missing ('source: string' || 'requiredFields: string[]')"
      );
      throw new Error();
    } else {
      if (!req[source]) {
        // req.body || req.params || req.query was not found!
        console.error(
          `Error Handler 'validateFields': the '${source}' in request was not found`
        );
        message = `'${source}' in request was not found`;
        statusCode = Codes.Client.Bad_Request;
        next(new AppError(message, statusCode, resultSource));
      } else if (
        req[source] &&
        requiredFields.length > 2 &&
        !req[source].data
      ) {
        // more then 2 fields need to be wrapped with object named 'data'
        console.error(
          `Error Handler 'validateFields': fields are not wrapped with 'data' object`
        );
        message = `fields are not wrapped with 'data' object`;
        statusCode = Codes.Client.Bad_Request;
        next(new AppError(message, statusCode, resultSource));
      } else {
        // Check if required fields exist in the request.source (body, params or query)
        requiredFields.forEach((field) => {
          if (!req[source][field] && !req[source].data[field]) {
            missingFields.push(field);
          }
        });

        // If fields are missing - send error message
        if (missingFields.length > 0) {
          message = `Missing fields: (${missingFields.toString()})`;
          statusCode = Codes.Client.Bad_Request;
        }
        next();
      }
    }
  };
}

export function appErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error caught by middleware ====>", error);
  // default values
  let resultSource: ResultSource = "system";
  const DEFAULT_ERR_MESSAGE = "Internal server error";

  // default error
  let _errObj: any = new AppError(
    DEFAULT_ERR_MESSAGE,
    Codes.Server.General, // 500
    resultSource
  );

  const prismaError = catchPrismaErrors(error);
  if (prismaError) {
    // prisma errors
    _errObj = prismaError;
  } else if (error instanceof AppError) {
    // custom errors
    _errObj = error;
  }

  const { message, statusCode, source } = _errObj;
  const result: Result<object> = {
    success: false,
    message,
    source,
  };

  res.status(statusCode).json(result);
}
