import type { PaginatedResponse, PaginationParams } from '../types';
import type { InviteCode } from '../users/invite-codes.types';

export type BuyLinkType = 'DTC' | 'BUY_LINK';

export type BuyLink = {
  id: string;

  code: string;
  offerId: string;
  type: BuyLinkType;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imageUploadId: string | null;
  url: string;

  value: string;
  cpa: string | null;
  isAvailableForAllUsers: boolean;
  allowedUserIds: string[];
  userTagIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type BuyLinksResponse = { data: BuyLink[] };

export type BuyLinkWriteBody = {
  title: string;
  description: string | null;
  imageUrl: string | null;
  imageUploadId: string | null;
  url: string;
  value: number;
  cpa: number | null;
  isAvailableForAllUsers: boolean;
  allowedUserIds: string[];
};

export type OfferCreativeKind = 'IMAGE' | 'VIDEO';

export type OfferCreative = {
  id: string;
  offerId: string;
  kind: OfferCreativeKind;
  title: string;
  description: string | null;
  uploadId: string;
  sortOrder: number;
  mimeType: string;
  sizeBytes: number;

  url: string;
  createdAt: string;
  updatedAt: string;
};

export type OfferCreativesResponse = PaginatedResponse<OfferCreative>;

export type OfferSubListParams = PaginationParams;

export type ApplyTo = 'NEW_USERS' | 'OLD_USERS' | 'ALL_USERS';

export type AutomaticAffiliationUserTag = {
  id: string;
  name: string;
};

export type AutomaticAffiliation = {
  id: string;
  offerId: string;
  enabled: boolean;
  applyTo: ApplyTo;
  commissionMode: 'STANDARD' | 'ADVANCED';
  frontCommissionType: 'CPA' | 'REV_SHARE';
  frontCommissionValue: string;
  backCommissionType: 'CPA' | 'REV_SHARE';
  backCommissionValue: string;
  recurrenceCommissionType: 'CPA' | 'REV_SHARE';
  recurrenceCommissionValue: string;
  userTags: AutomaticAffiliationUserTag[];
  createdAt: string;
  updatedAt: string;
};

export type AutomaticAffiliationsResponse = PaginatedResponse<AutomaticAffiliation>;

export type AutomaticAffiliationWriteBody = {
  userTagIds: string[];
  applyTo: ApplyTo;
  frontCommissionType: 'CPA' | 'REV_SHARE';
  frontCommissionValue: number;
  backCommissionType: 'CPA' | 'REV_SHARE';
  backCommissionValue: number;
  recurrenceCommissionType: 'CPA' | 'REV_SHARE';
  recurrenceCommissionValue: number;
};

export type AffiliationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';

export type AffiliationUser = {
  id: string;
  name: string;
  email: string;
};

export type OfferAffiliation = {
  id: string;
  code: string;
  status: AffiliationStatus;
  offerId: string;
  userId: string;
  user: AffiliationUser | null;
  frontCommissionType: 'CPA' | 'REV_SHARE';
  frontCommissionValue: string;
  backCommissionType: 'CPA' | 'REV_SHARE';
  backCommissionValue: string;
  recurrenceCommissionType: 'CPA' | 'REV_SHARE';
  recurrenceCommissionValue: string;
  commissionSource: 'OFFER_DEFAULT' | 'MANUAL' | 'AUTOMATIC_RULE';
  requestedAt: string;
  decidedAt: string | null;
  decidedById?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OfferAffiliationsResponse = PaginatedResponse<OfferAffiliation>;

export type AdminAffiliationOffer = {
  id: string;
  code: string;
  title: string;
  imageUrl: string | null;
  currency: string | null;
  categoryName: string;
};

export type AffiliationInvite = InviteCode & {
  usedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
};

export type AdminAffiliation = OfferAffiliation & {
  tags: { id: string; name: string }[];
  offer: AdminAffiliationOffer | null;
  decidedBy: AffiliationUser | null;
};

export type AffiliationDetailUser = AffiliationUser & {
  phone: string | null;
  country: string | null;
  status: string;
  platformRole: string;
};

export type AffiliationDetailOffer = AdminAffiliationOffer & {
  description: string | null;
  angle: string | null;
  frontCommissionType: 'CPA' | 'REV_SHARE';
  frontCommissionValue: string;
  backCommissionType: 'CPA' | 'REV_SHARE';
  backCommissionValue: string;
  recurrenceCommissionType: 'CPA' | 'REV_SHARE';
  recurrenceCommissionValue: string;
};

export type AffiliationDetail = Omit<AdminAffiliation, 'user' | 'offer'> & {
  user: AffiliationDetailUser | null;
  offer: AffiliationDetailOffer | null;
  invite: AffiliationInvite | null;
};

export type AdminAffiliationCounts = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  canceled: number;
};

export type AdminAffiliationsResponse = PaginatedResponse<AdminAffiliation> & {
  counts: AdminAffiliationCounts;
};

export type OfferAuditEntity =
  | 'OFFER'
  | 'BUY_LINK'
  | 'OFFER_COPRODUCER'
  | 'AUTOMATIC_AFFILIATION'
  | 'AFFILIATION'
  | 'OFFER_CREATIVE'
  | 'OFFER_COPY'
  | 'OFFER_AVATAR';

export type OfferAuditAction = 'CREATED' | 'UPDATED' | 'DELETED';

export type OfferAuditActor = {
  id: string;
  name: string;
  email: string;
};

export type OfferAuditEntry = {
  id: string;
  entity: OfferAuditEntity;
  entityId: string;
  action: OfferAuditAction;
  before: unknown;
  after: unknown;
  changedById: string;
  changedBy: OfferAuditActor | null;
  changedByRole: string;
  changedByPlatform: string;
  actingUserId: string | null;
  isImpersonating: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  method: string;
  path: string;
  changedAt: string;
};

export type OfferAuditListResponse = PaginatedResponse<OfferAuditEntry>;
