'use client';

import { Bell, Magnifier } from '@gravity-ui/icons';

import { AppLayout, Navbar } from '@heroui-pro/react';
import { Avatar, Button } from '@heroui/react';

import { IconButton } from '@/components/base/icon-button';
import { formatCurrency } from '@/utils/format-currency';
import { useSession } from '@/providers/session-provider';

export interface DashboardNavbarProps {
  /** Title rendered in the navbar. Falls back to the home-page greeting. */
  title?: string;
}

export function DashboardNavbar({ title = 'Good morning, Kate' }: DashboardNavbarProps) {
  const { user } = useSession();
  return (
    <Navbar maxWidth="full">
      <Navbar.Header>
        <AppLayout.MenuToggle aria-label="Open navigation" />
        <Navbar.Spacer />
        <div className="flex items-center gap-2">
          <IconButton label="Search" size="sm" variant="tertiary">
            <Magnifier className="size-4" />
          </IconButton>
          <IconButton label="Notifications" size="sm" variant="tertiary">
            <Bell className="size-4" />
          </IconButton>
          <Button className="text-lg font-bold" size="sm" variant="tertiary">
            {formatCurrency(1000)}
          </Button>

          <Avatar
            aria-label={user?.name ?? 'User'}
            className="ring-offset-background ring-accent size-6.5 ring-2 ring-offset-2"
            color="accent"
            size="sm"
          >
            {user?.avatar ? <Avatar.Image alt={user.name} src={user.avatar} /> : null}
            <Avatar.Fallback>{user?.name?.charAt(0) ?? 'U'}</Avatar.Fallback>
          </Avatar>
        </div>
      </Navbar.Header>
    </Navbar>
  );
}
