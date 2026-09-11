import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { rtkQueryErrorMiddleware } from './middleware/rtk-query-error.middleware';
import { sessionListenerMiddleware } from './middleware/session.listener';
import { rootReducer } from './root-reducer';
import { api } from './services/api/base-api';

export { resetAppState } from './reset-app-state';

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'api/executeQuery/pending',
            'api/executeQuery/fulfilled',
            'api/executeMutation/pending',
            'api/executeMutation/fulfilled',
            'api/executeMutation/rejected',
          ],
          ignoredActionPaths: ['meta.arg', 'meta.baseQueryMeta', 'payload'],
        },
      })
        .prepend(sessionListenerMiddleware.middleware)
        .concat(api.middleware)
        .concat(rtkQueryErrorMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export function setupStoreListeners(store: AppStore): void {
  setupListeners(store.dispatch);
}
