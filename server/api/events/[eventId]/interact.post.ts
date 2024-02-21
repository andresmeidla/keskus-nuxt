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
  const [keskusEvent, lastComment, interaction] = await prisma.$transaction([
    prisma.event.findUnique({
      where: {
        id: params.eventId,
      },
      select: {
        id: true,
      },
    }),
    prisma.comment.findFirst({
      where: {
        eventId: params.eventId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
      select: {
        id: true,
      },
    }),
    prisma.eventInteraction.findFirst({
      where: {
        userId,
        eventId: params.eventId,
      },
    }),
  ]);
  if (!keskusEvent) {
    throw createError({ statusCode: 404, message: 'Event not found' });
  }
  if (interaction) {
    await prisma.eventInteraction.update({
      where: {
        userId_eventId: {
          userId,
          eventId: params.eventId,
        },
      },
      data: {
        eventId: params.eventId,
        userId,
        lastCommentId: lastComment?.id,
      },
    });
  } else {
    await prisma.eventInteraction.create({
      data: {
        eventId: params.eventId,
        userId,
        lastCommentId: lastComment?.id,
      },
    });
  }
  return { success: true };
});
