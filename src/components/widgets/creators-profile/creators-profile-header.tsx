import { Button, Tabs } from '@heroui/react';
import { AddCircleBoldIcon } from '@solar-icons/react';
import { usePathname } from 'next/navigation';

export const CreatorsProfileHeader = () => {
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Creators Profile</h1>
        <p className="text-muted text-sm">lorum ipsum dolor sit amet</p>
      </div>
      <div className="flex items-center gap-2">
        <Tabs
          onSelectionChange={(value) => {
            console.log(value);
          }}
          selectedKey={pathname}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Offer sections">
              <Tabs.Tab href={`/creators/profile`} id="/creators/profile">
                Overview
              </Tabs.Tab>
              <Tabs.Tab href={`/creators/profile/account`} id="/creators/profile/account">
                Accounts
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
        <Button>
          <AddCircleBoldIcon />
          Add
        </Button>
      </div>
    </div>
  );
};
