'use client';

import { Tabs } from '@heroui/react';
import { GalleryBoldIcon, Widget2BoldIcon } from '@solar-icons/react';
import { ShieldKeyholeIcon } from '@solar-icons/react/bold';
import { usePathname, useRouter } from 'next/navigation';

export default function RootSettingsTemplate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="container-wrapper flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted text-sm">Manage your settings here</p>
        </div>
        <Tabs
          className="ml-auto"
          onSelectionChange={(value) => {
            router.push(value as string);
          }}
          selectedKey={pathname}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Offer sections">
              <Tabs.Tab href={`/root/settings`} id="/root/settings">
                <Widget2BoldIcon className="mr-2 size-4" />
                Offers
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab href={`/root/settings/permissions`} id="/root/settings/permissions">
                <ShieldKeyholeIcon className="mr-2 size-4" />
                Permissions
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab href={`/root/settings/avatars`} id="/root/settings/avatars">
                <GalleryBoldIcon className="mr-2 size-4" />
                Avatars
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>
      {children}
    </div>
  );
}
