const SSO_FIELD_NAME = "sso";

/**
 * Detect a "this entry signs in via a third-party account" convention on an
 * entry's properties: a custom field named "SSO" (case-insensitive). Its
 * value, if any, names the provider (e.g. "Google", "GitHub") and is shown
 * as-is; an empty value just flags the entry as SSO generically. Lets an
 * entry with no stored password (because it was created via Google/GitHub/
 * Facebook/etc.) be flagged using Buttercup desktop's existing Custom Fields
 * feature, without needing any vault-schema changes.
 * @param properties The entry's properties (built-in and custom fields,
 *  keyed by field name - this is how Buttercup already exposes both)
 * @returns null if no "SSO" custom field is present, "" if present but
 *  empty (provider not specified), or its value otherwise
 */
export function getSSOProviderFromProperties(properties: Record<string, string> = {}): string | null {
    for (const key of Object.keys(properties)) {
        if (key.trim().toLowerCase() === SSO_FIELD_NAME) {
            return (properties[key] ?? "").trim();
        }
    }
    return null;
}

export function capitaliseSSOProvider(provider: string): string {
    return provider.length > 0 ? `${provider.charAt(0).toUpperCase()}${provider.slice(1)}` : provider;
}
