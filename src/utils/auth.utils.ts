import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* JWT - token */
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

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
