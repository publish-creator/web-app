'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { authApi } from '../../services/auth/auth.api';
import type { User } from '../../services/users/users.types';

export type SessionState = {
  user: User | null;
};

const initialState: SessionState = {
  user: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Pick<SessionState, 'user'>>) => {
      state.user = action.payload.user;
    },
    resetUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.getSession.matchFulfilled, (state, action) => {
      state.user = action.payload.user;
    });
  },
});

export const { setSession, resetUser } = sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;

export const sessionSelectors = {
  selectSession: (state: { session: SessionState }) => state.session.user,
};
