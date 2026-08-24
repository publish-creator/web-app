'use client';

import { QuerySearchField } from '@/components/composites/search-field';
import { CreativeCard } from '@/components/widgets/creative/creative-card';
import { Button, Tag, TagGroup } from '@heroui/react';
import { AddCircleIcon, CheckCircleIcon, FilterIcon, HeartIcon } from '@solar-icons/react/bold';
import { useState } from 'react';

export function CreativePage() {
  const [categories, setCategories] = useState<string[]>([]);
  const CATEGORIES = [
    { id: '1', name: 'All' },
    { id: '2', name: 'Video' },
    { id: '3', name: 'Image' },
    { id: '4', name: 'Audio' },
    { id: '5', name: '3D' },
    { id: '6', name: 'Illustration' },
    { id: '7', name: 'Typography' },
    { id: '8', name: 'Photography' },
    { id: '9', name: 'Branding' },
    { id: '10', name: 'Marketing' },
    { id: '11', name: 'Social Media' },
    { id: '12', name: 'Animation' },
  ];
  return (
    <div className="container-wrapper">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">Creative Library</p>
            <p>Browse videos that spark ideas for your next creative</p>
          </div>
          <Button aria-label="Add Creative">
            <AddCircleIcon />
            Add Creative
          </Button>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <QuerySearchField
            className=""
            onClear={function (): void {}}
            onInputChange={function (value: string): void {}}
          />
          <Button aria-label="favorite" variant="tertiary">
            <HeartIcon />
            Saved
          </Button>
          <Button aria-label="Filtros" variant="tertiary">
            <FilterIcon />
            Filters
          </Button>
        </div>
        <TagGroup
          aria-label="Tags"
          onSelectionChange={(keys) => setCategories(Array.from(keys) as string[])}
          selectedKeys={categories}
          selectionMode="multiple"
          size="lg"
          variant="surface"
        >
          <TagGroup.List>
            {CATEGORIES.map((category) => (
              <Tag
                className="data-[selected=true]:bg-surface-secondary data-[selected=true]:text-foreground"
                id={category.id}
                key={category.id}
              >
                {category.name}
                {categories.includes(category.id) && <CheckCircleIcon size="16px" />}
              </Tag>
            ))}
          </TagGroup.List>
        </TagGroup>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <CreativeCard key={index} />
        ))}
      </div>
    </div>
  );
}
