export function itemIsIgnored(element: HTMLElement): boolean {
    return element.matches("[data-bcupignore=true] *, [data-bcupignore=true]");
}

// Rich-text editor chrome we should never inject into (buttercup-browser-extension#304).
// Confirmed via a synthetic repro: attachLaunchButton mounts to input.offsetParent, which
// for a field inside one of these containers is a live, framework-managed DOM node (eg. a
// Gutenberg popover) - inserting our own button there is an unexpected extra child the next
// time that component re-renders, which can throw (a real "Failed to execute 'removeChild'
// on 'Node'"-class crash) or just get silently discarded. Scoped to the actual editing
// surface and its floating toolbars/popovers only - deliberately NOT the whole wp-admin
// post-edit screen or its sidebar meta boxes, since those can hold fields Buttercup should
// still be able to fill (eg. a plugin's own API-key input, or the user-profile password page).
const KNOWN_EDITOR_SELECTORS = [
    // Gutenberg (WordPress block editor)
    ".block-editor-writing-flow",
    ".editor-styles-wrapper",
    ".edit-post-visual-editor",
    ".block-editor__container",
    ".components-popover",
    // Classic Editor / TinyMCE toolbar chrome (not the <textarea>/iframe body
    // itself - Locust never targets those, they're not <input> elements)
    ".mce-container",
    ".mce-toolbar-grp",
    ".wp-editor-tools",
    ".quicktags-toolbar"
].join(", ");

export function isWithinKnownEditor(element: HTMLElement): boolean {
    return typeof element.closest === "function" && element.closest(KNOWN_EDITOR_SELECTORS) !== null;
}
