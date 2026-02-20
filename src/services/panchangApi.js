export async function getTodayPanchang() {
  return {
    date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    tithi: 'शुक्ल प्रतिपदा',
    nakshatra: 'रोहिणी',
    yoga: 'सिद्ध',
    karana: 'किंस्तुघ्न',
    rahukal: '08:30 AM - 10:00 AM',
    sunrise: '06:45 AM',
    sunset: '06:15 PM',
    shubh_muhurat: '11:45 AM - 12:30 PM',
    rashifal: 'धनु: सफलता का योग है...',
  };
}
export async function getNext7DaysPanchang() {
  return Array.from({ length: 7 }).map((_, i) => ({
    date: new Date(Date.now() + (i + 1) * 86400000).toDateString(),
    tithi: 'तिथि',
  }));
}
