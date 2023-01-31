import { zh } from 'h3-zod';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const params = await zh.useValidatedParams(
    event,
    z.object({
      eventId: z.coerce.number(),
      commentId: z.coerce.number(),
    })
  );
  const body = await zh.useValidatedBody(
    event,
    z.object({
      body: z.string().min(1),
    })
  );
  const userId = event.context.auth.id as number;
  const exists = await prisma.comment.findFirst({
    where: {
      id: params.commentId,
      eventId: params.eventId,
      userId,
    },
  });
  if (!exists) {
    throw createError({ statusCode: 403, message: 'You are not allowed to edit this comment' });
  }

  const keskusComment = await prisma.comment.update({
    where: {
      id: params.commentId,
    },
    data: {
      body: body.body,
    },
  });

  return keskusComment;
});
