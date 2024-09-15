import { prisma } from "~/services/prisma.server";
import bcrypt from "bcryptjs";
import { User, UserRegistration } from "~/types/models";

export async function userExistsByEmail(email: string): Promise<boolean> {
  const userCount = await prisma.user.count({
    where: { email },
  });

  return userCount > 0;
}

async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, 10);
}

export async function createUser(userSignUp: UserRegistration): Promise<User> {
  const hashedPassword = await hashPassword(userSignUp.password);

  const user = {
    email: userSignUp.email,
    password: hashedPassword,
  };

  return (await prisma.user.create({ data: user })) as User;
}
