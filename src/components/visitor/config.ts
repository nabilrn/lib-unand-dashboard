import { defaultLocale, getDictionary, LocaleCode } from '../../i18n/locales';
import {
  BookStatsResponse,
  ChartConfig,
  MonthlyVisitorsResponse,
  TopBooksResponse,
  TopBorrowersResponse,
  TopFacultiesResponse,
  TopVisitorsResponse,
  WeeklyVisitorsResponse,
  YearlyVisitorsResponse,
} from './types';

export const getChartConfigs = (locale: LocaleCode = defaultLocale): ChartConfig[] => {
  const dictionary = getDictionary(locale);
  const { charts, data, leaderboard } = dictionary;
  const facultyFallbacks = Object.values(data.faculties);

  return [
    {
      id: 'events',
      title: charts.events.title,
      subtitle: charts.events.subtitle,
      type: 'events',
      endpoint: null,
      dataKey: null,
      xKey: null,
      formatter: (d: any) => d,
    },
    {
      id: 'weekly',
      title: charts.weekly.title,
      subtitle: charts.weekly.subtitle,
      type: 'bar',
      endpoint: null,
      dataKey: 'total',
      xKey: 'date',
      formatter: (data: WeeklyVisitorsResponse) => data.days,
    },
    {
      id: 'monthly',
      title: charts.monthly.title,
      subtitle: charts.monthly.subtitle,
      type: 'area',
      endpoint: null,
      dataKey: 'total',
      xKey: 'month',
      formatter: (data: MonthlyVisitorsResponse) => data.months.reverse(),
    },
    {
      id: 'yearly',
      title: charts.yearly.title,
      subtitle: charts.yearly.subtitle,
      type: 'line',
      endpoint: null,
      dataKey: 'total',
      xKey: 'year',
      formatter: (data: YearlyVisitorsResponse) => data.years.reverse(),
    },
    {
      id: 'topVisitorsMonth',
      title: charts.topVisitorsMonth.title,
      subtitle: charts.topVisitorsMonth.subtitle,
      type: 'leaderboard',
      subtype: 'visitors',
      endpoint: null,
      dataKey: 'total',
      xKey: 'member_name',
      formatter: (data: TopVisitorsResponse) => data.visitors.slice(0, 10).map((item, index) => ({
        ...item,
        rank: index + 1,
        member_name: item.member_name || `${leaderboard.member} ${index + 1}`,
        member_id: item.member_id || `2024${String(index + 1).padStart(4, '0')}`,
        faculty: item.fakultas || facultyFallbacks[index % facultyFallbacks.length],
      })),
    },
    {
      id: 'topVisitorsYear',
      title: charts.topVisitorsYear.title,
      subtitle: charts.topVisitorsYear.subtitle,
      type: 'leaderboard',
      subtype: 'visitors',
      endpoint: null,
      dataKey: 'total',
      xKey: 'member_name',
      formatter: (data: TopVisitorsResponse) => data.visitors.slice(0, 10).map((item, index) => ({
        ...item,
        rank: index + 1,
        member_name: item.member_name || `${leaderboard.member} ${index + 1}`,
        member_id: item.member_id || `2024${String(index + 1).padStart(4, '0')}`,
        faculty: item.fakultas || facultyFallbacks[index % facultyFallbacks.length],
      })),
    },
    {
      id: 'topFacultiesMonth',
      title: charts.topFacultiesMonth.title,
      subtitle: charts.topFacultiesMonth.subtitle,
      type: 'radialBar',
      endpoint: null,
      dataKey: 'total',
      xKey: 'fakultas',
      formatter: (data: TopFacultiesResponse) => data.faculties.slice(0, 8).map((item) => ({
        ...item,
        fakultas: item.fakultas || dictionary.data.faculties.other,
      })),
    },
    {
      id: 'topFacultiesYear',
      title: charts.topFacultiesYear.title,
      subtitle: charts.topFacultiesYear.subtitle,
      type: 'radialBar',
      endpoint: null,
      dataKey: 'total',
      xKey: 'fakultas',
      formatter: (data: TopFacultiesResponse) => data.faculties.slice(0, 8).map((item) => ({
        ...item,
        fakultas: item.fakultas || dictionary.data.faculties.other,
      })),
    },
    {
      id: 'bookStats',
      title: charts.bookStats.title,
      subtitle: charts.bookStats.subtitle,
      type: 'kpi',
      endpoint: null,
      dataKey: 'total',
      xKey: 'category',
      formatter: (data: BookStatsResponse) => [
        { category: dictionary.data.bookCategories.uniqueTitles, metricKey: 'uniqueTitles', total: data.total_unique_titles, color: '#10B981' },
        { category: dictionary.data.bookCategories.totalCopies, metricKey: 'totalCopies', total: data.total_items, color: '#3B82F6' },
      ],
    },
    {
      id: 'topBooksAllTime',
      title: charts.topBooksAllTime.title,
      subtitle: charts.topBooksAllTime.subtitle,
      type: 'pie',
      endpoint: null,
      dataKey: 'total_loans',
      xKey: 'title',
      formatter: (data: TopBooksResponse) => {
        const colors = ['#1E3A8A', '#2563EB', '#10B981', '#059669', '#047857', '#7C3AED', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444'];
        return data.books.slice(0, 10).map((item, index) => ({
          title: item.title,
          total: item.total_loans,
          fill: colors[index % colors.length],
        }));
      },
    },
    {
      id: 'topBooksMonth',
      title: charts.topBooksMonth.title,
      subtitle: charts.topBooksMonth.subtitle,
      type: 'pie',
      endpoint: null,
      dataKey: 'total_loans',
      xKey: 'title',
      formatter: (data: TopBooksResponse) => {
        const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6366F1', '#06B6D4', '#84CC16', '#EC4899', '#8B5CF6', '#F97316'];
        return data.books.slice(0, 10).map((item, index) => ({
          title: item.title,
          total: item.total_loans,
          fill: colors[index % colors.length],
        }));
      },
    },
    {
      id: 'topBooksYear',
      title: charts.topBooksYear.title,
      subtitle: charts.topBooksYear.subtitle,
      type: 'pie',
      endpoint: null,
      dataKey: 'total_loans',
      xKey: 'title',
      formatter: (data: TopBooksResponse) => {
        const colors = ['#10B981', '#34D399', '#6EE7B7', '#3B82F6', '#60A5FA', '#8B5CF6', '#EC4899', '#F59E0B', '#F97316', '#EF4444'];
        return data.books.slice(0, 10).map((item, index) => ({
          title: item.title,
          total: item.total_loans,
          fill: colors[index % colors.length],
        }));
      },
    },
    {
      id: 'topBorrowersMonth',
      title: charts.topBorrowersMonth.title,
      subtitle: charts.topBorrowersMonth.subtitle,
      type: 'leaderboard',
      subtype: 'borrowers',
      endpoint: null,
      dataKey: 'total_loans',
      xKey: 'member_name',
      formatter: (data: TopBorrowersResponse) => data.borrowers.slice(0, 10).map((item, index) => {
        const total = item.total_loans;
        return {
          ...item,
          rank: index + 1,
          member_name: item.member_name || `${leaderboard.borrower} ${index + 1}`,
          member_id: item.member_id == null ? `2024${String(index + 1).padStart(4, '0')}` : String(item.member_id),
          faculty: item.fakultas || facultyFallbacks[index % facultyFallbacks.length],
          total,
        };
      }),
    },
    {
      id: 'topBorrowersYear',
      title: charts.topBorrowersYear.title,
      subtitle: charts.topBorrowersYear.subtitle,
      type: 'leaderboard',
      subtype: 'borrowers',
      endpoint: null,
      dataKey: 'total_loans',
      xKey: 'member_name',
      formatter: (data: TopBorrowersResponse) => data.borrowers.slice(0, 10).map((item, index) => {
        const total = item.total_loans;
        return {
          ...item,
          rank: index + 1,
          member_name: item.member_name || `${leaderboard.borrower} ${index + 1}`,
          member_id: item.member_id == null ? `2024${String(index + 1).padStart(4, '0')}` : String(item.member_id),
          faculty: item.fakultas || facultyFallbacks[index % facultyFallbacks.length],
          total,
        };
      }),
    },
  ];
};

export const chartConfigs = getChartConfigs(defaultLocale);
