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
