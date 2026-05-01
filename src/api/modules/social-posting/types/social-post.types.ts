export const SOCIAL_PLATFORMS = [
  'facebook',
  'instagram',
  'linkedin',
  'tiktok',
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const SOCIAL_POST_MODES = ['post_now', 'schedule'] as const;
export type SocialPostMode = (typeof SOCIAL_POST_MODES)[number];

export const SOCIAL_TARGET_STATUSES = [
  'queued',
  'scheduled',
  'processing',
  'posted',
  'failed',
  'cancelled',
] as const;
export type SocialTargetStatus = (typeof SOCIAL_TARGET_STATUSES)[number];
