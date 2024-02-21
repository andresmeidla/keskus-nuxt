import bcrypt from 'bcryptjs';
import { zh } from 'h3-zod';
import { H3Event } from 'h3';
import jwt from 'jsonwebtoken';
import * as z from 'zod';

export default defineEventHandler(async (event: H3Event) => {
  const body = await zh.useValidatedBody(
    event,
    z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }),
  );
  // find user
  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });
  // eslint-disable-next-line import/no-named-as-default-member
  if (!user || !(await bcrypt.compare(body.password, user.password))) {
    throw createError({ statusCode: 401, message: 'You shall not pass!' });
  }
  // valid user
  return {
    token: jwt.sign({ id: user.id }, useRuntimeConfig().jwtSecret, { expiresIn: '12w' }),
  } as { token: string };
});
