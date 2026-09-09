export const RECOVERY_FILE_NAME = 'bepost-codigos-de-recuperacao.txt';

export function recoveryCodesFile(codes: string[], generatedAt: Date): string {
  const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
    generatedAt,
  );

  return [
    'Bepost - códigos de recuperação',
    `Gerados em ${date}`,
    '',
    'Cada código funciona uma única vez e substitui o aplicativo autenticador',
    'para entrar na sua conta. Guarde este arquivo em um local seguro.',
    'Não é possível exibi-los de novo.',
    '',
    ...codes,
    '',
  ].join('\n');
}
