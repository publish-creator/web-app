import type { BuyLink } from '@/store/services/offers/offer-details.types';

export type BuyLinkAccessTag = { id: string; name: string };

export type BuyLinkAccess = {
  viaEveryone: boolean;
  viaUser: boolean;
  viaTags: BuyLinkAccessTag[];
};

export const buyLinkAccessFor = (
  link: Pick<BuyLink, 'isAvailableForAllUsers' | 'allowedUserIds' | 'userTagIds'>,
  userId: string,
  userTags: BuyLinkAccessTag[],
): BuyLinkAccess | null => {
  const viaEveryone = link.isAvailableForAllUsers;
  const viaUser = link.allowedUserIds.includes(userId);
  const viaTags = userTags.filter((tag) => (link.userTagIds ?? []).includes(tag.id));

  if (!viaEveryone && !viaUser && viaTags.length === 0) return null;

  return { viaEveryone, viaUser, viaTags };
};
