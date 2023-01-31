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
  const userId = event.context.auth.id as number;
  const like = await prisma.commentLike.findFirst({
    where: {
      userId,
      commentId: params.commentId,
    },
  });
  if (like) {
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          commentId: params.commentId,
          userId,
        },
      },
    });
  } else {
    await prisma.commentLike.create({
      data: {
        commentId: params.commentId,
        userId,
      },
    });
  }
  return { success: true };
});
