/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { Spinner } from '@heroui/react';

import { REDIRECT_SIGN_OUT_ROUTE, publicRoutes } from '@/config/public-routes';
import { accessRuleFor } from '@/config/route-access';
import { AuthRefreshManager } from '@/lib/auth/auth-refresh';
import { redirectTargetFor } from '@/lib/auth/pending-route';
import { accessDecision } from '@/lib/auth/route-access';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetAppState } from '@/store/reset-app-state';
import { useLazyGetSessionQuery, useSignOutMutation } from '@/store/services';
import type { AuthUser } from '@/store/services/auth';

function RouteAccessPending() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3">
      <Spinner className="size-6" />
      <p className="text-muted text-sm">Verificando seu acesso…</p>
    </div>
  );
}

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

  const [getSession, { isError, isSuccess, isLoading: getSessionLoading }] =
    useLazyGetSessionQuery();

  const accessRule = accessRuleFor(pathname ?? '');
  const access = accessDecision(accessRule, user, isSuccess);

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
    if (!user || hasPublicRoutes) return;

    const target = redirectTargetFor(pathname, pending);

    if (target) router.replace(target);
  }, [hasPublicRoutes, pathname, pending, router, user]);

  useEffect(() => {
    if (isError && !hasPublicRoutes) {
      void onSignOut();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    if (access === 'redirect' && accessRule) router.replace(accessRule.fallback);
  }, [access, accessRule, router]);

  return (
    <SessionContext.Provider
      value={{
        onSignOut,
        isLoading: getSessionLoading || isLoggingOut,
        user,
      }}
    >
      {access === 'loading' || access === 'redirect' ? <RouteAccessPending /> : children}
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
