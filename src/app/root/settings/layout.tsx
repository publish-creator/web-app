import RootSettingsTemplate from '@/components/templates/root/root-settings';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootSettingsTemplate>{children}</RootSettingsTemplate>;
}
