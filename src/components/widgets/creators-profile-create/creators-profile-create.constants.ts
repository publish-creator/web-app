export const COLOR_PRESETS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#0086C9',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#1d2939',
  '#f5fbff',
] as const;

export const DEFAULT_PALETTES = [
  {
    id: 'ocean',
    name: 'Ocean',
    brand: '#0086C9',
    background: '#F5FBFF',
    text: '#1D2939',
  },
  {
    id: 'forest',
    name: 'Forest',
    brand: '#067647',
    background: '#F6FEF9',
    text: '#0D1B12',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    brand: '#E04F16',
    background: '#FFF6ED',
    text: '#1C1917',
  },
  {
    id: 'violet',
    name: 'Violet',
    brand: '#7F56D9',
    background: '#F9F5FF',
    text: '#1D1529',
  },
  {
    id: 'mono',
    name: 'Mono',
    brand: '#111827',
    background: '#F9FAFB',
    text: '#111827',
  },
  {
    id: 'rose',
    name: 'Rose',
    brand: '#E11D48',
    background: '#FFF1F2',
    text: '#1F1315',
  },
] as const;

export const FONT_OPTIONS = [
  { id: 'inter', label: 'Padrão (Inter)' },
  { id: 'geist', label: 'Geist' },
  { id: 'georgia', label: 'Georgia' },
  { id: 'playfair', label: 'Playfair Display' },
  { id: 'space-grotesk', label: 'Space Grotesk' },
] as const;

export const TEXTURE_OPTIONS = [
  { id: 'mesh-gradient', label: 'Padrão (mesh-gradient)' },
  { id: 'none', label: 'Sem textura' },
  { id: 'noise', label: 'Noise' },
  { id: 'dots', label: 'Dots' },
  { id: 'grid', label: 'Grid' },
] as const;

export const CREATE_PROFILE_STEP_IDS = {
  identity: 'informacoes-basicas',
  style: 'estilo',
  advanced: 'configuracoes-avancadas',
} as const;

export const EXPAND_ADVANCED_EVENT = 'creators-profile:expand-advanced';

export const CREATE_PROFILE_STEPS = [
  {
    id: CREATE_PROFILE_STEP_IDS.identity,
    title: 'Informações básicas',
    description: 'Nome, descrição e público',
  },
  {
    id: CREATE_PROFILE_STEP_IDS.style,
    title: 'Estilo',
    description: 'Cores, logo e identidade visual',
  },
  {
    id: CREATE_PROFILE_STEP_IDS.advanced,
    title: 'Configurações avançadas',
    description: 'Fonte, textura, layout e extras',
  },
] as const;

export const LAYOUT_OPTIONS = [
  { id: 'all', label: 'Todos do estilo (padrão)' },
  { id: 'quote', label: 'Quote' },
  { id: 'split', label: 'Split' },
  { id: 'cover', label: 'Cover' },
  { id: 'list', label: 'List' },
] as const;
