import { formatCurrency } from '@/utils/format-currency';
import { Widget } from '@heroui-pro/react';
import { Button, Card, Chip, Table, Tabs } from '@heroui/react';
import { CopyBoldIcon } from '@solar-icons/react';
import { HeartIcon, ShareIcon } from '@solar-icons/react/bold';
import { AltArrowLeftIcon, EyeIcon } from '@solar-icons/react/linear';

export const OfferDetails = () => {
  return (
    <div className="grid grid-cols-[auto_480px] gap-6 px-20 pt-8 pb-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost">
            <AltArrowLeftIcon />
            Offers
          </Button>
          <div className="flex items-center gap-2">
            <Tabs>
              <Tabs.ListContainer>
                <Tabs.List aria-label="Offer sections">
                  <Tabs.Tab>Details</Tabs.Tab>
                  <Tabs.Tab>Metrics</Tabs.Tab>
                  <Tabs.Tab>publications</Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
            <Button variant="tertiary">
              <ShareIcon />
              Shared
            </Button>
            <Button aria-label="Toggle favorite" isIconOnly variant="tertiary">
              <HeartIcon />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <img
            alt="Offer"
            className="aspect-video max-h-[140px] max-w-[280px] rounded-md"
            src="https://placehold.co/1280x720"
          />
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-semibold">Nome da oferta</p>
            <div className="flex items-center gap-2">
              <Chip color="success" variant="secondary">
                {formatCurrency(100)}
              </Chip>
              <Chip className="text-muted" variant="secondary">
                CPA
              </Chip>
              <Chip className="text-muted" variant="secondary">
                Category
              </Chip>
              <Chip color="warning" variant="secondary">
                Approved Required
              </Chip>
            </div>
            <img alt="Avatar" className="size-6 rounded-full" src="https://placehold.co/32x32" />
          </div>
        </div>
        <div className="flex max-w-140 flex-col gap-2">
          <p className="text-base font-semibold">About this offer</p>
          <p className="text-muted text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id ipsa veniam distinctio nam
            facilis, amet hic totam alias. Nemo eaque esse perferendis autem consequatur libero sit
            aspernatur perspiciatis ducimus eum.
          </p>
        </div>
        <div className="flex max-w-140 flex-col gap-2">
          <p className="text-base font-semibold">Offer terms</p>
          <p className="text-muted text-sm">
            • Installs have to come from real users. <br /> • Incentivised traffic is allowed only
            where the says so. <br /> • Don&apos;t promise rewards the app doesn&apos;t pay, and
            don&apos;t misrepresent what a user can earn. <br /> • No fake app store reviews. <br />{' '}
            • Your creatives have to represent the accurately. No false claims, made up
            testimonials, or misleading angles. <br /> • No promotional tactics involving
            discrimination, hate speech, or derogatory content. <br /> • No fake urgency or pressure
            tactics. <br /> • Break these and you&apos;ll be pulled from the , and possibly from
            future ones.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold">Creatives offers</p>
            <Button variant="secondary">Create</Button>
          </div>
          <div className="grid w-full grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((item, index) => (
              <div
                className="hover:bg-surface-hover group flex cursor-pointer flex-col rounded-2xl p-1 transition-colors duration-200"
                key={index}
              >
                <div className="bg-surface aspect-[3/4] rounded-2xl" />
                <div className="px-2">
                  <p className="group-hover:text-primary text-sm font-semibold">Nome</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((item, index) => (
                      <Chip
                        className="bg-surface-secondary text-muted group-hover:bg-surface"
                        color="default"
                        key={index}
                      >
                        Tag {index + 1}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Card>
          <Card.Content className="flex flex-col gap-4">
            <div className="flex flex-col">
              <p className="text-base font-semibold">Interested in this offer?</p>
              <p className="text-muted text-sm">
                The advertiser reviews applications before handing out links.
              </p>
            </div>
            <Button className="w-full">Apply for access</Button>
          </Card.Content>
        </Card>
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
      </div>
    </div>
  );
};
