import { defaultLocale, getDictionary, LocaleCode } from '../i18n/locales';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6366F1', '#06B6D4', '#84CC16', '#EC4899'];

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const pad = (value: number) => String(value).padStart(2, '0');

const toDateInput = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const getCountdown = (date: Date) => {
  const diff = Math.max(0, date.getTime() - Date.now());
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
};

export const getLibraryQuotes = (locale: LocaleCode = defaultLocale) => [...getDictionary(locale).quotes];

export const libraryQuotes = getLibraryQuotes(defaultLocale);

const libraryWeatherBase = {
  tempC: 28,
  weatherId: 801,
  iconCode: '02d',
};

export const getLibraryWeather = (locale: LocaleCode = defaultLocale) => ({
  ...libraryWeatherBase,
  description: getDictionary(locale).weather.description,
});

export const libraryWeather = getLibraryWeather(defaultLocale);

export const todayVisitorTotal = 238;

const roomSeeds = [
  {
    id: 1,
    key: 'reading',
    photo_path: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-10T08:00:00.000Z',
    updated_at: '2026-06-10T08:00:00.000Z',
  },
  {
    id: 2,
    key: 'discussion',
    photo_path: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-12T08:00:00.000Z',
    updated_at: '2026-06-12T08:00:00.000Z',
  },
  {
    id: 3,
    key: 'multimedia',
    photo_path: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-02-03T08:00:00.000Z',
    updated_at: '2026-06-15T08:00:00.000Z',
  },
  {
    id: 4,
    key: 'seminar',
    photo_path: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-02-20T08:00:00.000Z',
    updated_at: '2026-06-18T08:00:00.000Z',
  },
] as const;

export function getDemoRooms(locale: LocaleCode = defaultLocale) {
  const rooms = getDictionary(locale).facility.rooms;
  return roomSeeds.map((room) => {
    const localized = rooms[room.key];
    return {
      id: room.id,
      name: localized.name,
      description: localized.description,
      photo_path: room.photo_path,
      created_at: room.created_at,
      updated_at: room.updated_at,
    };
  });
}

export const demoRooms = getDemoRooms(defaultLocale);

const eventSeeds = [
  {
    id: 1,
    key: 'literacy',
    offset: 2,
    time: '09:00',
    thumbnail_path: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    key: 'journal',
    offset: 6,
    time: '13:30',
    thumbnail_path: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    key: 'bookTalk',
    offset: 11,
    time: '10:00',
    thumbnail_path: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    key: 'orientation',
    offset: 18,
    time: '08:30',
    thumbnail_path: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
  },
] as const;

export function getDemoEvents(locale: LocaleCode = defaultLocale) {
  const items = getDictionary(locale).events.items;

  return eventSeeds.map((event) => {
    const date = addDays(event.offset);
    const [hour, minute] = event.time.split(':').map(Number);
    date.setHours(hour, minute, 0, 0);
    const dateInput = toDateInput(date);
    const localized = items[event.key];

    return {
      id: event.id,
      title: localized.title,
      location: localized.location,
      date: dateInput,
      time: event.time,
      starts_at: `${dateInput}T${event.time}:00.000`,
      thumbnail_path: event.thumbnail_path,
      countdown: getCountdown(date),
      created_at: '2026-06-01T08:00:00.000Z',
      updated_at: '2026-06-20T08:00:00.000Z',
    };
  });
}

const leaderboardSeeds = [
  { member_name: 'Nadia Putri', member_id: '2410431001', facultyKey: 'engineering' },
  { member_name: 'Rafi Pratama', member_id: '2410512004', facultyKey: 'medicine' },
  { member_name: 'Alya Safitri', member_id: '2410611012', facultyKey: 'economics' },
  { member_name: 'Dimas Aditya', member_id: '2410733008', facultyKey: 'law' },
  { member_name: 'Salsa Aulia', member_id: '2410811016', facultyKey: 'humanities' },
  { member_name: 'Fauzan Rahman', member_id: '2410912022', facultyKey: 'science' },
  { member_name: 'Mira Oktavia', member_id: '2411011027', facultyKey: 'agriculture' },
  { member_name: 'Reza Mahendra', member_id: '2411111031', facultyKey: 'social' },
  { member_name: 'Intan Sari', member_id: '2411212033', facultyKey: 'informationTechnology' },
  { member_name: 'Kevin Ananda', member_id: '2411311044', facultyKey: 'nursing' },
] as const;

