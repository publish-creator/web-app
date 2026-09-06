'use client';

import { AuthSignUpContent } from '@/components/widgets/auth-sign-up';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setStepSignUp, signUpSelectors } from '@/store/slices/sign-up';
import { Button } from '@heroui/react';

export default function SignUpPage() {
  const { step } = useAppSelector(signUpSelectors.selectSignUp);
  const dispatch = useAppDispatch();
  const toggleStep = (step: number) => {
    dispatch(setStepSignUp(step));
  };
  return (
    <div>
      <AuthSignUpContent />
      <div>
        <Button onClick={() => toggleStep(step - 1)}>Previous</Button>
        <Button onClick={() => toggleStep(step + 1)}>Next</Button>
      </div>
    </div>
  );
}
