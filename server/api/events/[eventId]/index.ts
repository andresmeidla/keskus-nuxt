import { z, zh } from 'h3-zod';

import { DefaultUserAttributes } from '~~/server/lib/entity-types';

export type Pagination = {
  page: number;
  perPage: number;
};

export default defineEventHandler(async (event) => {
  const query = zh.useValidatedQuery(
    event,
    z.object({
      lastCommentUsers: z.coerce.boolean().optional(),
    })
  );
  const params = await zh.useValidatedParams(
    event,
    z.object({
      eventId: z.coerce.number(),
    })
  );
  const userId = event.context.auth.id as number;
  const [keskusEvent, userInteraction, newCommentCountResult, lastCommentUsers] = await prisma.$transaction([
    prisma.event.findUnique({
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
    }),
    prisma.eventInteraction.findUnique({
      where: {
        userId_eventId: {
          eventId: params.eventId,
          userId,
        },
      },
    }),
    findNewCommentCount(params.eventId, userId),
    ...(query.lastCommentUsers ? [findLastCommentUsers(params.eventId)] : []),
  ]);
  if (!keskusEvent) {
    return createError({ statusCode: 404, message: 'Event not found' });
  }
  return {
    event: keskusEvent,
    userInteraction,
    lastCommentUsers: query.lastCommentUsers ? lastCommentUsers : undefined,
    newCommentCount: newCommentCountResult.length > 0 ? newCommentCountResult[0].count : null,
  };
});

function findNewCommentCount(eventId: number, userId: number) {
  return prisma.$queryRaw<{ count: number; lastCommentId: number }[]>`
  with init as (
    select
      "lastCommentId",
      c."createdAt" as "lastCommentDate"
    from
      "EventInteractions" ei
    left join "Comments" c on
      (c.id = ei."lastCommentId")
    where
      ei."eventId" = ${eventId}
      and ei."userId" = ${userId}
  )

  select
    count(c.id)::integer as count,
    init."lastCommentId"
  from
    "Comments" c
  cross join init
  where
    c."eventId" = ${eventId}
    and c."createdAt" > init."lastCommentDate"
  group by
    "init"."lastCommentId";
  `;
}

function findLastCommentUsers(eventId: number) {
  return prisma.$queryRaw<{ id: number; firstname: string; lastname: string; nickname: string; email: string }[]>`
    select
      *
    from
      (
      select
        distinct on
        ("Comments"."userId")
        "Comments"."userId",
        "Users".id as "id",
        "Users".firstname,
        "Users".lastname,
        "Users".nickname,
        "Users".email,
        "Comments"."createdAt"
      from
        "Comments"
      left join "Users" on
        "Users".id = "Comments"."userId"
      where
        "Comments"."eventId" = ${eventId}
      order by 
        "Comments"."userId",
        "Comments"."createdAt" desc
      ) as c
    order by
      c."createdAt" desc`;
}