const buildLeaderboard = (locale: LocaleCode, base: number, step: number, key = 'total') => {
  const faculties = getDictionary(locale).data.faculties;
  return leaderboardSeeds.map(({ member_name, member_id, facultyKey }, index) => {
    const total = base - index * step;
    return {
      rank: index + 1,
      member_name,
      member_id,
      faculty: faculties[facultyKey],
      [key]: total,
      total,
    };
  });
};

const facultyKeys = [
  'engineering',
  'medicine',
  'economics',
  'science',
  'agriculture',
  'informationTechnology',
  'law',
  'social',
] as const;

const weekdayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

const topBooksAllTimeKeys = [
  'researchMethods',
  'libraryScienceBasics',
  'appliedStatistics',
  'informationTechnologyIntro',
  'humanResourceManagement',
  'microEconomics',
  'administrativeLaw',
  'anatomyPhysiology',
  'algorithmsProgramming',
  'academicCommunication',
] as const;

const topBooksMonthKeys = [
  'researchMethods',
  'appliedStatistics',
  'algorithmsProgramming',
  'informationTechnologyIntro',
  'microEconomics',
  'libraryScienceBasics',
  'basicChemistry',
  'administrativeLaw',
  'financialAccounting',
  'academicCommunication',
] as const;

const topBooksYearKeys = [
  'researchMethods',
  'appliedStatistics',
  'libraryScienceBasics',
  'informationTechnologyIntro',
  'algorithmsProgramming',
  'microEconomics',
  'humanResourceManagement',
  'basicChemistry',
  'administrativeLaw',
  'financialAccounting',
] as const;

const buildBookRows = (
  locale: LocaleCode,
  keys: readonly (keyof ReturnType<typeof getDictionary>['data']['books'])[],
  base: number,
  step: number,
) => {
  const books = getDictionary(locale).data.books;
  return keys.map((key, index) => {
    const total = base - index * step;
    return {
      title: books[key],
      total,
      total_loans: total,
      fill: COLORS[index % COLORS.length],
    };
  });
};

const buildChartData = (locale: LocaleCode) => {
  const dictionary = getDictionary(locale);
  const { weekdays, months, faculties, bookCategories } = dictionary.data;

  return {
    weekly: weekdayKeys.map((key, index) => ({
      date: weekdays[key],
      total: [214, 248, 231, 276, 219, 164, 92][index],
    })),
    monthly: monthKeys.map((key, index) => ({
      month: months[key],
      total: [4230, 4685, 5124, 4890, 5388, 5712, 5960, 6215, 6782, 7046, 6833, 6420][index],
    })),
    yearly: [
      { year: 2022, total: 54820 },
      { year: 2023, total: 61240 },
      { year: 2024, total: 68710 },
      { year: 2025, total: 74280 },
      { year: 2026, total: 78150 },
    ],
    topVisitorsMonth: buildLeaderboard(locale, 86, 6),
    topVisitorsYear: buildLeaderboard(locale, 612, 37),
    topFacultiesMonth: facultyKeys.map((key, index) => ({
      fakultas: faculties[key],
      total: 680 - index * 52,
      fill: COLORS[index % COLORS.length],
    })),
    topFacultiesYear: facultyKeys.map((key, index) => ({
      fakultas: faculties[key],
      total: 6420 - index * 410,
      fill: COLORS[index % COLORS.length],
    })),
    bookStats: [
      { category: bookCategories.uniqueTitles, metricKey: 'uniqueTitles', total: 28640, color: '#10B981' },
      { category: bookCategories.totalCopies, metricKey: 'totalCopies', total: 73420, color: '#3B82F6' },
    ],
    topBooksAllTime: buildBookRows(locale, topBooksAllTimeKeys, 920, 58),
    topBooksMonth: buildBookRows(locale, topBooksMonthKeys, 118, 8),
    topBooksYear: buildBookRows(locale, topBooksYearKeys, 720, 44),
    topBorrowersMonth: buildLeaderboard(locale, 42, 3, 'total_loans'),
    topBorrowersYear: buildLeaderboard(locale, 286, 18, 'total_loans'),
  };
};

export const demoChartData: Record<string, any[]> = buildChartData(defaultLocale);

export function getDemoChartData(id: string, locale: LocaleCode = defaultLocale) {
  return clone(buildChartData(locale)[id as keyof ReturnType<typeof buildChartData>] || []);
}

export function getAllDemoChartData(locale: LocaleCode = defaultLocale) {
  const chartData = buildChartData(locale);
  return Object.fromEntries(Object.keys(chartData).map((id) => [id, clone(chartData[id as keyof typeof chartData])]));
}

export const demoAdminUser = {
  username: 'Administrator',
  role: 'Library Manager',
};
