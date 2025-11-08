export async function getTodayPanchang() {
  return {
    date: new Date().toDateString(),
    tithi: 'शुक्ल प्रतिपदा',
    nakshatra: 'रोहिणी',
    yoga: 'सिद्ध',
    karana: 'किंस्तुघ्न',
  };
}
export async function getNext7DaysPanchang() {
  return Array.from({ length: 7 }).map((_, i) => ({
    date: new Date(Date.now() + (i + 1) * 86400000).toDateString(),
    tithi: 'तिथि',
  }));
}
