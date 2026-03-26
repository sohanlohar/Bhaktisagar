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

const MASA_HINDI = [
  "चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद",
  "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"
];

const PAKSHA_HINDI = {
  Shukla: "शुक्ल",
  Krishna: "कृष्ण"
};

const SAMVATSARA_HINDI = {
  Prabhava: "प्रभव",
  Vibhava: "विभव",
  Shukla: "शुक्ल",
  Pramoda: "प्रमोद",
  Prajapati: "प्रजापति",
  Angirasa: "अंगिरा",
  Shrimukha: "श्रीमुख",
  Bhava: "भाव",
  Yuva: "युवा",
  Dhata: "धाता",
  Ishwara: "ईश्वर",
  Bahudhanya: "बहुधान्य",
  Pramathi: "प्रमाथी",
  Vikrama: "विक्रम",
  Vrisha: "वृष",
  Chitrabhanu: "चित्रभानु",
  Svabhanu: "स्वभानु",
  Tarana: "तारण",
  Parthiva: "पार्थिव",
  Vyaya: "व्यय",
  Sarvajit: "सर्वजित",
  Sarvajeeth: "सर्वजित",
  Sarvadhari: "सर्वधारी",
  Virodhi: "विरोधी",
  Vikriti: "विकृति",
  Khara: "खर",
  Nandana: "नन्दन",
  Vijaya: "विजय",
  Jaya: "जय",
  Manmatha: "मन्मथ",
  Durmukha: "दुर्मुख",
  Hemalamba: "हेमलम्ब",
  Hevilambi: "हेमलम्ब",
  Vilamba: "विलम्ब",
  Vilambi: "विलम्ब",
  Vikari: "विकारी",
  Sharvari: "शार्वरी",
  Plava: "प्लव",
  Shubhakrit: "शुभकृत",
  Shubhakriti: "शुभकृत",
  Sobhakrit: "शोभकृत",
  Shobhakriti: "शोभकृत",
  Krodhi: "क्रोधी",
  Vishvavasu: "विश्ववसु",
  Parābhava: "पराभव",
  Parabhava: "पराभव",
  Plavanga: "प्लवङ्ग",
  Kilaka: "कीलक",
  Saumya: "सौम्य",
  Sadharana: "साधारण",
  Virodhikrit: "विरोधकृत",
  Paridhavi: "परिधावी",
  Pramadi: "प्रमादी",
  Ananda: "आनन्द",
  Rakshasa: "राक्षस",
  Anala: "अनल",
  Nala: "नल",
  Pingala: "पिंगल",
  Kalayukta: "कालयुक्त",
  Kālayukta: "कालयुक्त",
  Siddharthi: "सिद्धार्थी",
  Raudra: "रौद्र",
  Durmati: "दुर्मति",
  Dundubhi: "दुन्दुभि",
  Rudhirodgari: "रुधिरोद्गारी",
  Raktaksha: "रक्ताक्ष",
  Krodhana: "क्रोधन",
  Akshaya: "अक्षय"
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

  /* ---------- Detailed Tithi Construction ---------- */

  const masaName = MASA_HINDI[result.masa.index] || result.masa.name;
  const pakshaName = PAKSHA_HINDI[result.paksha] || result.paksha;

  // Find current and next tithi from transitions
  const tithiItems = result.tithis || [];
  const currentTithiEntry = tithiItems[0];
  const nextTithiEntry = tithiItems[1];

  let detailedTithi = "";
  let activeTithiName = "";

  if (currentTithiEntry) {
    const name = TITHI_HINDI[currentTithiEntry.index];
    const endTime = formatTime(new Date(currentTithiEntry.endTime));

    // detailedTithi = `${date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}, ${calcDate.toLocaleDateString("hi-IN", { weekday: "long" })} – ${masaName} ${pakshaName} पक्ष ${name}`;
    detailedTithi = `${masaName} ${pakshaName} पक्ष ${name}`;

    if (endTime !== "--:--") {
      detailedTithi += ` (${endTime} तक)`;
    }

    if (nextTithiEntry) {
      detailedTithi += `, उसके बाद ${TITHI_HINDI[nextTithiEntry.index]}`;
    }

    // Determine currently active tithi based on queried time
    const now = new Date();
    const queryDateStr = calcDate.toISOString().split("T")[0];
    const nowDateStr = now.toISOString().split("T")[0];

    // If we're looking at "today", check the real time
    if (queryDateStr === nowDateStr) {
      if (now < new Date(currentTithiEntry.endTime)) {
        activeTithiName = name;
      } else if (nextTithiEntry) {
        activeTithiName = TITHI_HINDI[nextTithiEntry.index];
      } else {
        activeTithiName = name;
      }
    } else {
      // If past/future, just show the primary tithi
      activeTithiName = name;
    }

    detailedTithi += ` | अभी तिथि है ${activeTithiName}।`;
  }

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

    tithiDetailed: detailedTithi,
    activeTithiName: activeTithiName,

    masa: masaName,

    samvat: {
      vikram: result.samvat.vikram,
      shaka: result.samvat.shaka,
      samvatsara: SAMVATSARA_HINDI[result.samvat.samvatsara] || result.samvat.samvatsara
    },

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

export async function preCalculateYearPanchang(
  year,
  options = { chunkSize: 6, yieldMs: 0 },
) {

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

  const { chunkSize, yieldMs } = options || {};
  let processedInChunk = 0;

  while (current <= end) {

    const key = getKey(current);

    data[key] = calculatePanchang(current);

    current.setDate(current.getDate() + 1);

    processedInChunk += 1;
    // Yield to the event loop periodically so navigation/interactions remain responsive.
    if (processedInChunk >= (chunkSize || 6)) {
      processedInChunk = 0;
      await new Promise(resolve => setTimeout(resolve, yieldMs || 0));
    }
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