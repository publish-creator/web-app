/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { publicRoutes, REDIRECT_SIGN_OUT_ROUTE } from '@/config/public-routes';
import { AuthRefreshManager } from '@/lib/auth/auth-refresh';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetAppState } from '@/store/reset-app-state';
import { useLazyGetSessionQuery, useSignOutMutation } from '@/store/services';
import type { User } from '@/store/services';

interface SessionProviderProps {
  children: React.ReactNode;
}

type SessionContextType = {
  onSignOut: () => void;
  isLoading: boolean;
  user: User | null;
};

export const SessionContext = createContext<SessionContextType>({
  onSignOut: () => {},
  isLoading: false,
  user: null,
});

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [authSignOut] = useSignOutMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user } = useAppSelector((state) => state.session);

  const hasPublicRoutes = publicRoutes.find((item) => pathname.startsWith(item.path));

  const [getSession, { isError, isLoading: getSessionLoading }] = useLazyGetSessionQuery();

  useEffect(() => {
    if (hasPublicRoutes && !user?.id) return;
    void getSession();
  }, [getSession, hasPublicRoutes, pathname, user?.id]);

  const onSignOut = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authSignOut().unwrap();
    } catch {
      // Cookie may already be expired; continue with the local reset.
    } finally {
      AuthRefreshManager.reset();
      resetAppState(dispatch);
      window.location.href = REDIRECT_SIGN_OUT_ROUTE;
    }
  };

  useEffect(() => {
    if (isError && !hasPublicRoutes) {
      void onSignOut();
    }
    // Same contract as Astron: react to session error, not to onSignOut identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  return (
    <SessionContext.Provider
      value={{
        onSignOut,
        isLoading: getSessionLoading || isLoggingOut,
        user,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within the Session provider');
  }

  return context;
};

export default SessionProvider;
