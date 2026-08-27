'use client';

import { ChevronRight } from '@gravity-ui/icons';
import { Badge, Separator } from '@heroui/react';

import { ItemCard, ItemCardGroup, PressableFeedback } from '@heroui-pro/react';
import {
  BanknoteIcon,
  BuildingsIcon,
  LockIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@solar-icons/react/linear';

export function OnboardingCard() {
  return (
    <div className="">
      <ItemCardGroup className="overflow-hidden">
        <ItemCardGroup.Header>
          <ItemCardGroup.Title>Onboarding</ItemCardGroup.Title>
          <ItemCardGroup.Description>Complete your onboarding process</ItemCardGroup.Description>
        </ItemCardGroup.Header>

        <ItemCard<'button'>
          className="hover:bg-default/20 active:bg-default-hover/50 relative w-full cursor-pointer overflow-hidden transition-colors"
          render={(props) => <button type="button" {...props} />}
        >
          <PressableFeedback.Ripple />
          <Badge.Anchor>
            <Badge color="success" size="sm"></Badge>
            <ItemCard.Icon>
              <UserIcon />
            </ItemCard.Icon>
          </Badge.Anchor>
          <ItemCard.Content>
            <ItemCard.Title>Profile</ItemCard.Title>
            <ItemCard.Description>Update your personal information</ItemCard.Description>
          </ItemCard.Content>
          <ItemCard.Action>
            <ChevronRight className="text-muted size-4 rtl:-scale-x-100" />
          </ItemCard.Action>
        </ItemCard>
        <Separator />
        <ItemCard<'button'>
          className="hover:bg-default/20 active:bg-default-hover/50 relative w-full cursor-pointer overflow-hidden transition-colors"
          render={(props) => <button type="button" {...props} />}
        >
          <PressableFeedback.Ripple />
          <Badge.Anchor>
            <Badge color="success" size="sm"></Badge>
            <ItemCard.Icon>
              <LockIcon />
            </ItemCard.Icon>
          </Badge.Anchor>
          <ItemCard.Content>
            <ItemCard.Title>Security</ItemCard.Title>
            <ItemCard.Description>Manage passwords and 2FA</ItemCard.Description>
          </ItemCard.Content>
          <ItemCard.Action>
            <ChevronRight className="text-muted size-4 rtl:-scale-x-100" />
          </ItemCard.Action>
        </ItemCard>
        <Separator />
        <ItemCard<'button'>
          className="hover:bg-default/20 active:bg-default-hover/50 relative w-full cursor-pointer overflow-hidden transition-colors"
          render={(props) => <button type="button" {...props} />}
        >
          <PressableFeedback.Ripple />
          <Badge.Anchor>
            <Badge color="warning" size="sm"></Badge>
            <ItemCard.Icon>
              <BuildingsIcon />
            </ItemCard.Icon>
          </Badge.Anchor>

          <ItemCard.Content>
            <ItemCard.Title>Company</ItemCard.Title>
            <ItemCard.Description>Manage your company information</ItemCard.Description>
          </ItemCard.Content>
          <ItemCard.Action>
            <ChevronRight className="text-muted size-4 rtl:-scale-x-100" />
          </ItemCard.Action>
        </ItemCard>
        <ItemCard<'button'>
          className="hover:bg-default/20 active:bg-default-hover/50 relative w-full cursor-pointer overflow-hidden transition-colors"
          render={(props) => <button type="button" {...props} />}
        >
          <PressableFeedback.Ripple />
          <Badge.Anchor>
            <Badge color="warning" size="sm"></Badge>
            <ItemCard.Icon>
              <BanknoteIcon />
            </ItemCard.Icon>
          </Badge.Anchor>
          <ItemCard.Content>
            <ItemCard.Title>Bank account</ItemCard.Title>
            <ItemCard.Description>Manage your bank account information</ItemCard.Description>
          </ItemCard.Content>
          <ItemCard.Action>
            <ChevronRight className="text-muted size-4 rtl:-scale-x-100" />
          </ItemCard.Action>
        </ItemCard>
        <ItemCard<'button'>
          className="hover:bg-default/20 active:bg-default-hover/50 relative w-full cursor-pointer overflow-hidden transition-colors"
          render={(props) => <button type="button" {...props} />}
        >
          <PressableFeedback.Ripple />
          <Badge.Anchor>
            <Badge color="warning" size="sm"></Badge>
            <ItemCard.Icon>
              <ShieldCheckIcon />
            </ItemCard.Icon>
          </Badge.Anchor>
          <ItemCard.Content>
            <ItemCard.Title>Compliance</ItemCard.Title>
            <ItemCard.Description>Manage your compliance information</ItemCard.Description>
          </ItemCard.Content>
          <ItemCard.Action>
            <ChevronRight className="text-muted size-4 rtl:-scale-x-100" />
          </ItemCard.Action>
        </ItemCard>
      </ItemCardGroup>
    </div>
  );
}
