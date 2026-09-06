'use client';

import { Sidebar } from '@heroui-pro/react';
import { Chip } from '@heroui/react';

import type { NavItem } from '@/config/nav-items';
import { FOOTER_ITEMS, NAV_ITEMS } from '@/config/nav-items';
import { useSession } from '@/providers/session-provider';
import Image from 'next/image';

interface DashboardSidebarProps {
  pathname: string;
  basePath: string;
  disableNavigation?: boolean;
}

export function DashboardSidebar({
  basePath,
  disableNavigation = false,
  pathname,
}: DashboardSidebarProps) {
  return (
    <>
      {/* <Sidebar.Provider navigate={router.push}> */}
      <Sidebar aria-label="Main navigation" className="bg-surface max-w-80 border-none">
        <SidebarContents
          basePath={basePath}
          disableNavigation={disableNavigation}
          pathname={pathname}
        />
      </Sidebar>
      <Sidebar.Mobile>
        <SidebarContents
          basePath={basePath}
          disableNavigation={disableNavigation}
          idPrefix="mobile-"
          pathname={pathname}
        />
      </Sidebar.Mobile>
      {/* </Sidebar.Provider> */}
    </>
  );
}

interface SidebarContentsProps {
  basePath: string;
  disableNavigation: boolean;
  pathname: string;
  idPrefix?: string;
}

function SidebarContents({
  basePath,
  disableNavigation,
  idPrefix = '',
  pathname,
}: SidebarContentsProps) {
  const { onSignOut } = useSession();
  return (
    <>
      <Sidebar.Header className="flex h-16 items-center justify-center p-0">
        <Image alt="Logo" height={32} src="/images/markepublish-logo-invert.svg" width={200} />
      </Sidebar.Header>
      <Sidebar.Content className="p-3">
        <Sidebar.Group>
          <Sidebar.Menu aria-label="Dashboard navigation" className="gap-2">
            {NAV_ITEMS.map((item) => (
              <SidebarNavItem
                basePath={basePath}
                disableNavigation={disableNavigation}
                idPrefix={idPrefix}
                item={item}
                key={item.href}
                pathname={pathname}
              />
            ))}
          </Sidebar.Menu>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Menu aria-label="Account">
          {FOOTER_ITEMS.map((item) => (
            <SidebarNavItem
              basePath={basePath}
              disableNavigation={disableNavigation}
              idPrefix={idPrefix}
              item={item}
              key={item.href}
              pathname={pathname}
            />
          ))}
        </Sidebar.Menu>
      </Sidebar.Footer>
    </>
  );
}

interface SidebarNavItemProps {
  basePath: string;
  disableNavigation: boolean;
  idPrefix: string;
  item: NavItem;
  pathname: string;
}

function SidebarNavItem({
  basePath,
  disableNavigation,
  idPrefix,
  item,
  pathname,
}: SidebarNavItemProps) {
  const Icon = item.icon;
  const fullHref = basePath + item.href;
  const isCurrent =
    item.href === '/'
      ? pathname === fullHref || pathname === basePath || pathname === `${basePath}/`
      : pathname === fullHref;

  return (
    <Sidebar.MenuItem
      className="h-11 max-h-11 min-h-11"
      {...(disableNavigation ? {} : { href: fullHref })}
      id={`${idPrefix}${item.href}`}
      isCurrent={isCurrent}
      textValue={item.label}
    >
      {!!Icon && (
        <Sidebar.MenuIcon>
          <Icon />
        </Sidebar.MenuIcon>
      )}
      <Sidebar.MenuLabel className="font-bold">{item.label}</Sidebar.MenuLabel>
      {item.badge ? (
        <Sidebar.MenuChip>
          <Chip color="success" size="sm" variant="soft">
            {item.badge}
          </Chip>
        </Sidebar.MenuChip>
      ) : null}
    </Sidebar.MenuItem>
  );
}
