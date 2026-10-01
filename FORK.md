# Codekunde fork — maintenance notes

This repository is an independent, hard fork of the archived
[buttercup/buttercup-browser-extension](https://github.com/buttercup/buttercup-browser-extension).
Codekunde maintains it going forward: all releases, version tags and store
listings originate from Codekunde and are **not** continuations of the upstream
project's releases.

## Privacy design principle

**No vault metadata — not just credentials, but entry domains, titles, or any
other per-entry data — is ever routed through a third-party service, even for
purely cosmetic features.** Decided 2026-09-17 while fixing entry favicons:
the original approach (`icon.buttercup.pw`, an upstream favicon-lookup proxy;
also considered a public API like Google's `s2/favicons`, and a
Codekunde-hosted replacement) would each leak the list of services a user has
stored credentials for to whoever runs that lookup. `PRIVACY_POLICY.md`
commits to "as little information as possible being handled by the
application" — that promise only means something if it also holds for small,
easy-to-justify conveniences, not just the big obvious cases like vault
storage. The planned fix (see `TODO.md`) instead fetches each favicon directly from the
entry's own domain (a party the entry already has a relationship with), and
falls back to a generic placeholder rather than a proxy when a site doesn't
serve one. Apply the same default to any future feature that could touch
per-entry data: prefer "fetch from the thing itself" or "do without" over
routing through any intermediary, self-hosted or not.

## Extension identity

| Field | Value | Where |
| --- | --- | --- |
| Display name | `Buttercup (Codekunde)` | `resources/manifest.v2.json`, `resources/manifest.v3.json` |
| Homepage | `https://github.com/codekunde/buttercup-browser-extension` | both manifests |
| Firefox add-on ID | `{245ac273-f695-41d0-836f-ffe171c92cce}` | `resources/manifest.v2.json` → `browser_specific_settings.gecko.id` |

The Firefox ID was generated fresh for this fork. There is **no upstream
Firefox/AMO listing, signing key, or add-on ID inherited from Buttercup** — the
original `{10e7d273-…}` ID belonged to the upstream project and must never be
reused here. The AMO listing is a brand-new listing under the ID above.

## Store listings

- **Firefox AMO**: **published** (submitted 2026-09-17, approved by 2026-09-20)
  at https://addons.mozilla.org/en-US/firefox/addon/buttercup-codekunde/ under
  the fork's `gecko.id`. Manifest declares
  `data_collection_permissions: {required: ["none"]}`.
- **Chrome Web Store / Edge Add-ons**: not yet submitted. New listings
  required. The upstream Chrome item (`heflipieckodmcppbnembejjmabajjjj`) is
  not ours.
- Update the README badges (still pointing at upstream store items) once the
  remaining listings exist.
- **Support/contact email**: `support@codekunde.net` (decided 2026-09-17) —
  use this for the developer account registration and as the public
  support-contact address on each store listing.

## Dependency strategy

- **buttercup-core**: consumed from `github:codekunde/buttercup-core` pinned to
  commit `a73517c85dc7b21a4fc26fcd55f5aaed902f6075` (our fork's `master` as of
  2026-09-16 - "Fixes batch 1"). No Codekunde release tag exists yet on that
  repo; re-pin to a tag once one is cut.
- **@buttercup/locust**: still consumed from the published npm release, pinned
  to exact `2.3.1`. A preservation mirror lives at
  [codekunde/locust](https://github.com/codekunde/locust). Only switch the
  dependency to the fork when we actually need to patch form detection — at
  which point the fork needs a `prepare` build script (its npm package ships
  `dist/` only) or a republish under a Codekunde npm scope.

## Toolchain

- Node 20+ required. The webpack config uses `import ... with { type: "json" }`,
  so Node 20.10+ / 22 / 24 are all fine.
- `build:*` / `dev:*` scripts use `cross-env`, so they run on Windows as well as
  macOS/Linux.
- `release:*` scripts still assume a POSIX shell (`zip`, `mv`). Run releases
  from Git Bash / WSL / CI until these are ported.
