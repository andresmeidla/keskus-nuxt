import { zh } from 'h3-zod';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const body = await zh.useValidatedBody(
    event,
    z.object({
      headline: z.string().min(3),
      body: z.string().min(1),
      location: z.string().min(1).optional(),
    })
  );
  const userId = event.context.auth.id as number;
  const keskusEvent = await prisma.event.create({
    data: {
      headline: body.headline,
      body: body.body,
      location: body.location,
      userId,
    },
  });

  //! TODO: Send email to all users who have subscribed to this event notifications

  return keskusEvent;
});
