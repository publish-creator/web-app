import { ShoppingBag, Timeline } from '@gravity-ui/icons';
import { Card2BoldIcon } from '@solar-icons/react';
import {
  CartLarge4Icon,
  SquareAcademicCap2Icon,
  UsersGroupRoundedIcon,
  VideoFrame2Icon,
  WalletIcon,
  WidgetAddIcon,
} from '@solar-icons/react/bold';
import { HomeIcon } from '@solar-icons/react/bold/home';
import { SettingsIcon } from '@solar-icons/react/linear';

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
  { href: '/social-profiles', icon: UsersGroupRoundedIcon, label: 'Social Profiles' },
  { href: '/creative-library', icon: VideoFrame2Icon, label: 'Creative Library' },
  { href: '/tools', icon: WidgetAddIcon, label: 'Tools' },
  { href: '/master-classes', icon: SquareAcademicCap2Icon, label: 'Master Classes' },
] as const;

export const NAV_ITEMS_ROOT: readonly NavItem[] = [
  { href: '/root', label: 'Dashboard', icon: HomeIcon },
  { href: '/root/offers', label: 'Offers', icon: CartLarge4Icon },
  { href: '/root/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/root/subscriptions', label: 'Subscriptions', icon: Timeline },
  { href: '/root/transactions', label: 'Transactions', icon: Card2BoldIcon },
  { href: '/root/users', label: 'Users', icon: UsersGroupRoundedIcon },
  { href: '/root/settings', label: 'Settings', icon: SettingsIcon },
] as const;

export const FOOTER_ITEMS: readonly NavItem[] = [
  { href: '/help', label: 'Help & Information' },
  { href: '/logout', label: 'Log out' },
] as const;
