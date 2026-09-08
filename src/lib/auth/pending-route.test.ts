import { describe, expect, it } from 'vitest';

import { HOME_ROUTE, PENDING_ROUTE, nextRouteFor } from './pending-route';

describe('nextRouteFor', () => {
  it('sends someone with nothing owed home', () => {
    expect(nextRouteFor({ pending: [] })).toBe(HOME_ROUTE);
  });

  it('answers the first owed step, not the last', () => {
    expect(nextRouteFor({ pending: ['ENABLE_MFA', 'ACCEPT_TERMS'] })).toBe(
      PENDING_ROUTE.ENABLE_MFA,
    );
  });

  it('has a route for every step it claims to handle', () => {
    for (const route of Object.values(PENDING_ROUTE)) {
      expect(route).toMatch(/^\//);
    }
  });
});
