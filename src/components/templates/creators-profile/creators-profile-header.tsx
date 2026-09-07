'use client';

import { Button, Tabs } from '@heroui/react';
import { AddCircleBoldIcon } from '@solar-icons/react';
import { usePathname, useRouter } from 'next/navigation';

export const CreatorsProfileHeader = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Creators Profile</h1>
        <p className="text-muted text-sm">lorum ipsum dolor sit amet</p>
      </div>
      <div className="flex items-center gap-2">
        <Tabs
          onSelectionChange={(value) => {
            router.push(value as string);
          }}
          selectedKey={pathname}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Offer sections">
              <Tabs.Tab href={`/creators/profile/old`} id="/creators/profile/old">
                Overview
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab href={`/creators/profile/old/account`} id="/creators/profile/old/account">
                Accounts
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
        <Button onPress={() => router.push('/creators/profile/create')}>
          <AddCircleBoldIcon />
          Add
        </Button>
      </div>
    </div>
  );
};
