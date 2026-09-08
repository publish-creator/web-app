import type { ReactNode } from 'react';

import { Surface } from '@heroui/react';

interface AuthSignUpSelectableOptionProps {
  icon: ReactNode;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
}

export function AuthSignUpSelectableOption({
  icon,
  isSelected,
  label,
  onSelect,
}: AuthSignUpSelectableOptionProps) {
  return (
    <button
      aria-checked={isSelected}
      className="w-full text-left"
      onClick={onSelect}
      role="radio"
      type="button"
    >
      <Surface
        className={`flex min-h-20 w-full items-center gap-4 rounded-2xl p-4 transition-colors ${
          isSelected ? 'border-accent/40 bg-accent/5' : 'hover:bg-surface-secondary'
        }`}
        variant={isSelected ? 'secondary' : 'default'}
      >
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
            isSelected ? 'bg-accent/15 text-accent' : 'bg-surface-secondary text-muted'
          }`}
        >
          {icon}
        </span>
        <span className="text-sm leading-relaxed">{label}</span>
      </Surface>
    </button>
  );
}
