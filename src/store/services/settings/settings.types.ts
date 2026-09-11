import type { PaginatedResponse, PaginationParams } from '../types';

export type CountryGroup = {
  id: string;
  name: string;
  description: string | null;
  countries: string[];
  total: number;
  sortOrder: number;
};

export type UserTag = {
  id: string;
  name: string;
  users: number;
};

export type SettingsListParams = PaginationParams & {
  filter?: string;
  order?: 'asc' | 'desc';
};

export type CountryGroupListResponse = PaginatedResponse<CountryGroup>;
export type UserTagListResponse = PaginatedResponse<UserTag>;
