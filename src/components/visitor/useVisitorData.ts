import { useCallback, useEffect, useMemo, useState } from 'react';
import { getChartConfigs } from './config';
import { ConnectionStatus } from './types';
import { getAllDemoChartData } from '../../data/demoData';
import { useLocale } from '../../i18n/LocaleContext';

export const useVisitorData = () => {
  const { locale } = useLocale();
  const chartConfigs = useMemo(() => getChartConfigs(locale), [locale]);
  const [chartIndex, setChartIndex] = useState(0);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [data, setData] = useState<Record<string, any[]>>({});

  const rotate = useCallback(() => {
    setChartIndex((p) => (p + 1) % chartConfigs.length);
  }, [chartConfigs.length]);

  const load = useCallback(() => {
    setStatus('connecting');
    setData(getAllDemoChartData(locale));
    setStatus('connected');
    setLastUpdated(new Date());
  }, [locale]);

  useEffect(() => {
    setChartIndex((current) => Math.min(current, chartConfigs.length - 1));
  }, [chartConfigs.length]);

  useEffect(() => {
    load();
    const rot = setInterval(rotate, 12000);
    const ref = setInterval(load, 3 * 60 * 1000);
    return () => { clearInterval(rot); clearInterval(ref); };
  }, [load, rotate]);

  return { chartConfigs, chartIndex, setChartIndex, status, lastUpdated, data, reload: load };
};
