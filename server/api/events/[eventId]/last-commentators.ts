import { zh } from 'h3-zod';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const params = await zh.useValidatedParams(
    event,
    z.object({
      eventId: z.coerce.number(),
    })
  );
  return prisma.$queryRaw<
    { id: number; userId: number; eventId: number; createdAt: string; firstname: string; lastname: string; nickname: string; email: string }[]
  >`
    select
      *
    from
      (
      select
        distinct on
        ("Comments"."userId")
        "Comments"."userId",
        "Comments"."userId" as "id",
        "Comments"."eventId",
        "Comments"."createdAt",
        "Users".firstname,
        "Users".lastname,
        "Users".nickname,
        "Users".email
      from
        "Comments"
      left join "Users" on
        "Users".id = "Comments"."userId"
      where
        "Comments"."eventId" = ${params.eventId}
      order by 
        "Comments"."userId",
        "Comments"."createdAt" desc
      ) as c
    order by
      c."createdAt" desc`;
});
