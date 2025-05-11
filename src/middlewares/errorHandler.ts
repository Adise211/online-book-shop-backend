import { Request, Response, NextFunction } from "express";
import { RequestFieldSource } from "../../types.js";

export function validateFields(
  source: RequestFieldSource,
  requiredFields: string[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!source && requiredFields.length <= 0) {
      // params to this function are missing
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
