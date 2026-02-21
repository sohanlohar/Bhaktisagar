import aartis from '../data/aartis.json';
import chalisas from '../data/chalisas.json';
import bhajans from '../data/bhajans.json';
import mantras from '../data/mantras.json';

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
 * Combine all devotional content from all categories
 * @returns {Array} Combined array of all items
 */
const getAllContent = () => {
  return [
    ...aartis.map(item => ({ ...item, kind: 'aarti' })),
    ...chalisas.map(item => ({ ...item, kind: 'chalisa' })),
    ...bhajans.map(item => ({ ...item, kind: 'bhajan' })),
    ...mantras.map(item => ({ ...item, kind: 'mantra' })),
  ];
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
    return item.days.includes(weekday) || item.days.includes('daily');
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
  const allContent = getAllContent();
  const filtered = filterByWeekday(allContent, currentWeekday);
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
  const allContent = getAllContent();
  const filtered = filterFeaturedOrPopular(allContent);
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
  const allContent = getAllContent();
  const filtered = filterPopular(allContent);
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
