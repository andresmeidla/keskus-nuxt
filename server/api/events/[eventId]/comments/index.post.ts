import { zh } from 'h3-zod';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const params = await zh.useValidatedParams(
    event,
    z.object({
      eventId: z.coerce.number(),
    })
  );
  const body = await zh.useValidatedBody(
    event,
    z.object({
      text: z.string().min(1),
    })
  );
  const userId = event.context.auth.id as number;
  return await prisma.comment.create({
    data: {
      body: body.text,
      eventId: params.eventId,
      userId,
    },
  });
});
