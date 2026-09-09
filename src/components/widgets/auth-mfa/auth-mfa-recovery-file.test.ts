import { describe, expect, it } from 'vitest';

import { RECOVERY_FILE_NAME, recoveryCodesFile } from './auth-mfa-recovery-file';

const CODES = ['AAAA-1111', 'BBBB-2222'];
const AT = new Date('2026-09-09T15:30:00.000Z');

describe('recoveryCodesFile', () => {
  it('carries every code, one per line', () => {
    const lines = recoveryCodesFile(CODES, AT).split('\n');

    for (const code of CODES) expect(lines).toContain(code);
  });

  it('says what the file is, so it still makes sense found on a disk months later', () => {
    const content = recoveryCodesFile(CODES, AT);

    expect(content).toContain('uma única vez');
    expect(content).toContain('Não é possível exibi-los de novo.');
  });

  it('dates the file, so two downloads can be told apart', () => {
    expect(recoveryCodesFile(CODES, AT)).toContain('09/09/2026');
  });

  it('ends with a newline, which is what a text file is supposed to do', () => {
    expect(recoveryCodesFile(CODES, AT).endsWith('\n')).toBe(true);
  });

  it('writes nothing but the header when there are no codes', () => {
    const content = recoveryCodesFile([], AT);

    expect(content).toContain('Bepost - códigos de recuperação');
    expect(content).not.toContain('AAAA-1111');
  });
});

describe('RECOVERY_FILE_NAME', () => {
  it('is a .txt with no character a filesystem would refuse', () => {
    expect(RECOVERY_FILE_NAME).toMatch(/^[a-z0-9-]+\.txt$/);
  });
});
