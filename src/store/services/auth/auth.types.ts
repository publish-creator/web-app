import type { User } from '../users/users.types';

export type Session = {
  user: User;
};

export type SignInDto = {
  email: string;
  password: string;
};

export type SignInResponse = {
  user: User;
  token?: string;
  needTwoFactor?: boolean;
};
