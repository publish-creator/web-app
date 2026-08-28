'use client';

import { Description, Label, TextArea } from '@heroui/react';
import React from 'react';

interface TextAreaFieldProps {
  label: string;
  placeholder: string;
  maxLength?: number;
  description?: string;
  id: string;
  rows?: number;
  variant?: 'primary' | 'secondary';
}

export function TextAreaField({
  label,
  placeholder,
  maxLength,
  description,
  id,
  rows = 4,
  variant,
}: TextAreaFieldProps) {
  const [value, setValue] = React.useState('');

  return (
    <div className="flex flex-col gap-2">
      {(label || description) && (
        <div>
          {label && <Label htmlFor={id}>{label}</Label>}
          {description && <Description id={`${id}-description`}>{description}</Description>}
        </div>
      )}
      <TextArea
        aria-describedby={`${id}-description`}
        aria-label={label}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
        variant={variant}
      />
      {maxLength && (
        <Description id={`${id}-description`}>
          Characters: {value.length} / {maxLength}
        </Description>
      )}
    </div>
  );
}
