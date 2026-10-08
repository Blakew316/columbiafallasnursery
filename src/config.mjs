/**
 * Business facts, navigation and seasonal messaging.
 *
 * This is the one file to edit for day-to-day changes (hours, sale dates,
 * phone). Everything here comes from the previous columbiafallsnursery.com
 * site; values marked `confirmed: false` are best guesses the owners should
 * check before launch (see README).
 */

export const SITE_URL = 'https://columbiafallsnursery.com';

export const business = {
  name: 'Columbia Nursery & Landscape',
  shortName: 'Columbia Nursery',
  founded: 1993,
  address: {
    street: '2544 9th St. W',
    city: 'Columbia Falls',
    region: 'MT',
    postal: '59912',
    country: 'US',
  },
  phone: { display: '(406) 892-0339', tel: '+14068920339' },
  social: {
    instagram: 'https://www.instagram.com/columbianursery/',
    facebook: 'https://www.facebook.com/people/Columbia-Nursery-and-Landscape/100039759895183/',
  },
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Columbia+Nursery+%26+Landscape%2C+2544+9th+St+W%2C+Columbia+Falls%2C+MT+59912',
  mapEmbedUrl: 'https://maps.google.com/maps?q=2544%209th%20St%20W%2C%20Columbia%20Falls%2C%20MT%2059912&t=m&z=14&output=embed',
};

/**
 * Weekly opening hours in the nursery's own time zone. Days use JS numbering
 * (0 = Sunday). Times are 24h "HH:MM".
 */
export const hours = {
  timeZone: 'America/Denver',
  summary: 'Monday–Saturday, 9:00 am – 5:30 pm',
  week: [
    null, // Sunday: closed
    { open: '09:00', close: '17:30' },
    { open: '09:00', close: '17:30' },
    { open: '09:00', close: '17:30' },
    { open: '09:00', close: '17:30' },
    { open: '09:00', close: '17:30' },
    { open: '09:00', close: '17:30' },
  ],
  /**
   * The old site says the season runs "through closing, roughly October 31".
   * Winter hours were never published, so between these dates the status
   * pill asks people to call ahead instead of claiming open/closed.
   * Dates are "MM-DD" and wrap over New Year.
   */
  offSeason: { start: '11-01', end: '03-31', confirmed: false },
};

/**
 * Date-ranged announcements. The first one whose window contains today is
 * shown in the hero and the top of the site. Dates are "MM-DD", inclusive.
 */
export const announcements = [
  {
    id: 'fall-sale',
    start: '09-01',
    end: '10-31',
    title: 'Annual Fall Sale',
    text: '20–50% off the entire nursery, September 1 through closing (roughly October 31).',
    short: 'Fall Sale: 20–50% off the entire nursery',
    href: '/shop/',
  },
];

/** Primary navigation, in display order. */
export const nav = [
  { href: '/about/', label: 'Our Story' },
  { href: '/shop/', label: 'The Nursery' },
  { href: '/display-garden/', label: 'Display Garden' },
  { href: '/plants/', label: 'Plant Finder' },
  { href: '/custom-baskets/', label: 'Custom Baskets' },
  { href: '/bulk-yard/', label: 'Bulk Yard' },
  { href: '/educational-handouts/', label: 'Garden Guides' },
  { href: '/contact/', label: 'Visit' },
];

/** Footer link groups. */
export const footerNav = [
  {
    title: 'Explore',
    links: [
      { href: '/shop/', label: 'The Nursery' },
      { href: '/display-garden/', label: 'Display Garden' },
      { href: '/plants/', label: 'Plant Finder' },
      { href: '/about/', label: 'Our Story' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/custom-baskets/', label: 'Custom Baskets' },
      { href: '/bulk-yard/', label: 'Bulk Yard & Pricing' },
      { href: '/bulk-yard/#calculator', label: 'Project Calculator' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { href: '/educational-handouts/', label: 'Garden Guides' },
      { href: '/garden-calendar/', label: 'Garden Calendar' },
    ],
  },
];

/**
 * Seasons drive the hero illustration (larch colour, snow line) and accent
 * tint. Months are 1-based; the first match wins.
 */
export const seasons = [
  { id: 'winter', months: [12, 1, 2] },
  { id: 'spring', months: [3, 4, 5] },
  { id: 'summer', months: [6, 7, 8] },
  { id: 'fall', months: [9, 10, 11] },
];
