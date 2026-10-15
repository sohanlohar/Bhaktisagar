import verses from '../data/gitaGyan.json';

export const getDailyGitaGyan = (date = new Date()) => {
  const startOfYear = Date.UTC(date.getFullYear(), 0, 1);
  const currentDay = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayOfYear = Math.floor((currentDay - startOfYear) / 86_400_000);

  return verses[dayOfYear % verses.length];
};
