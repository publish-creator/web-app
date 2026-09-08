'use client';

import { Bell, Magnifier } from '@gravity-ui/icons';

import { AppLayout, Navbar } from '@heroui-pro/react';
import { Avatar, Button } from '@heroui/react';

import { IconButton } from '@/components/base/icon-button';
import { AppBreadcrumbs } from '@/components/widgets/shared';
import { useSession } from '@/providers/session-provider';
import { formatCurrency } from '@/utils/format-currency';

export interface DashboardNavbarProps {
  /** Title rendered in the navbar. Falls back to greeting whoever is signed in. */
  title?: string;
}

export function DashboardNavbar({ title }: DashboardNavbarProps) {
  const { user } = useSession();
  return (
    <Navbar maxWidth="full">
      <Navbar.Header className="px-8">
        <AppLayout.MenuToggle aria-label="Open navigation" />
        <AppBreadcrumbs labels={{ dashboard: 'Dashboard' }} />
        {/* The prop was declared and never rendered, so the navbar showed a hard-coded name for
            everyone. It now greets whoever is actually signed in. */}
        <span className="text-muted ml-2 hidden text-sm md:inline">
          {title ?? (user ? `Olá, ${user.name}` : '')}
        </span>

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
            {/* The v2 API carries no avatar, so the initial is what there is to show. */}
            <Avatar.Fallback>{user?.name?.charAt(0) ?? 'U'}</Avatar.Fallback>
          </Avatar>
        </div>
      </Navbar.Header>
    </Navbar>
  );
}
