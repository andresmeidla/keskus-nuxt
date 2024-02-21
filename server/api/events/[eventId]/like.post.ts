import { zh } from 'h3-zod';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const params = await zh.useValidatedParams(
    event,
    z.object({
      eventId: z.coerce.number(),
    }),
  );
  const userId = event.context.auth.id as number;
  const like = await prisma.eventLike.findFirst({
    where: {
      userId,
      eventId: params.eventId,
    },
  });
  if (like) {
    await prisma.eventLike.delete({
      where: {
        userId_eventId: {
          eventId: params.eventId,
          userId,
        },
      },
    });
  } else {
    await prisma.eventLike.create({
      data: {
        eventId: params.eventId,
        userId,
      },
    });
  }
  return { success: true };
});
