import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* _AUTHORIZATION_ */
/* JWT - token */
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// Generate access token
export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Generate refresh token
export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

// Verify access token
export function verifyAccessToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

// Verify refresh token
export function verifyRefreshToken(token: string): any {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

/* _AUTHENTICATION_ */
/* Bcrypt - hash password */
export async function hashPassword(plainPassword: string) {
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

  return hashedPassword;
}

export async function isPasswordCorrect(
  inputPassword: string,
  savedUserPassword: string | null
) {
  if (!savedUserPassword) {
    throw new Error("Password is not exist!");
  }

  const isPassCorrect = await bcrypt.compare(inputPassword, savedUserPassword);
  return isPassCorrect;
}

// async function exacuteTest() {
//   const hashed = await hashPassword("password");
//   isPasswordCorrect("password", hashed);
// }

// exacuteTest();
