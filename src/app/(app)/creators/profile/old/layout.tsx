import { CreatorsProfileTemplate } from '@/components/templates/creators-profile';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CreatorsProfileTemplate>{children}</CreatorsProfileTemplate>;
}
