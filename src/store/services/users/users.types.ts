import type { PaginatedResponse, PaginationParams } from '../types';

export type User = {
  id: string;
  code: string;
  name: string;
  email: string;
  document: string | null;
  documentType: string | null;
  isActive: boolean;
  emailVerified: boolean;
  platformRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  logins: number;
  lastLoginAt: string | null;
  language: 'PT_BR' | 'EN_US';
  phone: string;
  avatar: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  status: string;
  role: 'USER' | 'ADMIN';
  platformRole: string;
  country: string | null;
  createdAt: string;
  tags: { id: string; name: string }[];
};

export type UserSearchParams = PaginationParams & {
  filter?: string;
  userTagId?: string;
};

export type UserSearchResponse = PaginatedResponse<UserRow>;

export type UsersListParams = PaginationParams & {
  filter?: string;
  /** Mapped from URL `status` (e.g. active, inactive). */
  status?: string;
};

export type UsersListResponse = PaginatedResponse<User>;
