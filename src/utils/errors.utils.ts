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
  // custom props - set their types
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
