export const SOCIAL_POST_QUEUE = 'social-posting';
export const SOCIAL_POST_JOB = 'publish-social-target';

export type SocialPostJobPayload = {
  targetId: number;
  userId: number;
  propertyId: number;
};
