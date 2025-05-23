import { Request, Response, NextFunction } from "express";
import { RequestFieldSource, Result } from "../types.js";
import { catchPrismaErrors } from "../utils/errors.utils.js";
import { AppError, Codes } from "../utils/errors.utils.js";

export function validateFields(
  source: RequestFieldSource,
  requiredFields: string[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    let message: AppError["message"] = "";
    let statusCode: AppError["statusCode"] = 500;
    let missingFields: string[] = [];

    if (!source || requiredFields.length <= 0) {
      // params to this function are missing
      console.error(
        "Error Handler 'validateFields': params are missing ('source: string' || 'requiredFields: string[]')"
      );
      message = "Internal server error";
      statusCode = Codes.Server.General;
    } else {
      if (!req[source]) {
        // req.body || req.params || req.query was not found!
        console.error(
          `Error Handler 'validateFields': the '${source}' in request was not found`
        );
        message = `'${source}' in request was not found`;
        statusCode = Codes.Client.Bad_Request;
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
      }
    }

    next(new AppError(message, statusCode, "system"));
  };
}

export function appErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error caught by middleware: ---------------", error);
  // default result
  let status: number = Codes.Server.General;
  let errorObjSource: any = new AppError(
    "Internal server error",
    status,
    "system"
  );

  const prismaError = catchPrismaErrors(error);
  if (prismaError) {
    // prisma errors
    errorObjSource = prismaError;
  } else if (error instanceof AppError) {
    // custom errors
    errorObjSource = error;
  }

  const { message, statusCode, source } = errorObjSource;
  const result: Result<object> = {
    success: false,
    message,
    source,
  };
  status = statusCode;

  res.status(status).json(result);
}
