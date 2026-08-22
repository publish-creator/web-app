'use client';

import { Toast } from '@heroui/react';

import SessionProvider from './session-provider';
import StoreProvider from './store-provider';
import ThemeProvider from './theme-provider';
import { SolarProvider } from '@solar-icons/react'

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <SessionProvider>
        <SolarProvider size={32} strokeWidth={1.5}>

          {children}
        </SolarProvider>
          <Toast.Provider placement="bottom" />
        </SessionProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default AppProviders;
