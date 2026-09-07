import { Pencil } from '@gravity-ui/icons';
import { Button, Surface } from '@heroui/react';

interface AuthSignUpChangeDestinationProps {
  value: string;
  actionLabel: string;
  hint: string;
  onEdit: () => void;
}

export function AuthSignUpChangeDestination({
  value,
  actionLabel,
  hint,
  onEdit,
}: AuthSignUpChangeDestinationProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Surface className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5" variant="secondary">
        <span className="min-w-0 truncate text-sm font-medium">{value}</span>
        <Button className="shrink-0" onPress={onEdit} size="sm" variant="tertiary">
          <Pencil className="size-3.5" />
          {actionLabel}
        </Button>
      </Surface>
      <p className="text-muted text-center text-xs leading-relaxed">{hint}</p>
    </div>
  );
}
