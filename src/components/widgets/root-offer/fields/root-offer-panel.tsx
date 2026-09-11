'use client';

import { Card } from '@heroui/react';

export const RootOfferPanel = ({
  title,
  description,
  children,
}: {
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}) => (
  <Card>
    <Card.Header className="pb-2">
      <Card.Title className="text-base">{title}</Card.Title>
      {description ? <Card.Description>{description}</Card.Description> : null}
    </Card.Header>
    <Card.Content className="flex flex-col gap-4">{children}</Card.Content>
  </Card>
);
