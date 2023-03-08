import { Event, User } from '@prisma/client';
import gravatarUrl from 'gravatar-url';
import { zh } from 'h3-zod';
import { createTransport, SendMailOptions } from 'nodemailer';
import { z } from 'zod';

import { purgeHtml, purifyHtml } from '~~/lib/utils';

type AvatarUser = Pick<User, 'firstname' | 'lastname' | 'email' | 'nickname'>;
function uiAvatarUrl(user: AvatarUser, size = 64) {
  return `https://ui-avatars.com/api/${user.firstname.length > 0 ? user.firstname[0] : 'X'}+${
    user.lastname.length ? user.lastname[0] : 'X'
  }/${size}/0E7490/fff`;
}

function generateName(user: AvatarUser) {
  return purgeHtml(user.nickname || user.firstname || user.lastname);
}

function generateGravatarUrl(user: AvatarUser, size = 64) {
  return gravatarUrl(user.email || '', { size, default: uiAvatarUrl(user, size) });
}

function generateAvatar(user: AvatarUser, size = 64) {
  try {
    const img = `<img alt="pilt" src="${generateGravatarUrl(user, size)}" style="margin:0; padding:0; border:none; display:block;" border="0" />`;
    return img;
  } catch (err: any) {
    console.error(`Failed to generate avatar for ${JSON.stringify(user)}:`, err);
  }
  return '';
}

function generateAvatarAndName(user: AvatarUser) {
  try {
    const avatarAndName = `<table style="text-align:center"><tr><td>${generateAvatar(user)}</td></tr><tr><td><span style="font-weight:bolder">${generateName(
      user
    )}</td></tr></table>`;
    return avatarAndName;
  } catch (err: any) {
    console.error(`Failed to generate avatar and name for ${JSON.stringify(user)}:`, err);
  }
  return '';
}

function gMapsLink(location: string) {
  return `<span>@ <a href="https://maps.google.com/?q=${new URLSearchParams(location).toString()}">${location}</a></span>`;
}

function generateLocation(location: string | null) {
  const purgedLocation = purgeHtml(location || '');
  if (!purgedLocation) return '';
  return gMapsLink(purgedLocation);
}

function generateMailHtml(me: AvatarUser, keskusEvent: Event, cfg: ReturnType<typeof useRuntimeConfig>) {
  try {
    const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  </head>
  <body style="font-size:0.9rem">
    <h3>
      <a href="${cfg.webAddress}/events/${keskusEvent.id}">Keskusesse</a>
    </h3>
    <br>
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:10px">
          ${generateAvatarAndName(me)}
        </td>
        <td style="padding:10px">
          <span style="font-weight:bolder;font-size:1.125rem">
            ${purgeHtml(keskusEvent.headline)}
          </span>
          <br>
          ${generateLocation(keskusEvent.location)}
        </td>
      </tr>
    </table>
    <br>
  ${purifyHtml(keskusEvent.body || '')}
  </body>
</html>  
  `;
    return html;
  } catch (err) {
    console.error('Failed to generate mail html', err);
  }
  return `<h3><a href="${cfg?.webAddress}/events/${keskusEvent?.id}">Keskusesse</a></h3>
  <br>
  ${purgeHtml(keskusEvent.headline)}`;
}

export default defineEventHandler(async (event) => {
  const body = await zh.useValidatedBody(
    event,
    z.object({
      headline: z.string().min(3).max(500),
      body: z.string().min(1).max(1000000),
      location: z.string().min(1).max(500).optional(),
    })
  );
  const userId = event.context.auth.id as number;
  const me = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      firstname: true,
      lastname: true,
      nickname: true,
      email: true,
    },
  });
  const keskusEvent = await prisma.event.create({
    data: {
      headline: body.headline,
      body: body.body,
      location: body.location,
      userId,
    },
  });

  const cfg = useRuntimeConfig();
  // send emails
  const emailUsers = await prisma.user.findMany({
    where: {
      emailNotification: true,
      ...(cfg.emailsToAllEnabled ? undefined : { id: 1 }),
    },
    select: {
      email: true,
      firstname: true,
      lastname: true,
      nickname: true,
    },
  });
  const emailList = emailUsers.map((user) => `"${user.nickname || user.firstname || user.lastname}" <${user.email}>`);

  const sendOpts: SendMailOptions = {
    from: `[Keskus] ${generateName(me)} <${cfg.emailAddress}>`,
    bcc: emailList.join(', '),
    to: cfg.emailSender,
    subject: `[Keskus] ${generateName(me)} postitas: "${keskusEvent.headline.length > 75 ? `${keskusEvent.headline.slice(0, 75)}...` : keskusEvent.headline}"`,
    html: generateMailHtml(me, keskusEvent, cfg),
  };
  try {
    await createTransport({
      service: 'gmail',
      auth: {
        user: cfg.emailAddress,
        pass: cfg.emailPassword,
      },
    }).sendMail(sendOpts);
    // eslint-disable-next-line no-console
    console.log(`${generateName(me)} posted: "${keskusEvent.headline}". Email successfully sent to ${emailList.length} users`);
  } catch (err) {
    console.error('Failed to send email', err);
  }

  return keskusEvent;
});
