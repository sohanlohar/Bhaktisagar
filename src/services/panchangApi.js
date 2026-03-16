import { getPanchangam, Observer } from "@ishubhamx/panchangam-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ---------------- CONSTANTS ---------------- */

const CACHE_KEY = "PANCHANG_YEAR_CACHE";

const observer = new Observer(28.6139, 77.2090, 0);

/* ---------------- TRANSLATIONS ---------------- */

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

/* ---------------- MEMORY CACHE ---------------- */

const dayCache = {};
const monthCache = {};
let yearCache = null;

/* ---------------- HELPERS ---------------- */

const formatTime = date => {
  if (!date) return "--:--";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

const normalizeDate = date => {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0); // midday to avoid tithi switch
  return d;
};

const getKey = date =>
  normalizeDate(date).toISOString().split("T")[0];

/* ---------------- CORE CALC ---------------- */

function calculatePanchang(date) {

  const calcDate = normalizeDate(date);

  const result = getPanchangam(calcDate, observer);

  const tithiIdx = result.tithi;
  const nakshatraIdx = result.nakshatra;
  const yogaIdx = result.yoga;

  const paksha = result.tithi < 15 ? "शुक्ल " : "कृष्ण ";

  const isSpecial =
    result.tithi === 14 || result.tithi === 29;

  return {

    date: calcDate.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }),

    shortDate: calcDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    }),

    dayName: calcDate.toLocaleDateString("hi-IN", {
      weekday: "short"
    }),

    fullDateObj: calcDate,

    tithi: isSpecial
      ? TITHI_HINDI[tithiIdx]
      : paksha + TITHI_HINDI[tithiIdx],

    nakshatra: NAKSHATRA_HINDI[nakshatraIdx] || "--",

    yoga: YOGA_HINDI[yogaIdx] || "--",

    karana: KARANA_HINDI[result.karana] || result.karana || "--",

    rahukal:
      result.rahuKalamStart && result.rahuKalamEnd
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

/* ---------------- TODAY ---------------- */

export async function getTodayPanchang(date = new Date()) {

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

/* ---------------- MONTH ---------------- */

export async function getMonthPanchang(year, month) {

  const key = `${year}-${month}`;

  if (monthCache[key]) return monthCache[key];

  const days = new Date(year, month + 1, 0).getDate();

  const result = [];

  for (let i = 1; i <= days; i++) {

    const date = new Date(year, month, i);

    const data = await getTodayPanchang(date);

    result.push(data);
  }

  monthCache[key] = result;

  return result;
}

/* ---------------- YEAR PRECALC ---------------- */

export async function preCalculateYearPanchang(year) {

  const stored = await AsyncStorage.getItem(CACHE_KEY);

  if (stored) {

    const parsed = JSON.parse(stored);

    if (parsed.year === year) {

      yearCache = parsed.data;

      return parsed.data;
    }
  }

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const data = {};

  const current = new Date(start);

  while (current <= end) {

    const key = getKey(current);

    data[key] = calculatePanchang(current);

    current.setDate(current.getDate() + 1);
  }

  yearCache = data;

  await AsyncStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      year,
      data
    })
  );

  return data;
}