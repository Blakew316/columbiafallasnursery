/**
 * Business facts, navigation and the date-ranged sale notice.
 * This is the one file to edit for day-to-day changes.
 */

export const SITE_URL = 'https://columbiafallsnursery.com';

export const business = {
  name: 'Columbia Nursery & Landscape',
  shortName: 'Columbia Nursery',
  founded: 1993,
  address: { street: '2544 9th St. W', city: 'Columbia Falls', region: 'MT', postal: '59912', country: 'US' },
  phone: { display: '(406) 892-0339', tel: '+14068920339' },
  social: {
    instagram: 'https://www.instagram.com/columbianursery/',
    facebook: 'https://www.facebook.com/people/Columbia-Nursery-and-Landscape/100039759895183/',
  },
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Columbia+Nursery+%26+Landscape%2C+2544+9th+St+W%2C+Columbia+Falls%2C+MT+59912',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Columbia%20Nursery%20%26%20Landscape%2C%202544%209th%20St%20W%2C%20Columbia%20Falls%2C%20MT%2059912&t=m&z=14&output=embed',
};

/** Opening hours (0 = Sunday), 24h "HH:MM", in the nursery's time zone. */
export const hours = {
  timeZone: 'America/Denver',
  summary: 'Monday to Saturday, 9 am to 5:30 pm',
  week: [
    null,
    { open: '09:00', close: '17:30' },
    { open: '09:00', close: '17:30' },
    { open: '09:00', close: '17:30' },
    { open: '09:00', close: '17:30' },
    { open: '09:00', close: '17:30' },
    { open: '09:00', close: '17:30' },
  ],
};

/** Shown on Home and The Nursery between start and end ("MM-DD", inclusive). */
export const announcements = [
  {
    id: 'fall-sale',
    start: '09-01',
    end: '10-31',
    title: 'Fall Sale',
    deal: '20 to 50% off the entire nursery.',
    until: 'Through October 31.',
    text: '20 to 50% off the entire nursery through October 31.',
    href: '/shop/',
  },
];

/** Primary navigation, in display order. */
export const nav = [
  { href: '/about/', label: 'About' },
  { href: '/shop/', label: 'Nursery' },
  { href: '/plants/', label: 'Plants' },
  { href: '/custom-baskets/', label: 'Baskets' },
  { href: '/bulk-yard/', label: 'Bulk Yard' },
  { href: '/educational-handouts/', label: 'Guides' },
  { href: '/contact/', label: 'Visit' },
];

/** Footer links. */
export const footerNav = [
  { href: '/about/', label: 'About' },
  { href: '/shop/', label: 'Nursery' },
  { href: '/display-garden/', label: 'Display Garden' },
  { href: '/plants/', label: 'Plants' },
  { href: '/custom-baskets/', label: 'Custom Baskets' },
  { href: '/bulk-yard/', label: 'Bulk Yard' },
  { href: '/educational-handouts/', label: 'Garden Guides' },
  { href: '/garden-calendar/', label: 'Garden Calendar' },
  { href: '/contact/', label: 'Visit' },
];
