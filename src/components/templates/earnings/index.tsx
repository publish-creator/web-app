'use client';

import { OnboardingCard } from '@/components/widgets/shared/onboarding-card';
import { Button, Tabs } from '@heroui/react';
import { WalletIcon } from '@solar-icons/react/linear';
import { usePathname } from 'next/navigation';

export const EarningsTemplate = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className="container-wrapper grid h-full grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_386px]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl leading-none font-bold">Earnings</h1>
            <p className="text-muted mt-0.5 text-base leading-none">
              View your earnings and transactions history.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button arial-label="Withdraw">
              <WalletIcon />
              Withdraw
            </Button>
            <Tabs
              onSelectionChange={(value) => {
                console.log(value);
              }}
              selectedKey={pathname}
            >
              <Tabs.ListContainer>
                <Tabs.List aria-label="Offer sections">
                  <Tabs.Tab href={`/earnings`} id="/earnings">
                    Earnings
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab href={`/earnings/orders`} id="/earnings/orders">
                    Orders
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab href={`/earnings/subscriptions`} id="/earnings/subscriptions">
                    Subscriptions
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>
        </div>
        {children}
      </div>
      <div>
        <OnboardingCard />
      </div>
    </div>
  );
};
