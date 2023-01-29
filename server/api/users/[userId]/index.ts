import { z, zh } from 'h3-zod';

import { DefaultUserAttributes } from '~~/server/lib/entity-types';

export default defineEventHandler(async (event) => {
  const params = await zh.useValidatedParams(
    event,
    z.object({
      userId: z.coerce.number(),
    })
  );
  return prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    select: DefaultUserAttributes,
  });
});
