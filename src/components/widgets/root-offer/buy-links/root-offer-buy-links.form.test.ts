import { describe, expect, it } from 'vitest';

import { EMPTY_BUY_LINK_FORM, writeBodyFrom } from './root-offer-buy-links.form';

describe('writeBodyFrom', () => {
  it('clears allowed users when the link is open to everybody', () => {
    const body = writeBodyFrom({
      ...EMPTY_BUY_LINK_FORM,
      title: 'Checkout',
      url: 'https://pay.example/x',
      isAvailableForAllUsers: true,
      allowedUserIds: ['11111111-1111-4111-8111-111111111111'],
    });

    expect(body.allowedUserIds).toEqual([]);
    expect(body.description).toBeNull();
    expect(body).not.toHaveProperty('type');
    expect(body).not.toHaveProperty('userTagIds');
    expect(body.imageUploadId).toBeNull();
  });

  it('keeps the upload id and drops a temporary preview url', () => {
    const body = writeBodyFrom({
      ...EMPTY_BUY_LINK_FORM,
      title: 'Checkout',
      url: 'https://pay.example/x',
      imageUrl: 'blob:https://localhost/preview',
      imageUploadId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    });

    expect(body.imageUploadId).toBe('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
    expect(body.imageUrl).toBeNull();
  });
});
