'use client';

import { Tabs } from '@heroui/react';
import { ShieldUserIcon, UsersGroupTwoRoundedIcon } from '@solar-icons/react/bold';
import { UsersGroupRoundedIcon } from '@solar-icons/react/bold-duotone';
import { usePathname, useRouter } from 'next/navigation';

export default function RootUsersTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="container-wrapper flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="flex items-center gap-2 text-2xl font-bold">Users</h1>
          <p className="text-muted text-sm">Manage your users here</p>
        </div>
        <Tabs
          onSelectionChange={(value) => {
            router.push(value as string);
          }}
          selectedKey={pathname}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Offer sections">
              <Tabs.Tab href={`/root/users`} id="/root/users">
                <ShieldUserIcon className="mr-2 size-4" />
                Administrators
              </Tabs.Tab>
              <Tabs.Tab href={`/root/users/affiliates`} id="/root/users/affiliates">
                <UsersGroupTwoRoundedIcon className="mr-2 size-4" />
                Affiliates
              </Tabs.Tab>
              <Tabs.Tab
                className="whitespace-nowrap"
                href={`/root/users/co-producers`}
                id="/root/users/co-producers"
              >
                <UsersGroupRoundedIcon className="mr-2 size-4" />
                Co-Producers
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>
      {children}
    </div>
  );
}
