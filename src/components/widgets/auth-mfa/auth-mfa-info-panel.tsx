'use client';

import { BuildingsIcon, ShieldKeyholeIcon, UserIcon } from '@solar-icons/react/bold';
import { PhoneIcon, WalletIcon } from '@solar-icons/react/linear';
import { Card } from '@heroui/react';

import { MFA_TRIGGERS } from './auth-mfa.constants';

import type { ReactNode } from 'react';

const TRIGGER_ICONS: Record<string, ReactNode> = {
  admin: <UserIcon className="text-accent size-5" />,
  bank: <BuildingsIcon className="text-accent size-5" />,
  device: <PhoneIcon className="text-accent size-5" />,
  security: <ShieldKeyholeIcon className="text-accent size-5" />,
  transfers: <WalletIcon className="text-accent size-5" />,
};

export function AuthMfaInfoPanel() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[368px]">
      <Card>
        <Card.Header>
          <Card.Title>Quando o MFA será solicitado?</Card.Title>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <ul className="flex flex-col gap-4">
            {MFA_TRIGGERS.map((item) => (
              <li className="flex items-start gap-3" key={item.key}>
                <span className="mt-0.5 shrink-0">{TRIGGER_ICONS[item.key]}</span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-muted text-xs leading-relaxed">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="bg-surface-secondary flex items-start gap-3 rounded-xl p-3">
            <ShieldKeyholeIcon className="text-accent mt-0.5 size-4 shrink-0" />
            <p className="text-muted text-xs leading-relaxed">
              A MarkePublish nunca solicitará seu código MFA por e-mail, telefone, WhatsApp ou chat.
            </p>
          </div>
        </Card.Content>
      </Card>
    </aside>
  );
}
