import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import type { SocialAccount } from '@/store/services/social-accounts';

import { SocialAccountCard } from './social-account-card';

vi.mock('@heroui/react', () => ({
  Button: ({ children, onPress }: { children: ReactNode; onPress?: () => void }) => (
    <button onClick={onPress} type="button">
      {children}
    </button>
  ),
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Chip: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

vi.mock('@/components/base/icons-svg', () => ({
  InstagramIcon: () => <span>ig</span>,
  TikTokIcon: () => <span>tt</span>,
}));

function buildAccount(overrides: Partial<SocialAccount> = {}): SocialAccount {
  return {
    id: 'acc-1',
    platform: 'instagram',
    status: 'active',
    externalAccountId: '17841400000000000',
    username: 'lojadaana',
    accountType: 'BUSINESS',
    tokenExpiresAt: '2026-12-01T00:00:00.000Z',
    connectedByRef: null,
    createdAt: '2026-09-01T00:00:00.000Z',
    ...overrides,
  };
}

const noop = () => {};

describe('SocialAccountCard', () => {
  it('shows the handle when the platform gave a username', () => {
    render(
      <SocialAccountCard
        account={buildAccount()}
        isDisconnecting={false}
        onDisconnect={noop}
        onReconnect={noop}
      />,
    );

    expect(screen.getByText('@lojadaana')).toBeInTheDocument();
  });

  it('falls back to the external id when there is no username, instead of an empty line', () => {
    render(
      <SocialAccountCard
        account={buildAccount({ username: null })}
        isDisconnecting={false}
        onDisconnect={noop}
        onReconnect={noop}
      />,
    );

    expect(screen.getByText('17841400000000000')).toBeInTheDocument();
  });

  it('offers no reconnect for a healthy account', () => {
    render(
      <SocialAccountCard
        account={buildAccount()}
        isDisconnecting={false}
        onDisconnect={noop}
        onReconnect={noop}
      />,
    );

    expect(screen.queryByText('Reconectar')).not.toBeInTheDocument();
  });

  it('offers reconnect and says why when the access has dropped', () => {
    const onReconnect = vi.fn();

    render(
      <SocialAccountCard
        account={buildAccount({ status: 'reconnectRequired' })}
        isDisconnecting={false}
        onDisconnect={noop}
        onReconnect={onReconnect}
      />,
    );

    expect(screen.getByText(/Nada é publicado/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Reconectar'));

    expect(onReconnect).toHaveBeenCalled();
  });

  it('warns before the access expires, while the account still works', () => {
    render(
      <SocialAccountCard
        account={buildAccount({ status: 'expiring' })}
        isDisconnecting={false}
        onDisconnect={noop}
        onReconnect={noop}
      />,
    );

    expect(screen.getByText('Expirando')).toBeInTheDocument();
    expect(screen.getByText(/vence em breve/)).toBeInTheDocument();
  });

  it('says the access has no deadline rather than printing an empty date', () => {
    render(
      <SocialAccountCard
        account={buildAccount({ tokenExpiresAt: null })}
        isDisconnecting={false}
        onDisconnect={noop}
        onReconnect={noop}
      />,
    );

    expect(screen.getByText('sem prazo')).toBeInTheDocument();
  });

  it('asks to disconnect the account it is showing', () => {
    const onDisconnect = vi.fn();

    render(
      <SocialAccountCard
        account={buildAccount()}
        isDisconnecting={false}
        onDisconnect={onDisconnect}
        onReconnect={noop}
      />,
    );

    fireEvent.click(screen.getByText('Desconectar'));

    expect(onDisconnect).toHaveBeenCalled();
  });
});
