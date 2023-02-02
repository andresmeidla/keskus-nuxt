import { zh } from 'h3-zod';
import { z } from 'zod';

import { DefaultUserAttributes } from '~~/server/lib/entity-types';

export default defineEventHandler(async (event) => {
  const params = await zh.useValidatedParams(
    event,
    z.object({
      eventId: z.coerce.number(),
      commentId: z.coerce.number(),
    })
  );
  return prisma.commentLike.findMany({
    where: {
      commentId: params.commentId,
    },
    include: {
      user: {
        select: DefaultUserAttributes,
      },
    },
  });
});
