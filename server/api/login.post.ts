import bcrypt from 'bcryptjs';
import { zh } from 'h3-zod';
import jwt from 'jsonwebtoken';
import z from 'zod';

export default defineEventHandler(async (event) => {
  const body = await zh.useValidatedBody(
    event,
    z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    })
  );
  // find user
  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });
  if (!user || !(await bcrypt.compare(body.password, user.password))) {
    throw createError({ statusCode: 401 });
  }
  // valid user
  return {
    token: jwt.sign({ id: user.id }, useRuntimeConfig().jwtSecret, { expiresIn: '4w' }),
  };
});
