import type { PayloadAction } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authApi } from '../services/auth/auth.api';
import type { User } from '../services/users/users.types';
import { resetUser, sessionReducer, sessionSelectors, setSession } from './session.slice';
import type { SessionState } from './session.slice';

vi.mock('../services/auth/auth.api', () => ({
  authApi: {
    endpoints: {
      getSession: {
        matchFulfilled: vi.fn(),
      },
    },
  },
}));

describe('sessionSlice Reducer & Selectors', () => {
  const dummyUser = { id: 'usr-123', name: 'Gustavo', email: 'dev@agenus.com' } as unknown as User;
  const initialState: SessionState = { user: null };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with an empty user session', () => {
    const result = sessionReducer(undefined, { type: '@@INIT' });

    expect(result).toEqual(initialState);
  });

  it('should apply the authenticated user inside setSession without storing a token', () => {
    const nextState = sessionReducer(initialState, setSession({ user: dummyUser }));

    expect(nextState.user).toBe(dummyUser);
  });

  it('should clear the user when resetUser is dispatched', () => {
    const authenticated: SessionState = { user: dummyUser };

    const nextState = sessionReducer(authenticated, resetUser());

    expect(nextState).toEqual(initialState);
  });

  it('should hydrate the user when getSession fulfills', () => {
    const mockSuccessAction = {
      type: 'auth/getSession/fulfilled',
      payload: { user: dummyUser },
    };

    vi.mocked(authApi.endpoints.getSession.matchFulfilled).mockReturnValue(
      true as unknown as ReturnType<typeof authApi.endpoints.getSession.matchFulfilled>,
    );

    const nextState = sessionReducer(
      initialState,
      mockSuccessAction as unknown as PayloadAction<SessionState>,
    );

    expect(nextState.user).toBe(dummyUser);
  });

  it('should correctly filter and return user details context via selectSession selector', () => {
    const globalState = {
      session: { user: dummyUser },
    };

    const selectedUser = sessionSelectors.selectSession(globalState);

    expect(selectedUser).toBe(dummyUser);
  });
});
