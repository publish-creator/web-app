export type ApiExtraOptions = {
  /** Skip 401 refresh orchestration (login, logout, public calls). */
  skipAuth?: boolean;
  skipRetry?: boolean;
  workspaceId?: string;
};

export type RequestHeadersContext = {
  locale?: string;
  timezone?: string;
  workspaceId?: string;
};
