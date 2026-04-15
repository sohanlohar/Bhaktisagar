import aartis from '../data/aartis.json';
import chalisas from '../data/chalisas.json';
import bhajans from '../data/bhajans.json';
import mantras from '../data/mantras.json';

// Build once for performance (filter/sort runs frequently on Home).
const ALL_CONTENT = [
  ...aartis.map((item) => ({ ...item, kind: 'aarti' })),
  ...chalisas.map((item) => ({ ...item, kind: 'chalisa' })),
  ...bhajans.map((item) => ({ ...item, kind: 'bhajan' })),
  ...mantras.map((item) => ({ ...item, kind: 'mantra' })),
];

const CONTENT_BY_ID = new Map(ALL_CONTENT.map((item) => [item.id, item]));

/**
 * Get current weekday in lowercase (monday, tuesday, etc.)
 * @returns {string} Current weekday
 */
export const getCurrentWeekday = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay();
  return days[today];
};

/**
 * Resolve content by id across all JSON datasets (offline-first).
 */
export const resolveContentById = (id) => {
  if (!id) return null;
  return CONTENT_BY_ID.get(id) || null;
};

/**
 * Filter items that match today's weekday or are marked as "daily"
 * @param {Array} items - Array of devotional items
 * @param {string} weekday - Current weekday (e.g., "monday")
 * @returns {Array} Filtered items
 */
const filterByWeekday = (items, weekday) => {
  return items.filter(item => {
    if (!item.days || !Array.isArray(item.days)) return false;
    const w = (weekday || '').toLowerCase();
    return item.days.some((d) => {
      if (typeof d !== 'string') return false;
      const dd = d.toLowerCase();
      return dd === w || dd === 'daily';
    });
  });
};

/**
 * Sort items by priority: isFeatured > isPopular > order
 * @param {Array} items - Array of devotional items
 * @returns {Array} Sorted items
 */
const sortByPriority = (items) => {
  return [...items].sort((a, b) => {
    // First priority: isFeatured
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    
    // Second priority: isPopular
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    
    // Third priority: order (lower is better)
    const orderA = a.order || 999;
    const orderB = b.order || 999;
    return orderA - orderB;
  });
};

/**
 * Filter items that are featured or popular
 * @param {Array} items - Array of devotional items
 * @returns {Array} Filtered items
 */
const filterFeaturedOrPopular = (items) => {
  return items.filter(item => item.isFeatured === true || item.isPopular === true);
};

/**
 * Filter items that are popular
 * @param {Array} items - Array of devotional items
 * @returns {Array} Filtered items
 */
const filterPopular = (items) => {
  return items.filter(item => item.isPopular === true);
};

/**
 * Sort items by order (ascending)
 * @param {Array} items - Array of devotional items
 * @returns {Array} Sorted items
 */
const sortByOrder = (items) => {
  return [...items].sort((a, b) => {
    const orderA = a.order || 999;
    const orderB = b.order || 999;
    return orderA - orderB;
  });
};

/**
 * Limit array to specified number of items
 * @param {Array} items - Array of items
 * @param {number} limit - Maximum number of items
 * @returns {Array} Limited array
 */
const limitItems = (items, limit) => {
  return items.slice(0, limit);
};

/**
 * Get today's devotion items based on weekday
 * Filters items where days contains today's weekday OR "daily"
 * Sorted by: isFeatured > isPopular > order
 * Limited to 6-8 items
 * @param {string} weekday - Current weekday (optional, defaults to today)
 * @returns {Array} Today's devotion items
 */
export const getTodaysDevotion = (weekday = null) => {
  const currentWeekday = weekday || getCurrentWeekday();
  const filtered = filterByWeekday(ALL_CONTENT, currentWeekday);
  const sorted = sortByPriority(filtered);
  return limitItems(sorted, 8);
};

/**
 * Get daily picks (featured/popular items regardless of weekday)
 * Sorted by: isFeatured > isPopular > order
 * Limited to 4-6 items
 * @returns {Array} Daily picks
 */
export const getDailyPicks = () => {
  const filtered = filterFeaturedOrPopular(ALL_CONTENT);
  const sorted = sortByPriority(filtered);
  return limitItems(sorted, 6);
};

/**
 * Get trending/popular items
 * Filters items where isPopular = true
 * Sorted by order
 * Limited to 6-8 items
 * @returns {Array} Trending items
 */
export const getTrending = () => {
  const filtered = filterPopular(ALL_CONTENT);
  const sorted = sortByOrder(filtered);
  return limitItems(sorted, 8);
};

/**
 * Main function to get all home page content
 * Returns structured object with todaysDevotion, dailyPicks, and trending
 * @param {string} weekday - Optional weekday override (for testing)
 * @returns {Object} Home page content structure
 */
export const getHomePageContent = (weekday = null) => {
  return {
    todaysDevotion: getTodaysDevotion(weekday),
    dailyPicks: getDailyPicks(),
    trending: getTrending(),
  };
};
