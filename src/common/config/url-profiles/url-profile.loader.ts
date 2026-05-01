import { urlProfileDev } from '@/common/config/url-profiles/url.profile.dev';
import { urlProfileTest } from '@/common/config/url-profiles/url.profile.test';

export type UrlProfileName = 'dev' | 'testing';

export const MIGRATED_KEYS = [
  'PUBLIC_API_URL',
  'PUBLIC_PORTAL_URL',
  'PUBLIC_DOCS_URL',
];

const PROFILE_MAP: Record<UrlProfileName, Record<string, string>> = {
  dev: urlProfileDev,
  testing: urlProfileTest,
};

export function getSelectedProfileName(): UrlProfileName {
  const configured = process.env.CONFIG_PROFILE?.trim();
  if (!configured) {
    return 'dev';
  }

  if (configured === 'dev') {
    return 'dev';
  }

  if (configured === 'testing' || configured === 'test') {
    return 'testing';
  }

  throw new Error(
    `Invalid CONFIG_PROFILE "${configured}". Allowed values: dev, testing, test.`,
  );
}

export function loadUrlProfileIntoEnv(): void {
  const profile = getSelectedProfileName();
  const profileValues = PROFILE_MAP[profile];

  for (const key of MIGRATED_KEYS) {
    const value = profileValues[key];
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(
        `URL profile "${profile}" is missing migrated key "${key}" or it is empty.`,
      );
    }
    // Profile-injected public values intentionally override .env values.
    process.env[key] = value;
  }
}
