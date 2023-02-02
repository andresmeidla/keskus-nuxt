import { zh } from 'h3-zod';
import { z } from 'zod';

import { DefaultUserAttributes } from '~~/server/lib/entity-types';

export default defineEventHandler(async (event) => {
  const params = await zh.useValidatedParams(
    event,
    z.object({
      eventId: z.coerce.number(),
    })
  );
  return prisma.eventLike.findFirst({
    where: {
      eventId: params.eventId,
      userId: event.context.auth.id as number,
    },
    include: {
      user: {
        select: DefaultUserAttributes,
      },
    },
  });
});
