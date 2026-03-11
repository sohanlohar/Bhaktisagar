import { getPanchangam, Observer } from '@ishubhamx/panchangam-js';

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
  "Bava": "बव",
  "Balava": "बालव",
  "Kaulava": "कौलव",
  "Taitila": "तैतिल",
  "Gar": "गर",
  "Gara": "गर",
  "Vanij": "वणिज",
  "Vanija": "वणिज",
  "Vishti": "विष्टि (भद्रा)",
  "Shakuni": "शकुनि",
  "Chatushpada": "चतुष्पद",
  "Naga": "नाग",
  "Kinstughna": "किंस्तुघ्न",
  "Kimstughna": "किंस्तुघ्न"
};

// Helper to format Date to hh:mm A
const formatTime = (date) => {
  if (!date) return '--:--';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const panchangCache = {};

export async function getTodayPanchang(inputDate) {
  // Logic remains the same...
  try {
    const date = inputDate || new Date();
    const observer = new Observer(28.6139, 77.2090, 0);
    const result = getPanchangam(date, observer);
    const paksha = result.tithi < 15 ? 'शुक्ल' : 'कृष्ण';
    const isPurnimaOrAmavasya = result.tithi === 14 || result.tithi === 29;
    const tithiText = isPurnimaOrAmavasya
      ? TITHI_HINDI[result.tithi]
      : `${paksha} ${TITHI_HINDI[result.tithi]}`;

    return {
      date: date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      shortDate: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      dayName: date.toLocaleDateString('hi-IN', { weekday: 'short' }),
      fullDateObj: date,
      tithi: tithiText,
      nakshatra: NAKSHATRA_HINDI[result.nakshatra] || '--',
      yoga: result.yoga !== undefined ? (YOGA_HINDI[result.yoga] || '--') : '--',
      karana: result.karana ? (KARANA_HINDI[result.karana] || result.karana) : '--',
      rahukal: result.rahuKalamStart && result.rahuKalamEnd
        ? `${formatTime(result.rahuKalamStart)} - ${formatTime(result.rahuKalamEnd)}`
        : '--:--',
      sunrise: formatTime(result.sunrise),
      sunset: formatTime(result.sunset),
      shubh_muhurat: result.abhijitMuhurta
        ? `${formatTime(result.abhijitMuhurta.start)} - ${formatTime(result.abhijitMuhurta.end)}`
        : '--:--',
      rashifal: '--',
      originalData: result
    };
  } catch (error) {
    console.error("Error calculating panchang:", error);
    const fallbackDate = inputDate || new Date();
    return {
      date: fallbackDate.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      shortDate: fallbackDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      dayName: fallbackDate.toLocaleDateString('hi-IN', { weekday: 'short' }),
      fullDateObj: fallbackDate,
      tithi: 'उपलब्ध नहीं',
      nakshatra: '--',
      yoga: '--',
      karana: '--',
      rahukal: '--:--',
      sunrise: '--:--',
      sunset: '--:--',
      shubh_muhurat: '--:--'
    };
  }
}

export async function getNext7DaysPanchang(startDate = new Date()) {
  const promises = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + i);
    promises.push(getTodayPanchang(nextDate));
  }
  return Promise.all(promises);
}

export async function getMonthPanchang(year, month) {
  const cacheKey = `${year}-${month}`;
  if (panchangCache[cacheKey]) {
    return panchangCache[cacheKey];
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const promises = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const nextDate = new Date(year, month, i);
    promises.push(getTodayPanchang(nextDate));
  }

  const monthData = await Promise.all(promises);
  panchangCache[cacheKey] = monthData;
  return monthData;
}
