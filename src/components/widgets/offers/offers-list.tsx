import { Tabs } from '@heroui/react';
import { Widget4Icon } from '@solar-icons/react/bold';
import { SliderMinimalisticHorizontalIcon } from '@solar-icons/react/bold-duotone';

export const OffersList = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold">All Offers</p>
          <p className="text-muted mt-0.5 text-sm">309 offers</p>
        </div>
        <div className="flex items-center gap-1">
          <Tabs defaultSelectedKey="all">
            <Tabs.ListContainer>
              <Tabs.List>
                <Tabs.Tab id="all">
                  <Widget4Icon size="16px" />
                </Tabs.Tab>
                <Tabs.Tab id="featured">
                  <SliderMinimalisticHorizontalIcon size="16px" />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
