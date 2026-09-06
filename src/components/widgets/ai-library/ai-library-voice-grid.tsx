'use client';

import { useMemo, useState } from 'react';

import { AiLibraryToolbar, LibrarySelect } from './ai-library-toolbar';
import { AiLibraryVoiceCard } from './ai-library-voice-card';
import { AiLibraryVoicePreview } from './ai-library-voice-preview';
import { VOICE_ACCENTS, VOICE_LANGUAGES, VOICE_SORTS, VOICES } from './ai-library.constants';

import type { VoiceItem } from './ai-library.constants';

type VoiceFilter = 'all' | 'Female' | 'Male' | 'Neutral';
type VoiceSort = (typeof VOICE_SORTS)[number]['id'];

const VOICE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'Female', label: 'Female' },
  { id: 'Male', label: 'Male' },
  { id: 'Neutral', label: 'Neutral' },
];

function sortVoices(voices: VoiceItem[], sort: VoiceSort) {
  if (sort === 'name') {
    return [...voices].sort((left, right) => left.name.localeCompare(right.name));
  }

  return voices;
}

export function AiLibraryVoiceGrid() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<VoiceFilter>('all');
  const [sort, setSort] = useState<VoiceSort>('relevant');
  const [language, setLanguage] = useState('all');
  const [accent, setAccent] = useState('all');
  const [selectedId, setSelectedId] = useState(VOICES[0]?.id ?? '');

  const voices = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = VOICES.filter((voice) => {
      const matchesFilter = filter === 'all' || voice.gender === filter;
      const matchesLanguage = language === 'all' || voice.language === language;
      const matchesAccent = accent === 'all' || voice.accent === accent;
      const matchesQuery =
        normalized.length === 0 ||
        voice.name.toLowerCase().includes(normalized) ||
        voice.description.toLowerCase().includes(normalized);

      return matchesFilter && matchesLanguage && matchesAccent && matchesQuery;
    });

    return sortVoices(filtered, sort);
  }, [accent, filter, language, query, sort]);

  const selectedVoice = voices.find((voice) => voice.id === selectedId) ?? voices[0] ?? VOICES[0];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-4">
        <AiLibraryToolbar
          extra={
            <>
              <LibrarySelect
                ariaLabel="Language"
                onChange={setLanguage}
                options={VOICE_LANGUAGES}
                value={language}
              />
              <LibrarySelect
                ariaLabel="Accent"
                onChange={setAccent}
                options={VOICE_ACCENTS}
                value={accent}
              />
            </>
          }
          filter={filter}
          filters={VOICE_FILTERS}
          onFilterChange={(id) => setFilter(id as VoiceFilter)}
          onQueryChange={setQuery}
          onSortChange={(id) => setSort(id as VoiceSort)}
          placeholder="Search voices"
          query={query}
          sort={sort}
          sorts={[...VOICE_SORTS]}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {voices.map((voice) => (
            <AiLibraryVoiceCard
              isSelected={selectedId === voice.id}
              key={voice.id}
              onSelect={setSelectedId}
              voice={voice}
            />
          ))}
        </div>
      </div>

      {selectedVoice ? (
        <AiLibraryVoicePreview
          onUse={() => setSelectedId(selectedVoice.id)}
          voice={selectedVoice}
        />
      ) : null}
    </div>
  );
}
