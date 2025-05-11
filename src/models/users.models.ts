// TODO: auth - create new user
// TODO: auth - signin user
// TODO: auth - signout user
import { PrismaClient } from "@prisma/client";
import { User } from "../../types.js";

const prisma = new PrismaClient();

export async function createUser(data: User) {
  const { email, password, name } = data;

  const user = await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
}
