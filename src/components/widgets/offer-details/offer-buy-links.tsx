import { formatCurrency } from '@/utils/format-currency';
import { Widget } from '@heroui-pro/react';
import { Button, Table } from '@heroui/react';
import { CopyBoldIcon } from '@solar-icons/react';
import { EyeIcon } from '@solar-icons/react/bold';

export const OfferBuyLinks = () => {
  return (
    <Widget className="bg-surface">
      <Widget.Header className="h-fit">
        <div className="flex flex-col gap-0.5">
          <Widget.Title className="text-base font-semibold">Buy links</Widget.Title>
          <Widget.Description className="text-muted text-sm">
            Buy links from the advertiser directly.
          </Widget.Description>
        </div>
      </Widget.Header>
      <Widget.Content className="bg-surface-secondary mt-1.5 flex flex-col gap-4 p-0">
        <Table variant="secondary">
          <Table.Content className="p-0">
            <Table.Header className="sr-only">
              <Table.Column>Name</Table.Column>
              <Table.Column>Price</Table.Column>
              <Table.Column>Action</Table.Column>
            </Table.Header>
            <Table.Body>
              {Array.from({ length: 4 }).map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <img
                        alt="Avatar"
                        className="rounded-md"
                        height={32}
                        src="https://placehold.co/32x32"
                        width={32}
                      />
                      <div>
                        <p className="text-sm font-semibold">Nome da oferta</p>
                        <p className="text-muted text-xs">DTC / VSL</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(100)}</Table.Cell>
                  <Table.Cell className="">
                    <div className="flex justify-end">
                      <Button aria-label="Copy offer" isIconOnly size="sm" variant="ghost">
                        <CopyBoldIcon />
                      </Button>
                      <Button aria-label="View offer" isIconOnly size="sm" variant="ghost">
                        <EyeIcon />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
      </Widget.Content>
    </Widget>
  );
};
