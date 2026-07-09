# Passing Lane Marketing Site — Claude Code Reference

This file is the authoritative reference for Claude Code sessions on the marketing site repo.
Read it in full before making any changes.

---

## Session Rule — Confirm Before Every Change

Before making any change in a session — including edits to HTML, CSS, new files, `_redirects`
rules, `_headers`, commits, or shell commands — stop and describe exactly what you are about to
do and why. Wait for explicit confirmation from Josh before proceeding. Do not assume a general
instruction is permission to execute. Show the plan first, get a yes, then act.

This applies to every change, every time, without exception.

---

## Project Overview

**Site:** passinglane.app — marketing and conversion site for the Passing Lane iOS app.
**Entity:** Passing Lane Solutions LLC (California single-member LLC)
**Founder:** Joshua (solo)
**Status:** Live. Post-launch phase — adding app screenshots, refining content, supporting affiliates.

**Purpose of this site:**
- Convert visitors to App Store downloads
- Support EN/ES bilingual audience (California teens + Spanish-speaking parents)
- Host affiliate landing pages for partner traffic
- Serve the /faq route linked from inside the app
- Host the /auth/reset-password handoff page for password reset deep links

---

## Repository

**Local path:** `/Users/joshua/Development/passinglane-site`
**GitHub:** `jrccsi/passinglane-site`
**Hosting:** Cloudflare Pages (auto-deploys on push to main)
**Domains:** `passinglane.app`, `passinglaneapp.com`
**DNS / CDN:** Cloudflare

The app repo is separate: `/Users/joshua/Development/PassingLane` (GitHub: `jrccsi/PassingLane`)

---

## File Structure

```
/
  index.html              ← Main landing page (English)
  icon.png                ← App icon used across all pages
  _redirects              ← Cloudflare Pages redirect rules
  _headers                ← Security headers (applied to all routes)
  privacy.html            ← Privacy policy
  terms.html              ← Terms of service
  drivers-ed.html         ← Affiliate page (DriversEd.com)
  insurance.html          ← Affiliate placeholder
  driving-school-guide.html ← Legacy filename, redirected to /driving-school

  faq/
    index.html            ← FAQ page (serves at /faq)

  driving-school/
    index.html            ← Driving school affiliate page (serves at /driving-school)

  auth/
    reset-password/
      index.html          ← Password reset handoff — bridges web → passinglane:// deep link

  es/
    index.html            ← Full Spanish landing page (serves at /es)
    privacy.html
    terms.html
    faq/
      index.html
    drivers-ed/
      index.html
    driving-school/
      index.html
    insurance/
      index.html
```

---

## Cloudflare Pages — Critical Routing Rules

These are non-obvious behaviors that have caused real problems. Read carefully before adding
any new pages or routes.

### Rule 1 — Short unhyphenated paths need the folder/index.html pattern

Paths like `/faq`, `/driving-school`, `/insurance` must be structured as `folder/index.html`,
not as `faq.html` at the root.

Cloudflare fires its own 308 redirect on short unhyphenated paths before `_redirects` rules
are evaluated. This creates redirect loops when a flat `.html` file is used.

**Correct pattern:**
```
faq/index.html            → serves at /faq  ✅
```

**Wrong pattern:**
```
faq.html                  → causes redirect loop  ❌
```

Paths with hyphens (e.g. `/drivers-ed`) do not have this problem and can use flat `.html` files.

### Rule 2 — host redirects belong in Cloudflare dashboard rules

Cloudflare Pages `_redirects` does not support host-level redirects such as
`passinglaneapp.com/* → passinglane.app/:splat`. Use Cloudflare Redirect Rules or Bulk Redirects
for apex, www, and alternate-domain canonicalization. If an alternate hostname should serve the
Pages project directly before redirecting, add it as a custom domain inside Cloudflare Pages first.

### Rule 3 — Renaming a file does not remove it from deployment

If you rename `faq.html` to `faq/index.html` and push, the old `faq.html` continues to be served
from Cloudflare's deployment cache. It does not disappear automatically. You must add a `_redirects`
rule to forward the old path to the new one.

Example entry in `_redirects`:
```
/faq-page /faq 301
```

### Rule 4 — Propagation takes ~30 seconds

After pushing to GitHub, wait 30 seconds before checking the live site. Do not assume a change
did not deploy if it isn't immediately visible.

### Rule 5 — _redirects file has no header row and uses plain text format

```
/old-path /new-path 301
```

One rule per line. No comments inside active rules. 301 for permanent, 302 for temporary.

---

## Current _redirects Rules

```
/driving-school-guide /driving-school 301
/faq-page /faq 301
/drivingschool /driving-school 301
/privacy-page /privacy 301
/terms-page /terms 301
/es/privacy-page /es/privacy 301
/es/terms-page /es/terms 301
```

When adding new pages, add a redirect here for any legacy or alternate path that might exist
in Cloudflare's cache or in external links.

---

## Security Headers (_headers)

Applied globally via `_headers`. Do not remove or weaken these. The current policy:

- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Strict-Transport-Security` — enforces HTTPS for 1 year including subdomains
- `Content-Security-Policy` — restricts resource loading to trusted origins only
- `Permissions-Policy` — disables camera, microphone, geolocation
- `Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy` — same-origin isolation

**If adding external scripts or fonts**, the CSP must be updated first or the resource will be
blocked silently. Trusted origins already in the policy:
- `https://static.cloudflareinsights.com` (analytics)
- `https://fonts.googleapis.com` (fonts)
- `https://fonts.gstatic.com` (font files)
- `https://cloudflareinsights.com` (analytics connect)

---

## Design System

