# Columbia Nursery & Landscape website

The website for [Columbia Nursery & Landscape](https://columbiafallsnursery.com), a family-owned nursery in Columbia Falls, Montana since 1993. This replaces the old WordPress site. It is a fast static site with no framework and no runtime dependencies. All of its content comes from the old site.

## What's on the site

| Page | URL | Notes |
| --- | --- | --- |
| Home | `/` | Glacier National Park hero, In the nursery now (seasonal), what we grow, plant search, custom baskets, reviews, bulk prices, visit with Google Map |
| Our Story | `/about/` | Family history, facts, full-service list, photo gallery |
| The Nursery | `/shop/` | All 8 departments with anchors (`#garden-shop`, `#houseplants`, `#annuals-vegetables`, …) |
| Display Garden | `/display-garden/` | Garden intro, downloadable plant list, every plant by group |
| Plant Finder | `/plants/` | Search all 153 display-garden plants, filter by type and light. Filters are kept in the URL, e.g. `/plants/?category=shrub&light=full-shade` |
| Plant pages | `/plants/<name>/` | One page per plant: specs, description, related plants |
| Custom Baskets | `/custom-baskets/` | How it works, drop-off and care PDFs, 17 designs with a sun or shade filter, and a basket request form ("Choose this design" fills it in) |
| Bulk Yard | `/bulk-yard/` | 2026 price list, yardage and cost calculator, Friday delivery request form (prefilled from the calculator), delivery FAQ |
| Garden Guides | `/educational-handouts/` | All 63 handouts, searchable by name and topic |
| Garden Calendar | `/garden-calendar/` | Month-by-month jobs for the Flathead Valley, each linked to a handout |
| Visit | `/contact/` | Hours, Google Map, directions, contact form |

Old WordPress URLs are redirected (see `REDIRECTS` in `src/build.mjs`).

The redesign also fixes two bugs on the old site: the bulk-yard calculators were broken by a duplicated element ID, and the bulk-yard FAQ (delivery fees, bucket fills, truck capacity) never displayed.

## Everyday edits

- **Hours, phone, address, sale dates, navigation:** `src/config.mjs`. The Fall Sale line shows automatically between the dates in `announcements`.
- **Prices, plants, baskets, handouts, page copy:** the JSON files in `src/data/`.
- **In the nursery now (home page):** `src/data/now.json`. Three cards per season, each with dates, a title, one line, a link and a photo.
- **Reviews (home page):** `src/data/reviews.json`. Ratings link to Yelp and Nextdoor. Add real customer quotes (word for word, with permission) to `quotes` and they appear automatically.
- **Garden calendar tasks:** `src/data/calendar.json`. Each `handout` value must match a title in `handouts.json`.

Then run `npm run build`. When the repo is connected to Netlify, pushing does the build for you.

## Commands

```bash
npm install          # once, for the dev tools (Playwright, used only for checks)
npm run build        # build the site into public/
npm run dev          # build and serve at http://localhost:8080
npm run check        # build, then screenshot every main page and report errors, overflow and broken links
npm run media        # download the old site's photos and PDFs into static/media/
```

## Before switching the domain over (important)

The nursery's own photos, logo and PDFs still load from the old WordPress server.

1. **Download the media.** Run `npm run media` while the old site is still online, then commit `static/media/`. After that, every build serves local copies.
2. **Turn on form notifications.** Three forms use Netlify Forms: `contact`, `custom-basket` and `bulk-delivery`. In the Netlify dashboard, open *Forms*, choose each one, and add the email address that should receive it under *Notifications*.
3. **Add analytics, if wanted.** The old site used Google tag `GT-M3SP3PGG`. This site ships with no tracking.

## How it's built

- `src/pages/*.mjs` render each page. `src/layout.mjs` is the shared shell, and `src/components.mjs` holds the photo, link and map helpers.
- `src/photos.mjs` lists every photo. Landscape and plant scenes are 4K Pexels photos (free for commercial use, https://www.pexels.com/license/) served at up to 3840px. Everything that shows the nursery itself (family, staff, baskets, the display garden, plant profiles) is the nursery's own photography. If a stock photo ever fails to load, the nursery's own photo takes its place.
- `src/styles/` holds the tokens, base and layout styles, and one file per page.
- Type is Apple's system font (SF Pro), with Inter as the fallback. Nothing animates.
- House style: no em dashes. The build turns any that slip into the copy into commas or hyphens.
