export function formatURL(base: string): string {
    if (/^\d+\.\d+\.\d+\.\d+/.test(base)) {
        return `http://${base}`;
    } else if (/^https?:\/\//i.test(base) === false) {
        return `https://${base}`;
    }
    return base;
}

const HOST_AND_PATH = /^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?([/?#]\S*)?$/i;

/**
 * Get a URL that is safe to open in a new tab from an entry property: an
 * http(s) address, or, for a property named like a URL, an address saved
 * without its scheme ("example.com/login"). Anything else (other schemes
 * such as javascript: or file:, or plain text) gives null.
 * @param property The property name
 * @param value The property value
 */
export function getOpenableURL(property: string, value: string): string | null {
    const trimmed = `${value ?? ""}`.trim();
    if (!trimmed || /\s/.test(trimmed)) return null;
    let candidate: string | null = null;
    if (/^https?:\/\//i.test(trimmed)) {
        candidate = trimmed;
    } else if (/url/i.test(property) && HOST_AND_PATH.test(trimmed)) {
        candidate = formatURL(trimmed);
    }
    if (!candidate) return null;
    try {
        const url = new URL(candidate);
        return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
    } catch (err) {
        return null;
    }
}