All pages share a consistent visual design. When adding or editing pages, match these conventions.

**Colors:**
- Background: `#f5f4ef` (off-white / warm)
- Primary green: `#2a6e48` (dark forest green — buttons, accents, nav logo)
- Accent green: `#3ecf6e` (lighter green — highlights, pills)
- Text primary: near-black
- Text muted: gray
- Card background: white with subtle border

**Typography:**
- Headings: Syne (Google Fonts) — bold, tight letter spacing
- Body: DM Sans (Google Fonts) — clean, readable

**Nav:**
- Logo: icon.png + "Passing Lane" text
- EN/ES toggle on every page (top right)
- Language toggle links between `/` and `/es/` equivalents

**Footer:**
- Logo + nav links + copyright
- Copyright line: `© 2025 Passing Lane Solutions LLC. All rights reserved.`

**Copy convention:** No hyphens in written copy. This is a firm preference that applies to all
user-facing text across the site.

---

## Bilingual Structure

Every English page has a Spanish equivalent under `/es/`.

| English | Spanish |
|---|---|
| `/` | `/es/` |
| `/faq/` | `/es/faq/` |
| `/drivers-ed` | `/es/drivers-ed/` |
| `/driving-school/` | `/es/driving-school/` |
| `/insurance` | `/es/insurance/` |
| `/privacy` | `/es/privacy` |
| `/terms` | `/es/terms` |

When adding a new page, always create both the English and Spanish versions. The EN/ES toggle in the
nav must link to the correct counterpart path.

---

## Pages — Purpose and Notes

### index.html — Main landing page
Primary conversion page. Structure:
1. Nav
2. Hero — headline, subheadline, App Store CTA
3. Features grid — 6 feature cards
4. Stats section
5. California section (state-specific callout)
6. Footer

The App Store download button is live. Keep the App Store URL aligned with the live listing:
`https://apps.apple.com/app/passing-lane-ca-dmv-permit/id6762711447`.

The app screenshots carousel is live between the hero and features. Current screenshot assets
live in `/assets/screenshots/`.

### Monthly App Store rating refresh
The homepage JSON-LD includes `aggregateRating` for the live App Store listing. Refresh
`ratingValue` and `ratingCount` monthly from the App Store before editing or deploying the site.
As of July 9, 2026, the live value is 5.0 from 12 ratings.

### faq/index.html — FAQ page
Linked directly from inside the app. Do not break this route. Content includes:
- Badge definitions (pulled from app's `docs/badge-definitions.md`)
- Licensing guide callout
- General app FAQ

### auth/reset-password/index.html — Password reset handoff
This page bridges the Supabase password reset email → the app's deep link.
When a user clicks the reset link in their email, they land here. The page immediately
redirects to `passinglane://auth/reset-password` with the token parameters preserved.
Do not remove or break this page — it is a required part of the auth flow.

### drivers-ed.html — DriversEd.com affiliate page
Live affiliate. Link: `http://go.driversed.com/aff_c?offer_id=2&aff_id=6905`
Target landing page: `https://driversed.com/california/teen-drivers-ed/`

### driving-school/ — Driving school affiliate placeholder
Placeholder. Not yet connected to an active affiliate partner.

### insurance.html — Insurance affiliate placeholder
Placeholder. Outreach drafted to Liberty Mutual (Rakuten), Root Insurance, Insurify.
Not yet connected to an active affiliate partner.

---

## Affiliate Notes

Active affiliates:
- **DriversEd.com** — live, `aff_id=6905`, TUNE/HasOffers platform

Outreach drafted, not yet active:
- NHSA Drivers Ed — `info@usnhsa.com`
- Drivers Ed Direct — `affiliate@DriversEdDirect.com` (contact: Eric Creditor)
- Liberty Mutual — via Rakuten (`ra-libertymutual@mail.rakuten.com`)
- Root Insurance — via form
- Insurify — `affiliates@insurify.com`

**COPPA / AADC warning:** Do not add any tracking pixels, affiliate tracking scripts, or
third-party analytics to the site until COPPA and California AADC compliance is resolved.
The app's teen user base (15–17) creates meaningful legal obligations. This is parked and must
be addressed before any tracking goes live. Read the impact.com Data Protection Agreement
before enabling anything.

---

## Deployment

Push to `main` on GitHub triggers an automatic Cloudflare Pages deployment.

```bash
git add -A && git commit -m "Description" && git push
```

No build step. No build command. Pure static HTML — Cloudflare serves files directly.
Propagation takes ~30 seconds after push.

There is no staging environment. Changes go live immediately on push.

---

## What Is Live

- English landing page at passinglane.app
- Full Spanish version at passinglane.app/es
- EN/ES toggle on every page
- FAQ page at /faq (linked from app)
- Password reset handoff at /auth/reset-password
- DriversEd.com affiliate page at /drivers-ed
- Driving school placeholder at /driving-school
- Insurance placeholder at /insurance
- Privacy and Terms pages in EN and ES
- Security headers applied globally

---

## On the Horizon (Active)

- **App screenshots** — live on index.html as a carousel under the hero. Future screenshot
  updates go in `/assets/screenshots/`.
- **App Store download button** — live. Keep all download links aligned with the live App Store URL.
- **Affiliate tracking** — parked until COPPA/AADC compliance is resolved.

---

## Parked — Do Not Touch Without Explicit Instruction

| Topic | Notes |
|---|---|
| Affiliate tracking / pixels | Blocked on COPPA/AADC compliance |
| Google Play badge | Android version not in scope for v1 |
| Cookie consent banner | Not needed until tracking is added |
| Blog / SEO content | Planned post-launch |
| Pass rate page | Requires real user data before publishing |
