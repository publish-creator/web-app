import { Tag, TagGroup } from '@heroui/react';
import { CheckCircleIcon } from '@solar-icons/react/bold';
import { useState } from 'react';

export const CreativeCategory = () => {
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
  );
};
