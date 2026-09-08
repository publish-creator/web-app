'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { authApi } from '../../services/auth/auth.api';
import type { AuthUser, PendingStep, Session } from '../../services/auth/auth.types';

/**
 * The whole session, not just the person. `pending` is what the onboarding routing reads, and
 * keeping it beside the user means one source rather than two that can disagree.
 */
export type SessionState = {
  user: AuthUser | null;
  pending: PendingStep[];
  mfaEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  termsAccepted: boolean;
};

const initialState: SessionState = {
  user: null,
  pending: [],
  mfaEnabled: false,
  emailVerified: false,
  phoneVerified: false,
  termsAccepted: false,
};

const fromSession = (session: Session): SessionState => ({
  user: session.user,
  pending: session.pending,
  mfaEnabled: session.mfa.enabled,
  emailVerified: session.emailVerified,
  phoneVerified: session.phoneVerified,
  termsAccepted: session.terms.accepted,
});

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (_state, action: PayloadAction<Session>) => fromSession(action.payload),
    resetUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.getSession.matchFulfilled, (_state, action) =>
      fromSession(action.payload),
    );
  },
});

export const { setSession, resetUser } = sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;

export const sessionSelectors = {
  selectSession: (state: { session: SessionState }) => state.session.user,
  selectPending: (state: { session: SessionState }) => state.session.pending,
  /**
   * True only once nothing is owed. Convenient for rendering, never for authorisation — the API
   * refuses a caller who skips a step regardless of what this says.
   */
  selectOnboardingComplete: (state: { session: SessionState }) =>
    state.session.pending.length === 0,
};
