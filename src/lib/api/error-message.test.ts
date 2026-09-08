import { describe, expect, it } from 'vitest';

import { codeFromError, messageFromError } from './error-message';

describe('messageFromError', () => {
  it('uses the message the API sent, already translated', () => {
    const error = { status: 400, data: { codeIntern: 'ATH_0012', message: 'Código inválido.' } };

    expect(messageFromError(error)).toBe('Código inválido.');
  });

  it('says the connection failed when the request never arrived', () => {
    expect(messageFromError({ status: 'FETCH_ERROR', error: 'TypeError' })).toContain('conexão');
  });

  // Anything unrecognised still has to render something. A blank error message reads as success.
  it('never answers an empty string', () => {
    for (const value of [
      null,
      undefined,
      'boom',
      42,
      {},
      { data: {} },
      { data: { message: '' } },
    ]) {
      expect(messageFromError(value).length).toBeGreaterThan(0);
    }
  });
});

describe('codeFromError', () => {
  it('hands back the internal code when there is one', () => {
    expect(codeFromError({ data: { codeIntern: 'ATH_0012' } })).toBe('ATH_0012');
  });

  it('answers null rather than inventing one', () => {
    expect(codeFromError({ status: 'FETCH_ERROR' })).toBeNull();
    expect(codeFromError(undefined)).toBeNull();
  });
});
