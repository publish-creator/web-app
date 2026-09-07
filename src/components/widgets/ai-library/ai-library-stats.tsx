'use client';

import { Filmstrip, Globe, Microphone, Person, Persons } from '@gravity-ui/icons';
import { KPIGroup } from '@heroui-pro/react';
import { KPI } from '@heroui-pro/react/kpi';

import { AVATAR_STATS, VOICE_STATS } from './ai-library.constants';

import type { LibraryStat } from './ai-library.constants';
import type { ComponentType, SVGProps } from 'react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const AVATAR_ICONS: Record<string, IconComponent> = {
  avatars: Persons,
  'in-use': Person,
  videos: Filmstrip,
};

const VOICE_ICONS: Record<string, IconComponent> = {
  voices: Microphone,
  languages: Globe,
  assigned: Person,
};

type AiLibraryStatsProps = {
  variant?: 'avatars' | 'voices';
};

export function AiLibraryStats({ variant = 'avatars' }: AiLibraryStatsProps) {
  const stats = variant === 'voices' ? VOICE_STATS : AVATAR_STATS;
  const icons = variant === 'voices' ? VOICE_ICONS : AVATAR_ICONS;

  return (
    <KPIGroup>
      {stats.flatMap((stat, index) => [
        index > 0 ? <KPIGroup.Separator key={`${stat.id}-separator`} /> : null,
        <StatMetric icon={icons[stat.id] ?? Person} key={stat.id} stat={stat} />,
      ])}
    </KPIGroup>
  );
}

function StatMetric({ icon: Icon, stat }: { icon: IconComponent; stat: LibraryStat }) {
  return (
    <KPI className="border-0 bg-transparent shadow-none">
      <div className="flex items-center gap-3">
        <KPI.Icon className="from-accent-soft/60 text-accent-hover/65 to-surface-secondary/50 size-10 bg-linear-to-r">
          <Icon className="size-6" />
        </KPI.Icon>
        <div className="flex min-w-0 flex-col">
          <KPI.Content>
            <KPI.Value className="text-2xl leading-none" value={stat.value} />
          </KPI.Content>
          <KPI.Header>
            <KPI.Title className="text-muted text-xs font-normal">{stat.label}</KPI.Title>
          </KPI.Header>
        </div>
      </div>
    </KPI>
  );
}
