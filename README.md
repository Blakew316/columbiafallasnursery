# Columbia Nursery & Landscape website

The website for [Columbia Nursery & Landscape](https://columbiafallsnursery.com), a family-owned nursery in Columbia Falls, Montana since 1993. This replaces the old WordPress site. It is a fast static site with no framework and no runtime dependencies. All of its content comes from the old site.

## What's on the site

| Page | URL | Notes |
| --- | --- | --- |
| Home | `/` | Seasonal hero panorama, what we grow, plant finder teaser, custom baskets, this month in the garden, bulk prices, story, visit |
| Our Story | `/about/` | Family history, facts, full-service list, photo gallery |
| The Nursery | `/shop/` | All 8 departments with anchors (`#garden-shop`, `#houseplants`, `#annuals-vegetables`, …) |
| Display Garden | `/display-garden/` | Garden intro, downloadable plant list, every plant by group |
| Plant Finder | `/plants/` | Search and filter all 153 display-garden plants by type, light, zone and features. Filters are kept in the URL, e.g. `/plants/?light=full-shade&feature=deer-resistant` |
| Plant pages | `/plants/<name>/` | One page per plant: specs, description, related plants |
| Custom Baskets | `/custom-baskets/` | How it works, drop-off and care PDFs, 17-design lookbook with light filter and lightbox |
| Bulk Yard | `/bulk-yard/` | 2026 price list, project calculator (yards, cost, delivery, truck fit), the original converters, delivery FAQ |
| Garden Guides | `/educational-handouts/` | All 63 handouts, searchable by name and topic |
| Garden Calendar | `/garden-calendar/` | Month-by-month jobs for the Flathead Valley, each linked to a handout |
| Visit | `/contact/` | Hours with live open/closed status, map, directions, contact form |

Old WordPress URLs are redirected (see `REDIRECTS` in `src/build.mjs`).

The redesign also fixes two bugs on the old site: the bulk-yard calculators were broken by a duplicated element ID, and the bulk-yard FAQ (delivery fees, bucket fills, truck capacity) never displayed.

## Everyday edits

- **Hours, phone, address, sale dates, navigation:** `src/config.mjs`.
  - The Fall Sale banner appears automatically between the dates in `announcements`.
  - Add more date-ranged announcements the same way.
- **Prices, plants, baskets, handouts, page copy:** the JSON files in `src/data/`.
- **Garden calendar tasks:** `src/data/calendar.json`. Each `handout` value must match a title in `handouts.json`.

Then run `npm run build`. When the repo is connected to Netlify, pushing does the build for you.

## Commands

```bash
npm install          # once, for the dev tools (Playwright, used only for checks)
npm run build        # build the site into public/
npm run dev          # build and serve at http://localhost:8080
npm run check        # build, then screenshot every main page and report errors, overflow and broken links
npm run media        # download the old site's photos and PDFs into static/media/
node scripts/icons.mjs   # regenerate favicons, app icons and the social share image
```

## Before switching the domain over (important)

Photos and PDFs still load from the old WordPress server. Each image sits on top of a matching illustration, so if a photo cannot load, the illustration shows instead and nothing looks broken.

1. **Download the media.** Run `npm run media` while the old site is still online, then commit `static/media/`. After that, every build serves local copies.
2. **Turn on form notifications.** The contact form uses Netlify Forms. In the Netlify dashboard, go to *Forms → contact → Notifications* and add the email address that should receive messages.
3. **Confirm the winter hours.** The old site never published them. Outside the season set in `hours.offSeason` (currently Nov 1 – Mar 31, marked unconfirmed), the status pill says "Call for winter hours". Update this in `src/config.mjs`.
4. **Add analytics, if wanted.** The old site used Google tag `GT-M3SP3PGG`. This site ships with no tracking.

## How it's built

- `src/pages/*.mjs` render each page's `<main>`. `src/layout.mjs` is the shared shell (head, header, ribbon, footer), and `src/components.mjs` holds shared pieces.
- `src/art/` contains the generated artwork:
  - the hero panorama
  - the ridge bands
  - the spot illustrations
  - the icons and the logo

  It is all SVG painted with CSS variables, so the larches turn gold in fall, the snow line drops in winter and the greenhouses glow in dark mode.
- `src/styles/` holds the design tokens (`tokens.css`), base and layout styles, plus one file per page in `pages/`.
- `src/scripts/site.js` runs on every page and handles the header, menu, open status, announcements, photo fallbacks, parallax and map. Page scripts live in `src/scripts/pages/`.
- Typography: Apple's system fonts (SF Pro) where available, with Inter as the fallback everywhere else.
