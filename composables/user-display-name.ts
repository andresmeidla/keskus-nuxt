import type { User } from '@prisma/client';

export function userDisplayName(user: Pick<User, 'firstname' | 'lastname' | 'nickname'>): string {
  return user.nickname || user.firstname;
}
