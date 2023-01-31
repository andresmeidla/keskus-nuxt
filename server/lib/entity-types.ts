export type UserInfo = {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string | null;
  email: string | null;
};

export const DefaultUserAttributes: { [key in keyof UserInfo]: true } = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
  email: true,
};

export type PaginationQuery = {
  page: number;
  perPage: number;
};

export enum AttendanceState {
  Not = 'Not',
  Maybe = 'Maybe',
  Going = 'Going',
}
