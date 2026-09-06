export type AvatarStatus = 'ready' | 'in-use';

export type AvatarItem = {
  id: string;
  image: string;
  language: string;
  name: string;
  role: string;
  status: AvatarStatus;
  videos: number;
  voiceId: string;
};

export type VoiceItem = {
  accent: string;
  age: string;
  assignedAvatar?: string;
  assignedRole?: string;
  assignedTo: string | null;
  clarity: number;
  description: string;
  duration: string;
  energy: number;
  gender: string;
  id: string;
  language: string;
  name: string;
  provider: string;
  stability: number;
  waveform: number[];
  waveTone: string;
};

export type LibraryStat = {
  id: string;
  label: string;
  value: number;
};

export const AVATAR_LIBRARY_COUNT = 8;
export const VOICE_LIBRARY_COUNT = 28;

export const AVATAR_STATS: LibraryStat[] = [
  { id: 'avatars', label: 'avatars', value: AVATAR_LIBRARY_COUNT },
  { id: 'in-use', label: 'in use', value: 3 },
  { id: 'videos', label: 'videos generated', value: 24 },
];

export const VOICE_STATS: LibraryStat[] = [
  { id: 'voices', label: 'voices', value: VOICE_LIBRARY_COUNT },
  { id: 'languages', label: 'languages', value: 6 },
  { id: 'assigned', label: 'assigned', value: 8 },
];

export const AVATAR_SORTS = [
  { id: 'recent', label: 'Recently created' },
  { id: 'name', label: 'Name A-Z' },
  { id: 'videos', label: 'Most videos' },
] as const;

export const VOICE_SORTS = [
  { id: 'relevant', label: 'Most relevant' },
  { id: 'recent', label: 'Recently added' },
  { id: 'name', label: 'Name A-Z' },
] as const;

export const VOICE_LANGUAGES = [
  { id: 'all', label: 'Language' },
  { id: 'English (US)', label: 'English (US)' },
  { id: 'English (UK)', label: 'English (UK)' },
  { id: 'Portuguese (BR)', label: 'Portuguese (BR)' },
] as const;

export const VOICE_ACCENTS = [
  { id: 'all', label: 'Accent' },
  { id: 'American', label: 'American' },
  { id: 'British', label: 'British' },
  { id: 'Brazilian', label: 'Brazilian' },
] as const;

export const AVATARS: AvatarItem[] = [
  {
    id: 'ray',
    image: 'https://i.pravatar.cc/640?img=12',
    language: 'English (US)',
    name: 'Dr. Ray Bennett',
    role: 'Trusted expert',
    status: 'in-use',
    videos: 5,
    voiceId: 'dr_ray_v1',
  },
  {
    id: 'maya',
    image: 'https://i.pravatar.cc/640?img=47',
    language: 'English (US)',
    name: 'Maya Collins',
    role: 'Lifestyle creator',
    status: 'ready',
    videos: 8,
    voiceId: 'maya_v1',
  },
  {
    id: 'liam',
    image: 'https://i.pravatar.cc/640?img=33',
    language: 'English (UK)',
    name: 'Liam Carter',
    role: 'Business coach',
    status: 'ready',
    videos: 4,
    voiceId: 'liam_v2',
  },
  {
    id: 'noah',
    image: 'https://i.pravatar.cc/640?img=15',
    language: 'English (UK)',
    name: 'Noah Ellis',
    role: 'Product host',
    status: 'ready',
    videos: 3,
    voiceId: 'noah_v1',
  },
  {
    id: 'lena',
    image: 'https://i.pravatar.cc/640?img=20',
    language: 'Portuguese (BR)',
    name: 'Lena Duarte',
    role: 'Brand presenter',
    status: 'in-use',
    videos: 6,
    voiceId: 'lena_v1',
  },
  {
    id: 'kai',
    image: 'https://i.pravatar.cc/640?img=13',
    language: 'English (US)',
    name: 'Kai Morgan',
    role: 'Tech reviewer',
    status: 'ready',
    videos: 2,
    voiceId: 'kai_v3',
  },
  {
    id: 'ava',
    image: 'https://i.pravatar.cc/640?img=32',
    language: 'English (US)',
    name: 'Ava Brooks',
    role: 'Wellness guide',
    status: 'in-use',
    videos: 7,
    voiceId: 'ava_v1',
  },
  {
    id: 'jordan',
    image: 'https://i.pravatar.cc/640?img=52',
    language: 'English (US)',
    name: 'Jordan Hale',
    role: 'Finance host',
    status: 'ready',
    videos: 1,
    voiceId: 'jordan_v1',
  },
];

