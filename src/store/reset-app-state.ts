import { resetStateAction } from './root-reducer';
import { api } from './services/api/base-api';

export function resetAppState(dispatch: (action: unknown) => unknown): void {
  dispatch(api.util.resetApiState());
  dispatch(resetStateAction());
}
