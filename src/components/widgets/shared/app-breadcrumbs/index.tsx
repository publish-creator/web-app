'use client';

import { FOOTER_ITEMS, NAV_ITEMS } from '@/config/nav-items';
import { Breadcrumbs } from '@heroui/react';
import { usePathname } from 'next/navigation';

const ROUTE_LABELS = new Map<string, string>(
  [...NAV_ITEMS, ...FOOTER_ITEMS].map((item) => [item.href, item.label]),
);

export interface AppBreadcrumbItem {
  href: string;
  label: string;
}

export interface AppBreadcrumbsProps {
  className?: string;
  labels?: Record<string, string>;
}

function humanizeSegment(segment: string) {
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resolveLabel(href: string, segment: string, labels: Record<string, string> = {}) {
  return labels[href] ?? labels[segment] ?? ROUTE_LABELS.get(href) ?? humanizeSegment(segment);
}

export function buildNavBreadcrumbs(pathname: string, labels: Record<string, string> = {}) {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const crumbs: AppBreadcrumbItem[] = [];

  if (normalized !== '/') {
    crumbs.push({
      href: '/',
      label: labels['/'] ?? ROUTE_LABELS.get('/') ?? 'Dashboard',
    });
  }

  let href = '';

  for (const segment of normalized.split('/').filter(Boolean)) {
    href += `/${segment}`;
    crumbs.push({
      href,
      label: resolveLabel(href, segment, labels),
    });
  }

  return crumbs;
}

export function AppBreadcrumbs({ className, labels }: AppBreadcrumbsProps) {
  const pathname = usePathname();
  const items = buildNavBreadcrumbs(pathname, labels);

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs {...(className ? { className } : {})}>
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;

        return (
          <Breadcrumbs.Item
            className="first:pl-0 last:pr-0"
            {...(isCurrent ? {} : { href: item.href })}
            key={item.href}
          >
            {item.label}
          </Breadcrumbs.Item>
        );
      })}
    </Breadcrumbs>
  );
}
