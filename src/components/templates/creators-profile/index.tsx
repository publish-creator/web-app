import { CreatorsProfileHeader } from './creators-profile-header';

interface CreatorsProfileTemplateProps {
  children: React.ReactNode;
}

export function CreatorsProfileTemplate({ children }: CreatorsProfileTemplateProps) {
  return (
    <div className="container-wrapper flex flex-col gap-4">
      <CreatorsProfileHeader />
      {children}
    </div>
  );
}
