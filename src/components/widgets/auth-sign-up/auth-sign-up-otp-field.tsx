import { ErrorMessage, InputOTP } from '@heroui/react';

import { OTP_LENGTH } from './auth-sign-up.constants';

interface AuthSignUpOtpFieldProps {
  value: string;
  errorMessage?: string | undefined;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}

export function AuthSignUpOtpField({
  value,
  errorMessage,
  onChange,
  onComplete,
}: AuthSignUpOtpFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <InputOTP
        aria-label="Código de verificação"
        className="w-full"
        maxLength={OTP_LENGTH}
        onChange={(nextValue) => {
          onChange(nextValue);

          if (nextValue.length === OTP_LENGTH) {
            onComplete?.(nextValue);
          }
        }}
        value={value}
        variant="secondary"
      >
        <InputOTP.Group className="w-full justify-between">
          {Array.from({ length: OTP_LENGTH }, (_, index) => (
            <InputOTP.Slot className="size-14 md:size-16" index={index} key={index} />
          ))}
        </InputOTP.Group>
      </InputOTP>
      {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
    </div>
  );
}
