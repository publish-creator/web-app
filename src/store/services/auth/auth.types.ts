/**
 * These shapes follow the v2 API, not the reference API the rest of `services/` was written
 * against. Where the two disagree — `platformRole`, `status` — the v2 one wins here, because these
 * types describe what `/auth/*` actually answers.
 */

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
  phone: string | null;
};

/**
 * What the caller still has to do before the account is usable. The server builds this list; the
 * front routes on it but never decides it, because every one of these steps is also enforced by the
 * endpoint behind it.
 */
export type PendingStep = 'VERIFY_EMAIL' | 'SET_PASSWORD' | 'ENABLE_MFA' | 'ACCEPT_TERMS';

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

/**
 * The access token is not here on purpose — it comes back as an httpOnly cookie the page cannot
 * read. `mfaRequired` means the password was right and the second factor is still owed.
 */
export type SignInResponse = {
  user: AuthUser;
  mfaRequired?: boolean;
};

export type SignUpDto = {
  /** The invite code. Registration is invite-only; there is no open sign-up. */
  code: string;
  name: string;
  email: string;
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
  /** Shown once and never again — the only copy is the one the person writes down. */
  recoveryCodes: string[];
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
  /** How far down the text the reader was when it happened, 0-100. */
  atPercent?: number | null;
  occurredAt: string;
};

/**
 * The evidence an acceptance is recorded with: how far they scrolled, when they opened it, what they
 * were reading it on. An acceptance that cannot be shown to have happened is not worth much later.
 * The API caps `events` at 60, so the reader sends milestones, not every scroll tick.
 */
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
