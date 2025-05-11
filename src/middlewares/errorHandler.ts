import { Request, Response, NextFunction } from "express";
import { RequestFieldSource } from "../../types.js";

export function validateFields(
  source: RequestFieldSource,
  requiredFields: string[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (source && requiredFields.length > 0) {
      if (req[source] || req[source].data) {
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
      } else {
        // req.body || req.params || req.query was not found!
        console.error(
          `Error Handler 'validateFields': the '${source}' in request was not found`
        );
        res.status(500).json({ message: "Internal server error" });
      }
    } else {
      // params to this function are missing
      throw new Error(
        "Error Handler 'validateFields': params are missing ('source: string' || 'requiredFields: string[]'"
      );
    }

    next();
  };
}
