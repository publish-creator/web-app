import { AppShellRoot } from '@/components/templates/root';
import { RootGuard } from '@/components/widgets/root-guard';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootGuard>
      <AppShellRoot>{children}</AppShellRoot>
    </RootGuard>
  );
}
