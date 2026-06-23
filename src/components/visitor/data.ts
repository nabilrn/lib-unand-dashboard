import { ChartConfig, LoadedChartData } from './types';
import { getAllDemoChartData, getDemoChartData } from '../../data/demoData';
import { defaultLocale, LocaleCode } from '../../i18n/locales';

export const loadChartData = async (config: ChartConfig, locale: LocaleCode = defaultLocale): Promise<LoadedChartData> => {
  return {
    id: config.id,
    data: getDemoChartData(config.id, locale),
    lastUpdated: new Date(),
    source: 'local',
    status: 'success',
  };
};

export const loadAllCharts = async (locale: LocaleCode = defaultLocale) => {
  return getAllDemoChartData(locale);
};
