import { getPanchangam, Observer } from '@ishubhamx/panchangam-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = "PANCHANG_YEAR_CACHE";

/* -------------------- CONSTANTS -------------------- */

const TITHI_HINDI = [
  "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
  "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
  "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा",
  "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
  "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
  "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "अमावस्या"
];

const NAKSHATRA_HINDI = [
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा",
  "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी",
  "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा",
  "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा",
  "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती"
];

const YOGA_HINDI = [
  "विष्कुम्भ", "प्रीति", "आयुष्मान", "सौभाग्य", "शोभन", "अतिगण्ड", "सुकर्मा",
  "धृति", "शूल", "गण्ड", "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र",
  "सिद्धि", "व्यतीपात", "वरीयान", "परिघ", "शिव", "सिद्ध", "साध्य",
  "शुभ", "शुक्ल", "ब्रह्म", "इन्द्र", "वैधृति"
];

const KARANA_HINDI = {
  Bava: "बव",
  Balava: "बालव",
  Kaulava: "कौलव",
  Taitila: "तैतिल",
  Gar: "गर",
  Gara: "गर",
  Vanij: "वणिज",
  Vanija: "वणिज",
  Vishti: "विष्टि (भद्रा)",
  Shakuni: "शकुनि",
  Chatushpada: "चतुष्पद",
  Naga: "नाग",
  Kinstughna: "किंस्तुघ्न",
  Kimstughna: "किंस्तुघ्न"
};

/* -------------------- CORE OBJECTS -------------------- */

const observer = new Observer(28.6139, 77.2090, 0);

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true
});

const formatTime = (date) => {
  if (!date) return "--:--";
  return timeFormatter.format(date);
};

/* -------------------- MEMORY CACHE -------------------- */

const dayCache = {};
const monthCache = {};
let yearCache = null;

/* -------------------- DATE KEY -------------------- */

const getKey = (date) => date.toISOString().split("T")[0];

/* -------------------- CORE PANCHANG CALC -------------------- */

function calculatePanchang(date) {

  const result = getPanchangam(date, observer);

  const paksha = result.tithi < 15 ? "शुक्ल " : "कृष्ण ";
  const isSpecial = result.tithi === 14 || result.tithi === 29;

  return {

    date: date.toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" }),

    shortDate: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),

    dayName: date.toLocaleDateString("hi-IN", { weekday: "short" }),

    fullDateObj: date,

    tithi: isSpecial
      ? TITHI_HINDI[result.tithi]
      : paksha + TITHI_HINDI[result.tithi],

    nakshatra: NAKSHATRA_HINDI[result.nakshatra] || "--",

    yoga: YOGA_HINDI[result.yoga] || "--",

    karana: KARANA_HINDI[result.karana] || result.karana || "--",

    rahukal: result.rahuKalamStart && result.rahuKalamEnd
      ? `${formatTime(result.rahuKalamStart)} - ${formatTime(result.rahuKalamEnd)}`
      : "--:--",

    sunrise: formatTime(result.sunrise),

    sunset: formatTime(result.sunset),

    shubh_muhurat: result.abhijitMuhurta
      ? `${formatTime(result.abhijitMuhurta.start)} - ${formatTime(result.abhijitMuhurta.end)}`
      : "--:--",

    rashifal: "--",

    originalData: result
  };
}

/* -------------------- TODAY PANCHANG -------------------- */

export async function getTodayPanchang(inputDate) {

  const date = inputDate || new Date();
  const key = getKey(date);

  if (dayCache[key]) return dayCache[key];

  if (yearCache && yearCache[key]) {
    dayCache[key] = yearCache[key];
    return yearCache[key];
  }

  const data = calculatePanchang(date);

  dayCache[key] = data;

  return data;
}

/* -------------------- NEXT 7 DAYS -------------------- */

export function getNext7DaysPanchang(startDate = new Date()) {

  const result = [];

  for (let i = 0; i < 7; i++) {

    const d = new Date(startDate);

    d.setDate(startDate.getDate() + i);

    result.push(getTodayPanchang(d));
  }

  return Promise.all(result);
}

/* -------------------- MONTH PANCHANG -------------------- */

export async function getMonthPanchang(year, month) {

  const key = `${year}-${month}`;

  if (monthCache[key]) return monthCache[key];

  const daysCount = new Date(year, month + 1, 0).getDate();

  const result = [];

  for (let i = 1; i <= daysCount; i++) {
    const date = new Date(year, month, i);
    const dayData = await getTodayPanchang(date);
    result.push(dayData);

    // Yield back to main thread after every day calc
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  monthCache[key] = result;

  return result;
}

/* -------------------- PRECALCULATE YEAR -------------------- */

export async function preCalculateYearPanchang(year = new Date().getFullYear()) {

  const stored = await AsyncStorage.getItem(CACHE_KEY);

  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.year === year) {
      yearCache = parsed.data;
      return parsed.data;
    }
  }

  const data = {};

  const calculateAllMonths = async () => {
    for (let m = 0; m < 12; m++) {
      const daysCount = new Date(year, m + 1, 0).getDate();
      for (let i = 1; i <= daysCount; i++) {
        const date = new Date(year, m, i);
        const key = getKey(date);
        data[key] = calculatePanchang(date);
        // Yield after EVERY single day for maximum responsiveness
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    yearCache = data;
    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ year, data })
    );
  };

  calculateAllMonths();

  return data;
}