import {
  CartLarge4Icon,
  SquareAcademicCap2Icon,
  UsersGroupRoundedIcon,
  VideoFrame2Icon,
  WalletIcon,
} from '@solar-icons/react/bold';
import { HomeIcon } from '@solar-icons/react/bold/home';
import type { ComponentType } from 'react';

export type NavItem = {
  readonly href: string;
  readonly label: string;
  readonly icon?: ComponentType<{ className?: string }>;
  readonly badge?: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: 'Dashboard', icon: HomeIcon },
  { href: '/earnings', label: 'Earnings', icon: WalletIcon },
  { href: '/offers', icon: CartLarge4Icon, label: 'Offers' },
  { href: '/creators', icon: UsersGroupRoundedIcon, label: 'Creators' },
  { href: '/creators/profile', icon: UsersGroupRoundedIcon, label: 'Creators Profile' },
  { href: '/creative-library', icon: VideoFrame2Icon, label: 'Creative Library' },
  { href: '/master-classes', icon: SquareAcademicCap2Icon, label: 'Master Classes' },
] as const;

export const FOOTER_ITEMS: readonly NavItem[] = [
  { href: '/help', label: 'Help & Information' },
  { href: '/logout', label: 'Log out' },
] as const;
