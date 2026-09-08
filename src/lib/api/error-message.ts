const FALLBACK = 'Não foi possível concluir. Tente novamente.';

type ApiErrorBody = { codeIntern?: string; message?: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export function messageFromError(error: unknown): string {
  if (!isRecord(error)) return FALLBACK;

  const { data, status } = error as { data?: unknown; status?: unknown };

  if (isRecord(data)) {
    const { message } = data as ApiErrorBody;

    if (typeof message === 'string' && message.length > 0) return message;
  }

  if (status === 'FETCH_ERROR') return 'Sem conexão com o servidor. Verifique sua internet.';
  if (status === 'PARSING_ERROR' || status === 'CUSTOM_ERROR') return FALLBACK;

  return FALLBACK;
}

export function codeFromError(error: unknown): string | null {
  if (!isRecord(error)) return null;

  const { data } = error as { data?: unknown };

  if (!isRecord(data)) return null;

  const { codeIntern } = data as ApiErrorBody;

  return typeof codeIntern === 'string' ? codeIntern : null;
}
