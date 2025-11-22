export const flags = {
  "chat.enabled": true,
  "billing.enabled": false,
} as const;

export type FeatureFlag = keyof typeof flags;

export function getFeatureFlags() {
  return flags;
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return flags[flag];
}
