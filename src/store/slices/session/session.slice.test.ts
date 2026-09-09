import type { PayloadAction } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authApi } from '../../services/auth/auth.api';
import type { Session } from '../../services/auth/auth.types';
import { resetUser, sessionReducer, sessionSelectors, setSession } from './session.slice';
import type { SessionState } from './session.slice';

vi.mock('../../services/auth/auth.api', () => ({
  authApi: {
    endpoints: {
      getSession: {
        matchFulfilled: vi.fn(),
      },
    },
  },
}));

describe('sessionSlice Reducer & Selectors', () => {
  const dummyUser: Session['user'] = {
    id: 'usr-123',
    name: 'Gustavo',
    email: 'dev@agenus.com',
    status: 'ACTIVE',
    role: 'USER',
    platformRole: 'AFFILIATE',
    country: 'BR',
    phone: null,
  };

  const dummySession: Session = {
    user: dummyUser,
    emailVerified: true,
    phoneVerified: false,
    mfa: { enabled: true },
    terms: { accepted: true, version: '1.0' },
    pending: [],
  };

  const initialState: SessionState = {
    user: null,
    pending: [],
    mfaEnabled: false,
    emailVerified: false,
    phoneVerified: false,
    termsAccepted: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with an empty user session', () => {
    expect(sessionReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should apply the authenticated user inside setSession without storing a token', () => {
    const nextState = sessionReducer(initialState, setSession(dummySession));

    expect(nextState.user).toEqual(dummyUser);
    expect(JSON.stringify(nextState)).not.toContain('token');
  });

  it('should clear the user when resetUser is dispatched', () => {
    const authenticated = sessionReducer(initialState, setSession(dummySession));

    expect(sessionReducer(authenticated, resetUser())).toEqual(initialState);
  });

  it('should hydrate the user when getSession fulfills', () => {
    vi.mocked(authApi.endpoints.getSession.matchFulfilled).mockReturnValue(
      true as unknown as ReturnType<typeof authApi.endpoints.getSession.matchFulfilled>,
    );

    const nextState = sessionReducer(initialState, {
      type: 'auth/getSession/fulfilled',
      payload: dummySession,
    } as unknown as PayloadAction<Session>);

    expect(nextState.user).toEqual(dummyUser);
  });

  it('should correctly filter and return user details context via selectSession selector', () => {
    const state = { session: sessionReducer(initialState, setSession(dummySession)) };

    expect(sessionSelectors.selectSession(state)).toEqual(dummyUser);
  });

  it('keeps the pending list the server sent, in order', () => {
    const owing: Session = { ...dummySession, pending: ['ENABLE_MFA', 'ACCEPT_TERMS'] };

    const state = { session: sessionReducer(initialState, setSession(owing)) };

    expect(sessionSelectors.selectPending(state)).toEqual(['ENABLE_MFA', 'ACCEPT_TERMS']);
    expect(sessionSelectors.selectOnboardingComplete(state)).toBe(false);
  });

  it('reports onboarding complete only when nothing is owed', () => {
    const state = { session: sessionReducer(initialState, setSession(dummySession)) };

    expect(sessionSelectors.selectOnboardingComplete(state)).toBe(true);
  });
});
