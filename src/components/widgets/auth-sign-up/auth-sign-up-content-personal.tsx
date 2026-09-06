'use client';

import { TextField } from '@/components/composites';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@heroui/react';
import { BuildingsIcon, UserIcon } from '@solar-icons/react/bold';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { useAuthSignUp } from './auth-sign-up-context';
import { AuthSignUpSelectableOption } from './auth-sign-up-selectable-option';
import { signUpPersonalSchema } from './auth-sign-up.schemas';

import type { SignUpBusinessType, SignUpPersonalInput } from './auth-sign-up.schemas';
import type { ReactNode } from 'react';

const OPTIONS = [
  {
    icon: <UserIcon size={22} />,
    label: 'Não, minha empresa não está registrada.',
    value: 'INDIVIDUAL',
  },
  {
    icon: <BuildingsIcon size={22} />,
    label: 'Sim, sou proprietário ou representante legal da empresa registrada.',
    value: 'COMPANY',
  },
] as const satisfies ReadonlyArray<{
  icon: ReactNode;
  label: string;
  value: SignUpBusinessType;
}>;

export function AuthSignUpContentPersonal() {
  const { goToStep } = useAuthSignUp();
  const form = useForm<SignUpPersonalInput>({
    resolver: zodResolver(signUpPersonalSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      businessName: '',
    },
  });
  const businessType = useWatch({ control: form.control, name: 'businessType' });

  const onSubmit = (values: SignUpPersonalInput) => {
    goToStep(4, {
      businessType: values.businessType,
      firstName: values.firstName,
      lastName: values.lastName,
      businessName: values.businessName,
    });
  };

  return (
    <form className="flex w-full flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Conte-nos sobre o seu negócio</h1>
        <p className="text-muted text-sm leading-relaxed">
          Sua empresa está registrada em algum órgão governamental ou está sujeita a auditoria?
        </p>
      </div>

      <Controller
        control={form.control}
        name="businessType"
        render={({ field }) => (
          <div className="flex flex-col gap-4" role="radiogroup">
            {OPTIONS.map((option) => (
              <AuthSignUpSelectableOption
                icon={option.icon}
                isSelected={field.value === option.value}
                key={option.value}
                label={option.label}
                onSelect={() => {
                  field.onChange(option.value);
                  form.setValue('firstName', '');
                  form.setValue('lastName', '');
                  form.setValue('businessName', '');
                  form.clearErrors();
                }}
              />
            ))}
          </div>
        )}
      />

      {businessType === 'INDIVIDUAL' ? (
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm font-medium">Qual é o seu nome?</p>
          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                aria-label="Nome"
                errorMessage={fieldState.error?.message}
                placeholder="Nome"
                variant="secondary"
              />
            )}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                aria-label="Sobrenome"
                errorMessage={fieldState.error?.message}
                placeholder="Sobrenome"
                variant="secondary"
              />
            )}
          />
        </div>
      ) : null}

      {businessType === 'COMPANY' ? (
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm font-medium">Qual é o nome da sua empresa?</p>
          <Controller
            control={form.control}
            name="businessName"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                aria-label="Nome da empresa"
                errorMessage={fieldState.error?.message}
                placeholder="Nome da empresa"
                variant="secondary"
              />
            )}
          />
        </div>
      ) : null}

      <Button fullWidth isDisabled={!businessType} size="lg" type="submit">
        Avançar
      </Button>
    </form>
  );
}
