import { zh } from 'h3-zod';
import { z } from 'zod';

import { AttendanceState } from '~~/server/lib/entity-types';

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
      state: z.nativeEnum(AttendanceState),
    })
  );
  const userId = event.context.auth.id as number;
  const attendance = await prisma.eventAttendance.findFirst({
    where: {
      userId,
      eventId: params.eventId,
    },
  });
  if (attendance) {
    if (attendance.state === body.state) {
      await prisma.eventAttendance.delete({
        where: {
          userId_eventId: {
            eventId: params.eventId,
            userId,
          },
        },
      });
    } else {
      await prisma.eventAttendance.update({
        where: {
          userId_eventId: {
            eventId: params.eventId,
            userId,
          },
        },
        data: {
          state: body.state,
        },
      });
    }
  } else {
    await prisma.eventAttendance.create({
      data: {
        eventId: params.eventId,
        userId,
        state: body.state,
      },
    });
  }
  return { success: true };
});
