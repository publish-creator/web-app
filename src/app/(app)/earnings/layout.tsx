import { EarningsTemplate } from '@/components/templates/earnings';

export default function EarningsLayout({ children }: { children: React.ReactNode }) {
  return <EarningsTemplate>{children}</EarningsTemplate>;
}
