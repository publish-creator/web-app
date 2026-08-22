'use client';

import { combineReducers, createAction } from '@reduxjs/toolkit';

// Side-effect imports: register injected endpoints with the central API slice
import './services/analytics/analytics.api';
import { api } from './services/api/base-api';
import './services/auth/auth.api';
import './services/dashboard/dashboard.api';
import './services/orders/orders.api';
import './services/users/users.api';
import { sessionReducer } from './slices/session.slice';

export const resetStateAction = createAction('resetState');

const appReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  session: sessionReducer,
});

export const rootReducer: typeof appReducer = (state, action) => {
  if (resetStateAction.match(action)) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export type RootReducerState = ReturnType<typeof rootReducer>;
