import { Request, Response, NextFunction } from "express";
import { RequestFieldSource, Result } from "../types.js";
import { catchPrismaErrors } from "../utils/errors.utils.js";
import { AppError, Codes } from "../utils/errors.utils.js";

export function validateFields(
  source: RequestFieldSource,
  requiredFields: string[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!source || requiredFields.length <= 0) {
      // params to this function are missing
      res.status(500).json({ message: "Internal server error" });
      throw new Error(
        "Error Handler 'validateFields': params are missing ('source: string' || 'requiredFields: string[]'"
      );
    } else {
      if (!req[source]) {
        // req.body || req.params || req.query was not found!
        console.error(
          `Error Handler 'validateFields': the '${source}' in request was not found`
        );
        res
          .status(400)
          .json({ message: `'${source}' in request was not found` });
      } else if (
        req[source] &&
        requiredFields.length > 2 &&
        !req[source].data
      ) {
        // more then 2 fields need to be wrapped with object named 'data'
        console.error(
          `Error Handler 'validateFields': fields are not wrapped with 'data' object`
        );
        res
          .status(400)
          .json({ message: `fields are not wrapped with 'data' object` });
      } else {
        let missingFields: string[] = [];

        // Check if required fields exist in the request.source (body, params or query)
        requiredFields.forEach((field) => {
          if (!req[source][field] && !req[source].data[field]) {
            missingFields.push(field);
          }
        });

        // If fields are missing - send error message
        if (missingFields.length > 0) {
          res
            .status(400)
            .json({ message: `Missing fields: (${missingFields.toString()})` });
        }
      }
    }

    next();
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
