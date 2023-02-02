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
  const userId = event.context.auth.id as number;
  const keskusEvent = await prisma.event.findUnique({
    where: {
      id: params.eventId,
    },
    include: {
      user: {
        select: DefaultUserAttributes,
      },
      eventAttendances: {
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
        where: {
          userId,
        },
      },
      eventLikes: {
        include: {
          user: {
            select: DefaultUserAttributes,
          },
        },
      },
      _count: {
        select: {
          comments: true,
          eventLikes: true,
        },
      },
    },
  });
  if (!keskusEvent) {
    return createError({ statusCode: 404, message: 'Event not found' });
  }
  return keskusEvent;
});
