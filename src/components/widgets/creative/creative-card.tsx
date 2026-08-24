import { Chip } from '@heroui/react';

export function CreativeCard() {
  return (
    <div className="hover:bg-surface-hover group flex cursor-pointer flex-col rounded-2xl p-1 transition-colors duration-200">
      <div className="bg-surface aspect-3/4 rounded-2xl" />
      <div className="px-2">
        <p className="group-hover:text-primary text-sm font-semibold">Nome</p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((item, index) => (
            <Chip
              className="bg-surface-secondary text-muted group-hover:bg-surface"
              color="default"
              key={index}
            >
              Tag {index + 1}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
