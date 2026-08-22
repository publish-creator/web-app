'use client';

import { Bell, Magnifier } from '@gravity-ui/icons';

import { Navbar } from '@heroui-pro/react';
import { Avatar, Button } from '@heroui/react';

import { IconButton } from '@/components/base/icon-button';
import { formatCurrency } from '@/utils/format-currency';

export interface DashboardNavbarProps {
  /** Title rendered in the navbar. Falls back to the home-page greeting. */
  title?: string;
}

export function DashboardNavbar({ title = 'Good morning, Kate' }: DashboardNavbarProps) {
  return (
    <Navbar maxWidth="full">
      <Navbar.Header>
        {/* <AppLayout.MenuToggle />
        <Sidebar.Trigger />
        <h1 className="text-foreground truncate text-xl font-semibold">{title}</h1> */}
        <Navbar.Spacer />
        <div className="flex items-center gap-2">
          <IconButton label="Search" size="sm" variant="tertiary">
            <Magnifier className="size-4" />
          </IconButton>
          <IconButton label="Notifications" size="sm" variant="tertiary">
            <Bell className="size-4" />
          </IconButton>
          <Button className='text-lg font-bold' size="sm" variant='tertiary'>
           {formatCurrency(1000)}
          </Button>
          
          <Avatar className='ring-2 size-6.5  ring-offset-2 ring-offset-background ring-accent' size='sm'>
            <Avatar.Image
              alt="Kate Moore"
            />
            {/* <Avatar.Fallback>KM</Avatar.Fallback> */}
          </Avatar>
        </div>
      </Navbar.Header>
    </Navbar>
  );
}
