export const MFA_SECRET = 'MARK EP7K 4P2Q X8LA';

export const MFA_RECOVERY_CODES = [
  'MP-7K4P-2QX8',
  'MP-9L3M-A1B2',
  'MP-C8D4-E5F6',
  'MP-G7H8-J9K0',
  'MP-L1N2-P3Q4',
  'MP-R5S6-T7V8',
  'MP-W9X0-Y1Z2',
  'MP-A3B4-C5D6',
] as const;

export const MFA_TRIGGERS = [
  {
    description: 'Confirma que é realmente você.',
    key: 'device',
    title: 'Login em novo dispositivo',
  },
  {
    description: 'Protege a movimentação dos seus recursos.',
    key: 'transfers',
    title: 'Saques e transferências',
  },
  {
    description: 'Evita o redirecionamento indevido de pagamentos.',
    key: 'bank',
    title: 'Alteração de conta bancária',
  },
  {
    description: 'Protege configurações críticas da conta.',
    key: 'security',
    title: 'Mudanças de senha e segurança',
  },
  {
    description: 'Pode ser solicitado conforme seu perfil e permissões.',
    key: 'admin',
    title: 'Ações administrativas sensíveis',
  },
] as const;
