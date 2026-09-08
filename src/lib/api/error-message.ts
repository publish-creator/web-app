/**
 * The API answers every failure the same way: `{ codeIntern, message }`, already translated to the
 * language the request asked for. This pulls that message out, and falls back to something readable
 * when the failure never reached the API at all — a dropped connection has no body.
 */

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

  /** RTK Query's own shapes for "never got an answer" and "the answer was not JSON". */
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
