import { AiLibraryHeader } from './ai-library-header';

export function AiLibraryTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-wrapper flex flex-col gap-4">
      <AiLibraryHeader />
      {children}
    </div>
  );
}
