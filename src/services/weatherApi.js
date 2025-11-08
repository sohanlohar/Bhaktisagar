const API = 'https://api.openweathermap.org/data/2.5';
const KEY = 'YOUR_KEY_HERE';
export async function getToday(lat, lon) {
  const r = await fetch(
    `${API}/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&lang=hi`,
  );
  return r.json();
}
export async function get7Day(lat, lon) {
  const r = await fetch(
    `${API}/forecast?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&lang=hi`,
  );
  return r.json();
}