export const VOICES: VoiceItem[] = [
  {
    accent: 'American',
    age: 'Middle aged',
    assignedAvatar: 'https://i.pravatar.cc/80?img=12',
    assignedRole: 'Trusted expert',
    assignedTo: 'Dr. Ray Bennett',
    clarity: 84,
    description: 'Mature & Reassuring',
    duration: '00:18',
    energy: 38,
    gender: 'Female',
    id: 'sarah',
    language: 'English (US)',
    name: 'Sarah',
    provider: 'ElevenLabs',
    stability: 72,
    waveTone: 'from-teal-300 to-cyan-500',
    waveform: [18, 34, 22, 48, 30, 62, 28, 44, 20, 54, 36, 24, 50, 18, 40, 32, 46, 22],
  },
  {
    accent: 'British',
    age: 'Young',
    assignedTo: null,
    clarity: 90,
    description: 'Clear & Energetic',
    duration: '00:16',
    energy: 74,
    gender: 'Male',
    id: 'owen',
    language: 'English (UK)',
    name: 'Owen',
    provider: 'ElevenLabs',
    stability: 64,
    waveTone: 'from-sky-300 to-indigo-500',
    waveform: [24, 16, 42, 28, 56, 22, 48, 34, 20, 44, 30, 58, 26, 38, 18, 50, 28, 36],
  },
  {
    accent: 'Brazilian',
    age: 'Young',
    assignedAvatar: 'https://i.pravatar.cc/80?img=20',
    assignedRole: 'Brand presenter',
    assignedTo: 'Lena Duarte',
    clarity: 78,
    description: 'Warm & Conversational',
    duration: '00:21',
    energy: 56,
    gender: 'Female',
    id: 'sofia',
    language: 'Portuguese (BR)',
    name: 'Sofia',
    provider: 'ElevenLabs',
    stability: 70,
    waveTone: 'from-amber-300 to-rose-400',
    waveform: [20, 46, 28, 38, 54, 24, 40, 18, 50, 32, 22, 48, 36, 16, 42, 26, 44, 30],
  },
  {
    accent: 'American',
    age: 'Middle aged',
    assignedTo: null,
    clarity: 82,
    description: 'Deep & Confident',
    duration: '00:19',
    energy: 48,
    gender: 'Male',
    id: 'marcus',
    language: 'English (US)',
    name: 'Marcus',
    provider: 'ElevenLabs',
    stability: 80,
    waveTone: 'from-emerald-300 to-teal-600',
    waveform: [30, 20, 52, 36, 24, 46, 18, 58, 28, 40, 22, 50, 34, 16, 44, 26, 38, 20],
  },
  {
    accent: 'American',
    age: 'Young',
    assignedTo: null,
    clarity: 88,
    description: 'Bright & Friendly',
    duration: '00:14',
    energy: 68,
    gender: 'Neutral',
    id: 'river',
    language: 'English (US)',
    name: 'River',
    provider: 'ElevenLabs',
    stability: 60,
    waveTone: 'from-violet-300 to-fuchsia-500',
    waveform: [22, 40, 18, 52, 34, 26, 48, 20, 44, 30, 56, 24, 38, 16, 46, 28, 36, 22],
  },
  {
    accent: 'British',
    age: 'Middle aged',
    assignedAvatar: 'https://i.pravatar.cc/80?img=47',
    assignedRole: 'Lifestyle creator',
    assignedTo: 'Maya Collins',
    clarity: 86,
    description: 'Calm & Precise',
    duration: '00:17',
    energy: 32,
    gender: 'Female',
    id: 'elena',
    language: 'English (UK)',
    name: 'Elena',
    provider: 'ElevenLabs',
    stability: 76,
    waveTone: 'from-lime-300 to-emerald-500',
    waveform: [16, 38, 26, 44, 20, 50, 32, 18, 46, 28, 40, 22, 54, 30, 24, 42, 18, 36],
  },
];
