// TODO: auth - create new user
// TODO: auth - signin user
// TODO: auth - signout user
import { PrismaClient, Users } from "@prisma/client";
import { UserInitInfo } from "../types.js";

const prisma = new PrismaClient();

export async function createUser(data: UserInitInfo) {
  const { email, password, name } = data;

  const user = await prisma.users.create({
    data: {
      email,
      password,
      name,
    },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  return user;
}
