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
      headline: z.string().min(3),
      body: z.string().min(1),
      location: z.string().min(1).optional().nullable(),
    }),
  );
  const userId = event.context.auth.id as number;
  const exists = await prisma.event.findFirst({
    where: {
      id: params.eventId,
      userId,
    },
  });
  if (!exists) {
    throw createError({ statusCode: 403, message: 'You are not allowed to edit this event' });
  }

  const keskusEvent = await prisma.event.update({
    where: {
      id: params.eventId,
    },
    data: {
      headline: body.headline,
      body: body.body,
      location: body.location,
    },
  });

  return keskusEvent;
});
