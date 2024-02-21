import { zh } from 'h3-zod';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const params = await zh.useValidatedParams(
    event,
    z.object({
      eventId: z.coerce.number(),
    }),
  );
  const body = await zh.useValidatedBody(
    event,
    z.object({
      body: z.string().min(1).max(10000),
    }),
  );
  const userId = event.context.auth.id as number;
  return await prisma.comment.create({
    data: {
      body: body.body,
      eventId: params.eventId,
      userId,
    },
  });
});
