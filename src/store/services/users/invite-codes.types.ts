import type { PaginatedResponse, PaginationParams } from '../types';

export type InviteCodeType = 'TEMP' | 'PERM';
export type InviteCodeStatus = 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED' | 'REVOKED';

export type InvitePerson = {
  id: string;
  name: string;
  email: string;
};

export type InviteCode = {
  id: string;
  code: string;
  email: string | null;
  name: string | null;
  role: 'USER' | 'ADMIN';
  platformRole: string;
  type: InviteCodeType;
  maxUses: number | null;
  usedCount: number;
  remainingUses: number | null;
  validity: string;
  status: InviteCodeStatus;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  invitedBy: InvitePerson | null;
  signupUrl: string;
};

export type InviteCodeUse = {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string; status: string } | null;
  ipAddress: string | null;
  userAgent: string | null;
  usedAt: string;
};

export type InviteCodeCounts = {
  total: number;
  active: number;
  expired: number;
  exhausted: number;
  revoked: number;
};

export type InviteCodesListParams = PaginationParams & {
  filter?: string;
  status?: InviteCodeStatus;
  type?: InviteCodeType;
  order?: 'asc' | 'desc';
};

export type InviteCodesListResponse = PaginatedResponse<InviteCode> & {
  counts: InviteCodeCounts;
};

export type InviteCodeDetail = InviteCode & {
  uses: PaginatedResponse<InviteCodeUse>;
};

export type InviteCodeWriteBody = {
  kind: 'LINK' | 'EMAIL';
  email?: string;
  name?: string | null;
  role?: 'USER' | 'ADMIN';
  platformRole?: string;
  reusable: boolean;
  maxUses?: number | null;
  expiresAt?: string;
};
