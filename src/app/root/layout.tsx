import { AppShellRoot } from '@/components/templates/root';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppShellRoot>{children}</AppShellRoot>;
}
