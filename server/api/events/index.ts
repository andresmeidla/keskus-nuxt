import { z, zh } from 'h3-zod';

import { DefaultUserAttributes } from '../../lib/entity-types';

export type Pagination = {
  page: number;
  perPage: number;
};

export default defineEventHandler(async (event) => {
  const query = zh.useValidatedQuery(
    event,
    z.object({
      page: z.coerce.number().min(1).default(1),
      perPage: z.coerce.number().min(1).max(10).default(10),
    })
  );

  const [count, events] = await prisma.$transaction([
    prisma.event.count(),
    prisma.event.findMany({
      take: query.perPage,
      skip: (query.page - 1) * query.perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: DefaultUserAttributes,
        },
        _count: {
          select: { comments: true, eventAttendances: true, eventInteractions: true, eventLikes: true },
        },
      },
    }),
  ]);
  return {
    count,
    events,
  };
});
