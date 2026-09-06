'use client';

import { LockIcon } from '@solar-icons/react/bold';

import { useAuthMfa } from './auth-mfa-context';

const STEPS = [
  { key: 'activate', label: 'Ativar autenticação em duas etapas', number: 1 },
  { key: 'recovery', label: 'Códigos de recuperação', number: 2 },
  {
    key: 'onboarding',
    label: 'Ativação da conta',
    locked: true,
    number: 3,
    subtitle: 'Onboarding e verificação de identidade',
  },
] as const;

export function AuthMfaStepper() {
  const { step } = useAuthMfa();

  return (
    <aside className="border-border hidden h-full w-64 shrink-0 flex-col border-r px-6 py-6 lg:hidden">
      <p className="text-muted text-xs font-semibold tracking-[0.14em]">PROTEÇÃO DA CONTA</p>
      <p className="text-muted mb-8 text-sm">Etapa obrigatória</p>

      <nav aria-label="Etapas da proteção da conta" className="flex flex-col">
        {STEPS.map((item, index) => {
          const isLast = index === STEPS.length - 1;
          const isActive = !('locked' in item && item.locked) && step === item.number;
          const isCompleted = !('locked' in item && item.locked) && step > item.number;
          const isLocked = 'locked' in item && item.locked;

          return (
            <div aria-current={isActive ? 'step' : undefined} className="flex gap-3" key={item.key}>
              <div className="flex w-8 shrink-0 flex-col items-center">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                    isActive
                      ? 'border-accent bg-accent text-accent-foreground'
                      : isCompleted
                        ? 'border-accent text-accent'
                        : 'border-border text-muted'
                  }`}
                >
                  {isLocked ? <LockIcon className="size-3.5" /> : item.number}
                </div>
                {isLast ? null : (
                  <div
                    className={`my-1 min-h-8 w-0.5 flex-1 ${isCompleted ? 'bg-accent' : 'bg-border'}`}
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-0.5 pt-1 pb-6">
                <span
                  className={`text-sm leading-tight font-semibold ${
                    isActive ? 'text-accent' : isLocked ? 'text-muted' : 'text-foreground'
                  }`}
                >
                  {item.label}
                </span>
                {'subtitle' in item ? (
                  <span className="text-muted text-xs leading-tight">{item.subtitle}</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
