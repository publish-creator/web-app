'use client';

import { AuthFlowHeader } from '@/widgets/auth';

import { AuthMfaContentRecovery } from './auth-mfa-content-recovery';
import { AuthMfaContentSetup } from './auth-mfa-content-setup';
import { useAuthMfa } from './auth-mfa-context';
import { AuthMfaFooter } from './auth-mfa-footer';
import { AuthMfaInfoPanel } from './auth-mfa-info-panel';

export function AuthMfaShell() {
  const { step } = useAuthMfa();

  return (
    <div className="auth-mfa-bg bg-background text-foreground flex h-dvh w-full flex-col overflow-hidden">
      <AuthFlowHeader className="shrink-0" />

      <div className="flex min-h-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <main className="mx-auto min-h-0 w-full max-w-360 flex-1 overflow-y-auto px-20 py-8">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
              {step === 1 ? <AuthMfaContentSetup /> : <AuthMfaContentRecovery />}
              <AuthMfaInfoPanel />
            </div>
          </main>

          <AuthMfaFooter />
        </div>
      </div>
    </div>
  );
}
