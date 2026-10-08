/**
 * Photography used across the site.
 *
 * Landscape and plant scenes are 4K photos from Pexels (free for commercial
 * use, no attribution required; https://www.pexels.com/license/), served at
 * up to 3840px through Pexels' image CDN. Everything that shows the nursery
 * itself (family, staff, baskets, the display garden, plant profiles) is the
 * nursery's own photography from the previous site.
 *
 * Each stock photo names a `fallback` from the nursery's own photos, used if
 * the stock image ever fails to load.
 */
import photos from './data/photos.json' with { type: 'json' };

export const pexelsUrl = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const PHOTOS = {
  // Saint Mary Lake and Wild Goose Island, Glacier National Park (Adriaan Greyling).
  glacierLake: { pexels: 18654646, alt: 'Saint Mary Lake and the peaks of Glacier National Park', fallback: photos.evergreens },
  // Grinnell Point above Swiftcurrent Lake, Glacier National Park (Colon Freld).
  montanaPeaks: { pexels: 9017829, alt: 'Mountains, lake and forest in Glacier National Park, Montana', fallback: photos.evergreens2 },
  // A mountain lake under dramatic clouds, Glacier National Park (Mark Burnett).
  glacierReflection: { pexels: 1095817, alt: 'A mountain lake under dramatic clouds in Glacier National Park', fallback: photos.evergreens2 },
  // Fog over a pine forest (Adrian Newell).
  pineForest: { pexels: 10195042, alt: 'Pine forest in morning fog', fallback: photos.evergreens },
  // Petunias and hanging baskets under glass (Oleg Nagovski).
  greenhouse: { pexels: 12315415, alt: 'Petunias and hanging baskets in a sunlit greenhouse', fallback: photos.flowers },
  // Echinacea in a summer garden.
  coneflowers: { pexels: 20884056, alt: 'Pink coneflowers in a summer garden', fallback: photos.displayGarden },
  // Lavender in bloom.
  lavender: { pexels: 1201538, alt: 'Lavender in full bloom', fallback: photos.displayGarden },
  // A dahlia in bloom.
  dahlia: { pexels: 6710305, alt: 'A dahlia in full bloom', fallback: photos.cutFlowers },
  // Golden larches in an autumn valley (Francesco Sommacal).
  autumn: { pexels: 19829085, alt: 'Golden larches in an autumn mountain valley', fallback: photos.evergreens2 },
  // Landscape stone.
  stone: { pexels: 214045, alt: 'Landscape stone', fallback: photos.bulkSign },

  // Nursery work: growing, potting, watering and planting.
  // Planting a young tree (Collines Omondi).
  plantingTree: { pexels: 18468252, alt: 'Planting a young tree', fallback: photos.evergreens },
  // Carrying a flat of flowering annuals through the greenhouse.
  trayOfFlowers: { pexels: 6510856, alt: 'Carrying a tray of flowering plants in a greenhouse', fallback: photos.flowers },
  // Watering in a sunlit greenhouse (Karola G).
  wateringGreenhouse: { pexels: 4750272, alt: 'Watering plants in a sunlit greenhouse', fallback: photos.watering },
  // Seedlings coming up in pots (Greta Hoffman).
  seedlings: { pexels: 7728883, alt: 'Seedlings growing in pots', fallback: photos.potting },
  // Potted perennials set out in the garden (TIVASEE).
  pottedGarden: { pexels: 10939348, alt: 'Potted plants set out in the garden', fallback: photos.plants1 },
  // Fresh-cut flowers in buckets (Josh Hild).
  flowerBuckets: { pexels: 18091890, alt: 'Fresh-cut flowers in buckets', fallback: photos.cutFlowers },
  // Shelves of potted greenery in a plant shop.
  plantShop: { pexels: 4947376, alt: 'Shelves of potted houseplants', fallback: photos.houseplants },
  // Clay pots on shop shelves.
  clayPotsShop: { pexels: 14723067, alt: 'Clay pots on shop shelves', fallback: photos.planters },
  // Garden tools on a wooden table.
  gardenTools: { pexels: 5934017, alt: 'Garden tools on a wooden table', fallback: photos.planters },
  // Wood chip mulch (Mike Bird).
  woodChips: { pexels: 4167967, alt: 'Wood chip mulch', fallback: photos.bulkSign },

  // The nursery's own photography.
  family: { src: photos.family.replace('-1024x576', '-2048x1152'), alt: 'The family behind Columbia Nursery & Landscape', fallback: photos.family },
  staff: { src: photos.staff, alt: 'The Columbia Nursery team' },
  displayGarden: { src: photos.displayGarden, alt: 'The display garden at Columbia Nursery' },
  basket: { src: photos.basket, alt: 'A custom basket planted at Columbia Nursery' },
  basket2: { src: photos.basket2, alt: 'A custom basket planted at Columbia Nursery' },
  basket3: { src: photos.basket3, alt: 'A hanging basket grown at Columbia Nursery' },
  nurseryFlowers: { src: photos.flowers, alt: 'Flowers in the Columbia Nursery greenhouses' },
  gallery: [
    ['watering', 'Watering in the greenhouse'],
    ['selection', 'Plants ready for the season'],
    ['potting', 'Potting up'],
    ['plants1', 'Greenhouse plants'],
    ['plants2', 'Greenhouse plants'],
    ['planters', 'Planters'],
    ['flowers', 'Flowers in the greenhouse'],
    ['houseplants', 'Houseplants'],
    ['thirdGen', 'The third generation at Columbia Nursery'],
  ].map(([key, alt]) => ({ src: photos[key], alt })),
  logo: photos.logo,
};
