import { createListenerMiddleware } from '@reduxjs/toolkit';

import { REDIRECT_SIGN_OUT_ROUTE } from '@/config/public-routes';
import { AuthRefreshManager } from '@/lib/auth/auth-refresh';

import { resetStateAction } from '../root-reducer';
import { authApi } from '../services/auth/auth.api';

const REFRESH_INTERVAL_MS = 14 * 60 * 1000;

export const sessionListenerMiddleware = createListenerMiddleware();

sessionListenerMiddleware.startListening({
  matcher: authApi.endpoints.getSession.matchFulfilled,
  effect: async (_action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    while (true) {
      const sessionWasReset = await listenerApi.condition(
        (action) => resetStateAction.match(action),
        REFRESH_INTERVAL_MS,
      );

      if (sessionWasReset) {
        break;
      }

      const refreshSuccess = await AuthRefreshManager.refresh();

      if (!refreshSuccess) {
        const { resetAppState } = await import('../reset-app-state');

        resetAppState(listenerApi.dispatch);
        window.location.href = REDIRECT_SIGN_OUT_ROUTE;
        break;
      }
    }
  },
});
