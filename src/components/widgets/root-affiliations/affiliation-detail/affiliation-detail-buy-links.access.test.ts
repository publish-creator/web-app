import { describe, expect, it } from 'vitest';

import { buyLinkAccessFor } from './affiliation-detail-buy-links.access';

const USER = '11111111-1111-4111-8111-111111111111';
const TAG = { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'VIP' };
const OTHER = { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', name: 'Outra' };

const link = (overrides: Parameters<typeof buyLinkAccessFor>[0]) => overrides;

describe('buyLinkAccessFor', () => {
  it('hides a restricted link the affiliate does not reach', () => {
    expect(
      buyLinkAccessFor(
        link({ isAvailableForAllUsers: false, allowedUserIds: [], userTagIds: [] }),
        USER,
        [TAG],
      ),
    ).toBeNull();
  });

  it('marks access by the named affiliate', () => {
    expect(
      buyLinkAccessFor(
        link({ isAvailableForAllUsers: false, allowedUserIds: [USER], userTagIds: [] }),
        USER,
        [TAG],
      ),
    ).toEqual({ viaEveryone: false, viaUser: true, viaTags: [] });
  });

  it('marks access by the tags the affiliate carries', () => {
    expect(
      buyLinkAccessFor(
        link({ isAvailableForAllUsers: false, allowedUserIds: [], userTagIds: [TAG.id] }),
        USER,
        [TAG, OTHER],
      ),
    ).toEqual({ viaEveryone: false, viaUser: false, viaTags: [TAG] });
  });
});
