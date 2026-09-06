'use client';

import { Moon, Sun } from '@gravity-ui/icons';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { IconButton } from '@/components/base/icon-button';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div aria-hidden className="size-8" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <IconButton
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
      label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      size="sm"
      variant="tertiary"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </IconButton>
  );
}
