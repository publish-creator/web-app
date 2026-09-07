'use client';

import { Button, Dropdown, Label } from '@heroui/react';
import { useMemo } from 'react';

import { getCircleFlagUrl, PHONE_DIAL_CODES } from './auth-sign-up.constants';

import type { Selection } from '@heroui/react';

interface AuthSignUpDialSelectProps {
  value: string;
  onChange: (countryCode: string) => void;
}

export function AuthSignUpDialSelect({ value, onChange }: AuthSignUpDialSelectProps) {
  const selected = useMemo(
    () => PHONE_DIAL_CODES.find((option) => option.code === value) ?? PHONE_DIAL_CODES[0],
    [value],
  );

  return (
    <Dropdown>
      <Button
        aria-label={`DDI ${selected.dialCode}`}
        className="h-full min-w-[108px] rounded-none px-3"
        variant="ghost"
      >
        <img
          alt=""
          className="size-5 rounded-full"
          height={20}
          src={getCircleFlagUrl(selected.code)}
          width={20}
        />
        <span className="text-sm font-medium">{selected.dialCode}</span>
      </Button>
      <Dropdown.Popover placement="bottom start">
        <Dropdown.Menu
          selectedKeys={new Set([selected.code])}
          selectionMode="single"
          onSelectionChange={(keys: Selection) => {
            if (keys === 'all') {
              return;
            }

            const nextCode = [...keys][0];

            if (typeof nextCode === 'string') {
              onChange(nextCode);
            }
          }}
        >
          {PHONE_DIAL_CODES.map((option) => (
            <Dropdown.Item id={option.code} key={option.code} textValue={option.name}>
              <img
                alt=""
                className="size-5 rounded-full"
                height={20}
                src={getCircleFlagUrl(option.code)}
                width={20}
              />
              <Label>
                {option.name} {option.dialCode}
              </Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
