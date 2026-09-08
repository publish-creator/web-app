/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { REDIRECT_SIGN_OUT_ROUTE, publicRoutes } from '@/config/public-routes';
import { AuthRefreshManager } from '@/lib/auth/auth-refresh';
import { nextRouteFor } from '@/lib/auth/pending-route';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetAppState } from '@/store/reset-app-state';
import { useLazyGetSessionQuery, useSignOutMutation } from '@/store/services';
import type { AuthUser } from '@/store/services/auth';

interface SessionProviderProps {
  children: React.ReactNode;
}

type SessionContextType = {
  onSignOut: () => void;
  isLoading: boolean;
  user: AuthUser | null;
};

export const SessionContext = createContext<SessionContextType>({
  onSignOut: () => {},
  isLoading: false,
  user: null,
});

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [authSignOut] = useSignOutMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, pending } = useAppSelector((state) => state.session);

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
    } finally {
      AuthRefreshManager.reset();
      resetAppState(dispatch);
      window.location.href = REDIRECT_SIGN_OUT_ROUTE;
    }
  };

  useEffect(() => {
    if (!user || hasPublicRoutes || pending.length === 0) return;

    const target = nextRouteFor({ pending });

    if (pathname !== target) router.replace(target);
  }, [hasPublicRoutes, pathname, pending, router, user]);

  useEffect(() => {
    if (isError && !hasPublicRoutes) {
      void onSignOut();
    }

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
