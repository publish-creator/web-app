import { useAppSelector } from '@/store/hooks';
import { signUpSelectors } from '@/store/slices/sign-up';

export function AuthSignUpContent() {
  const { step } = useAppSelector(signUpSelectors.selectSignUp);
  return (
    <div>
      <div>Step {step}</div>
    </div>
  );
}
