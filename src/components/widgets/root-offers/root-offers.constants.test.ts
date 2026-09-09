import { describe, expect, it } from 'vitest';

import { STATUS_LABEL, STATUS_TABS, STATUS_TONE, statusParam } from './root-offers.constants';

describe('statusParam', () => {
  it('turns a real status into the query the API accepts', () => {
    expect(statusParam('DRAFT')).toBe('DRAFT');
    expect(statusParam('PUBLISHED')).toBe('PUBLISHED');
    expect(statusParam('INACTIVE')).toBe('INACTIVE');
  });

  it('answers undefined for the all tab, so no status is sent at all', () => {
    expect(statusParam('all')).toBeUndefined();
  });

  it('answers undefined for anything the URL might carry, instead of forwarding it', () => {
    for (const junk of ['', 'draft', 'QUALQUER', '../DRAFT', undefined]) {
      expect(statusParam(junk)).toBeUndefined();
    }
  });
});

describe('the status vocabulary', () => {
  it('labels every status the API can answer, so none renders raw', () => {
    for (const status of ['DRAFT', 'PUBLISHED', 'INACTIVE'] as const) {
      expect(STATUS_LABEL[status]).toBeTruthy();
      expect(STATUS_TONE[status]).toBeTruthy();
    }
  });

  it('offers a tab for every status, plus the all tab', () => {
    expect(STATUS_TABS.map((tab) => tab.id)).toEqual(['all', 'DRAFT', 'PUBLISHED', 'INACTIVE']);
  });
});
