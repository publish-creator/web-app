export type PlatformRole = 'AFFILIATE' | 'PRODUCER' | 'COPRODUCER';

export type Role = 'USER' | 'ADMIN' | 'ROOT';

export type UserStatus = 'PENDING' | 'ACTIVE' | 'BLOCKED';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  role: Role;
  platformRole: PlatformRole;
  country: string | null;
  phone: string | null;
};

export type PendingStep =
  | 'VERIFY_EMAIL'
  | 'VERIFY_PHONE'
  | 'SET_PASSWORD'
  | 'ENABLE_MFA'
  | 'ACCEPT_TERMS';

export type Session = {
  user: AuthUser;
  emailVerified: boolean;
  phoneVerified: boolean;
  mfa: { enabled: boolean };
  terms: { accepted: boolean; version: string | null };
  pending: PendingStep[];
};

export type SignInDto = {
  email: string;
  password: string;
};

export type SignInResponse = {
  user: AuthUser;
  mfaRequired?: boolean;
};

export type SignUpDto = {
  code: string;
  name: string;
  email: string;
  country: string;
};

export type VerifyEmailRequestDto = { email: string };

export type VerifyEmailConfirmDto = { email: string; code: string };

export type VerifyPhoneRequestDto = { phone: string };

export type VerifyPhoneConfirmDto = { code: string };

export type SetPasswordDto = {
  password: string;
  currentPassword?: string;
};

export type MfaSetupResponse = {
  secret: string;
  otpauthUrl: string;
};

export type MfaConfirmDto = { code: string };

export type MfaConfirmResponse = {
  confirmed: boolean;

  recoveryCodes: string[];
};

export type SetPasswordResponse = {
  expiresIn: number;
  revokedSessions: number;
};

export type MfaVerifyDto = { code: string };

export type MfaRecoverDto = { code: string };

export type TermsCurrent = {
  id: string;
  version: string;
  url: string;
  contentHash: string;
  accepted: boolean;
};

export type TermsEventKind =
  | 'OPENED'
  | 'SCROLLED'
  | 'REACHED_END'
  | 'BLURRED'
  | 'FOCUSED'
  | 'ACCEPTED';

export type TermsEvent = {
  kind: TermsEventKind;

  atPercent?: number | null;
  occurredAt: string;
};

export type TermsAcceptDto = {
  termsVersionId: string;
  openedAt: string;
  reachedEndAt?: string | null;
  scrollDepthPercent: number;
  viewportWidth?: number;
  viewportHeight?: number;
  screenWidth?: number;
  screenHeight?: number;
  devicePixelRatio?: number;
  language?: string;
  timeZone?: string;
  events: TermsEvent[];
};

export type DeviceSession = {
  id: string;
  createdVia: string;
  userAgent: string | null;
  ip: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  current: boolean;
};

export type MagicLinkConsumeDto = { token: string };
