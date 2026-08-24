import { CreativeCard } from './creative-card';

export const CreativeList = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <CreativeCard key={index} />
      ))}
    </div>
  );
};
