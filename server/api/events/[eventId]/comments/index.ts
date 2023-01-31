import { z, zh } from 'h3-zod';

import { DefaultUserAttributes } from '~~/server/lib/entity-types';

export type Pagination = {
  page: number;
  perPage: number;
};

export default defineEventHandler(async (event) => {
  const params = await zh.useValidatedParams(
    event,
    z.object({
      eventId: z.coerce.number(),
    })
  );
  const comments = await prisma.comment.findMany({
    where: {
      eventId: params.eventId,
    },
    include: {
      user: {
        select: DefaultUserAttributes,
      },
      commentLikes: {
        include: {
          user: {
            select: DefaultUserAttributes,
          },
        },
      },
      eventInteractions: {
        include: {
          user: {
            select: DefaultUserAttributes,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return comments;
});
